function promiseRecursive(gen,result){
	var next=gen.next(result);
	if(next.done) return;
	next.value.then(function(result){
		promiseRecursive(gen,result);
	});
}