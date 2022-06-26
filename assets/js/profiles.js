var apiKey = 'ycN420C1IQyzg3vaclQ5uXOMhx0toixh'; // Your API Key/Client ID. 
// If you don't have one, go get it here: https://www.behance.net/dev/register
var user = 'romiljain2'; // This is your behance username

$(function () {
	$.ajax({
	    url: "https://api.behance.net/v2/users/" + user + "/projects?client_id=" + apiKey,
	    dataType: 'jsonp',
	    success:
	    function(results){
	    	var projectsArray = new Array();
	    	for (var i = 0 ; i < 3; i++) {
		    	var project = results.projects[i];

		    	var output;
		    	output = '<div class="col-xs-12 col-sm-6 col-md-4"><a href="' + project.url + '"><div class="project-container"><div class="img-backdrop"></div><div class="description-container"><h2 class="caption">' + project.name + '</h2></div><img src="' + project.covers[404] + '" class="img-responsive"></div></a></div>';
		    	projectsArray.push(output);
	    	}
		    var $content = $('#behance-feed');
		    $content.html(projectsArray);
            console.log(projectsArray)
	    }
	});
});

// async function loadData(){
//     await fetch('https://api.behance.net/v2/users/romiljain2//projects?client_id=ycN420C1IQyzg3vaclQ5uXOMhx0toixh')
//       .then(response => console.log(response.json()))
//       .then(data => console.log(data));
// }

// loadData();


