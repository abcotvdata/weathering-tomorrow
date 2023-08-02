/* script.js 
   Author:
   Date:
*/


$(document).ready(function(){ // begin document.ready block

	//jquery code here


	// _______CAROUSEL______

	$.get('https://raw.githubusercontent.com/abcotvdata/climate-stories/main/stories.csv', function(csvString) {

			var url = (window.location != window.parent.location)
            ? document.referrer
            : document.location.href;

            console.log(url)

			// Use PapaParse to convert string to array of objects
	    	var stories = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	stories = stories.filter(function(obj) {
	        	// return the filtered value
	        	return obj.national_slug !== "climate-perspectives";
	      	});

	    	// console.log(stories)

	    	for (i = 0; i < stories.length; i++) {

	    		var type = stories[i].type

	    		if (type == "national") {

	    			var link = url + stories[i].story_link

		    		console.log(link)

		    		// console.log(link)

		    		$(".carousel-row").append('<div class="carousel-tile story'+[i]+'"><a href="'+link+'" target="_blank"><img src="'+stories[i].story_img+'"><div class="story-title"><p>'+stories[i].story_title+'</p></div></a></div>')

	    		} else if (type == "local") {

	    			$(".carousel-row").append('<div class="carousel-tile story'+[i]+'"><a href="'+stories[i].story_link+'" target="_blank"><img src="'+stories[i].story_img+'"><div class="story-title"><p>'+stories[i].story_title+'</p></div></a></div>')

	    		}

	    		
	    	}

	    });

}); //end document.ready block
