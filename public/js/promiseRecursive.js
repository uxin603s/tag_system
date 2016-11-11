function promiseRecursive(gen,result){
	var next=gen.next(result);
	if(next.done) return;
	next.value
	.then(function(result){
		promiseRecursive(gen,result);
	})
	.catch(function(message){
		// console.log(message);
	})
	return next.value;
}