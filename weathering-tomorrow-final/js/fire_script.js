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

        $(".click-here-solutions a").attr("href",url+"14041793")

		// Use PapaParse to convert string to array of objects
    	var stories = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

    	stories = stories.filter(function(obj) {
        	// return the filtered value
        	return obj.national_slug !== "fire-building";
      	});

    	// console.log(stories)

    	for (i = 0; i < stories.length; i++) {

    		var type = stories[i].type

    		if (type == "national") {

    			var link = url + stories[i].story_link

	    		console.log(link)

	    		// console.log(link)

	    		$(".carousel-row-abc").append('<div class="carousel-tile story'+[i]+'"><a href="'+link+'" target="_blank"><img src="'+stories[i].story_img+'"><div class="story-title"><div class="story-logo story-logo-abc"><img src="img/ABC_OTV_logo_dark_blue.png"></div><p>'+stories[i].story_title+'</p></div></a></div>')

    		} else if (type == "local") {

    			$(".carousel-row-abc").append('<div class="carousel-tile story'+[i]+'"><a href="'+stories[i].story_link+'" target="_blank"><img src="'+stories[i].story_img+'"><div class="story-title"><div class="story-logo story-logo-abc"><img src="img/ABC_OTV_logo_dark_blue.png"></div><p>'+stories[i].story_title+'</p></div></a></div>')

    		}

    		
    	}

    });

	$.get('https://raw.githubusercontent.com/abcotvdata/climate-stories/main/the-cool-down-stories.csv', function(csvString) {

		// Use PapaParse to convert string to array of objects
    	var stories = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

    	// console.log(stories)

    	for (i = 0; i < stories.length; i++) {

    		$(".carousel-row-tcd").append('<div class="carousel-tile story'+[i]+'"><a href="'+stories[i].story_link+'" target="_blank"><img src="'+stories[i].story_img+'"><div class="story-title"><div class="story-logo story-logo-tcd"><img src="img/tcd-social-blue-EDIT.png"></div><p>'+stories[i].story_title+'</p></div></a></div>')

    	}

    });

}); //end document.ready block
