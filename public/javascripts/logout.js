$(document).ready(function(){
	$("#logout").click(function(){
		$.ajax({
			url: '/logout',
			type: 'post'
		})
		.done(function() {
			console.log("success");
			window.location = "/"
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});
	});
});