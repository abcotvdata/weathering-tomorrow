/* script.js 
   Author:
   Date:
*/


$(document).ready(function(){ // begin document.ready block

	//jquery code here

	$(".vid-thumb").click(function(){
		var vid_thumb_id = $(this).attr("vid_id")
		console.log(vid_thumb_id)

		$(".big-vid").html('<video src="media/Anne-Cope-'+vid_thumb_id+'.mp4" oncontextmenu="return false;" controls></video').find("video").get(0).play()

	});


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
        	return obj.national_slug !== "fire-solutions";
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
