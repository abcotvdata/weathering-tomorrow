/* script.js 
   Author:
   Date:
*/


$(document).ready(function(){ // begin document.ready block

	//jquery code here

	// MAP SWITCHY THING

	$(".map1-button").click(function(){

		var title = $(this).attr("title")

		console.log(title)

		$(".embed-map1-title h4").html(title)

		$(".map1").css({
			"opacity":"1",
			"z-index": "3000"
		})

		$(".map2").css({
			"opacity":"0",
			"z-index": "0"
		})

		$(this).css({
			"background-color": "#fb991b",
  			"color": "white",
  			"box-shadow": '-1px 1px 5px #676767'
		})

		$(".map2-button").css({
			"background-color": "#b1b7ba",
  			"color": "black",
  			"box-shadow":"none"
		})
	});

	$(".map2-button").click(function(){

		var title = $(this).attr("title")

		console.log(title)

		$(".embed-map1-title h4").html(title)

		$(".map2").css({
			"opacity":"1",
			"z-index": "3000"
		})

		$(".map1").css({
			"opacity":"0",
			"z-index": "0"
		})

		$(this).css({
			"background-color": "#fb991b",
  			"color": "white",
  			"box-shadow": '-1px 1px 5px #676767'
		})

		$(".map1-button").css({
			"background-color": "#b1b7ba",
  			"color": "black",
  			"box-shadow":"none"
		})
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
        	return obj.national_slug !== "flooding";
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
