var postMessageHelper={
	connect:{},
	master:function(pack,callback){
		if(pack.token){
			var status=2;
		}else{
			pack.token=Date.now();
			var status=0;
		}
		
		var send={
			sendData:pack.sendData,
			connect:pack.connect,
			token:pack.token,
			status:status,
		}
		if(status==0){
			var connectTimer=setInterval(function(){
				pack.source.postMessage(send,"*");
			},500)
		}else 
		if(status==2){
			pack.source.postMessage(send,"*");
		}
		
		window.addEventListener("message",function(e){
			if(e.data.connect!=pack.connect)return;
			if(e.data.token!=pack.token)return;
			if(e.data.status==1){
				clearTimeout(connectTimer);
			}
			if(e.data.status==2){
				callback && callback(e.data.sendData)
			}
		},false)
	},
	slave:function(connect,sendData){
		var self=this;
		if(this.connect[connect]){
			clearTimeout($scope.post_message_slave_timer);
			$scope.post_message_slave_timer=setTimeout(function(){
				var pack=self.connect[connect];
				pack.sendData=sendData;
				self.master(pack)
			},0)
		}else{
			window.addEventListener("message",function(e){
				if(e.data.status==0){
					var send={
						status:1,
						connect:connect,
						token:e.data.token,
					}
					e.source.postMessage(send,"*");
					var pack={
						source:e.source,
						token:e.data.token,
						connect:connect,
					}
					self.connect[connect]=pack;
					self.slave(connect,sendData)
				}
			},false);
		}
	},
}