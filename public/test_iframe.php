<!DOCTYPE html>
<html>
	<head>
		<script src="js/jquery-1.12.4.min.js?t=<?=time()?>"></script>

		<script>
		$(document).ready(function(){
			$("textarea").keyup(function(e){
				console.log($(this).val())
				$("#ggwp").css("width",$(this).val()+"px");
			})
		})
		
		</script>
	</head>
	<body>
		
		<textarea >400</textarea>
		<div id="ggwp" style="width:500px;height:400px;">
			<iframe 
			style="width:100%;height:100%;"
			marginwidth="0" 
			marginheight="0" 
			scrolling="yes" 
			frameborder="0"
			src="index.php?tid=1&wid=3"></iframe>
		</div>
	</body>
</html>
