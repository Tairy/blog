$(document).ready(function($) {
	$('.showcase-featured-grid-link').mouseover(function() {
		$(this).children('span').children('span').children('span .showcase-info').css({
			visibility: 'initial',
			opacity: 1
		});
	}).mouseout(function() {
		$(this).children('span').children('span').children('span .showcase-info').css({
			visibility: 'hidden',
			opacity: 0
		});
	});;
});