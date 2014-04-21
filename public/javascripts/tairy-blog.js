jQuery(document).ready(function($) {
	hljs.initHighlightingOnLoad();
	var data = [
	{
		value: 1,
		color:"#F7464A"
	},
	{
		value : 2,
		color : "#E2EAE9"
	},
	{
		value : 3,
		color : "#D4CCC5"
	},
	{
		value : 4,
		color : "#949FB1",
	},
	{
		value : 5,
		color : "#4D5360"
	}]

	var opnion = {
			segmentShowStroke : false,
			animateScale : true,
			datasetFill : true,
	}
	//Get context with jQuery - using jQuery's .get() method.
	var ctx = $("#myChart").get(0).getContext("2d");
	//This will get the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx).Pie(data,opnion);
});