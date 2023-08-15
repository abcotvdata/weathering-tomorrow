/* script.js 
   Author:
   Date:
*/

// COLORS FOR MAP____________________________

// function getHeatColor(d) {
//     return d > 100 ? '#7e0000' :
//     d > 75 ? '#be0000' :
//     d > 50 ? '#f38a47' :
//     d > 25 ? '#fbbf2b' :
//     d > 0.001 ? '#f0f723' :
//     '#DADADA'
// }

$.fn.extend({
   qcss: function(css) {
      return $(this).queue(function(next) {
         $(this).css(css);
         next();
      });
   }
});

function getHeatColor(d) {
    return d >130 ? '#be0000' :
    d > 115 ? '#da290c' :
    d > 100 ? '#ea4213' :
    d > 85 ? '#f95819' :
    d > 70 ? '#fa791a' :
    d > 55 ? '#fb991b' :
    d > 40 ? '#fcc51a' :
    d > 25 ? '#fcf019' :
    d > 10 ? '#f6f074' :
    d >= 0 ? '#f0f0cb' :
    d == null ? '#DADADA' :
    '#DADADA'
}


function get125Color(d) {
    return d > 0 ? '#be0000' :
    '#DADADA'
}

var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounties_new.geojson"


$(document).ready(function(){ // begin document.ready block

	//jquery code here



	$(".scrolly-box-3").waypoint(function(dir){

		if (dir=="down") {

			$(".scrolly-bg").css({"position":"fixed"})

			$(".scrolly-bg").animate({"opacity":"1"})
			
				

		} else if (dir=="up") {

			$(".scrolly-bg").animate({"opacity":"0"})


			

		}

	});

	$(".scrolly-box-4").waypoint(function(dir){

		if (dir=="down") {

			$(".scrolly-map2").animate({"opacity":"1"})
			$(".scrolly-map1").animate({"opacity":"0"})
			
		}

		else if (dir=="up") {

			$(".scrolly-map2").animate({"opacity":"0"})
			$(".scrolly-map1").animate({"opacity":"1"})

		}
	});

	$(".scrolly-box-5").waypoint(function(dir){

		if (dir=="down") {

			$(".scrolly-map-title h2").html("Counties with at least half a day above 125&deg; today")
			$(".scrolly-map-legend").animate({"opacity":"0"})

			$(".scrolly-map3").animate({"opacity":"1"})
			$(".scrolly-map2").animate({"opacity":"0"})

		}

		else if (dir=="up") {

			$(".scrolly-map-title h2").html("Number of 100&deg; days in 30 years")
			$(".scrolly-map-legend").animate({"opacity":"1"})

			$(".scrolly-map3").animate({"opacity":"0"})
			$(".scrolly-map2").animate({"opacity":"1"})

		}
	});


	$(".scrolly-box-6").waypoint(function(dir){

		if (dir=="down") {

			$(".scrolly-map-title h2").html("Counties with at least half a day above 125&deg; in 30 years")
			 
			$(".scrolly-map4").animate({"opacity":"1"})
			$(".scrolly-map3").animate({"opacity":"0"})

		}

		else if (dir=="up") {

			$(".scrolly-map-title h2").html("Counties with at least half a day above 125&deg; today")

			$(".scrolly-map4").animate({"opacity":"0"})
			$(".scrolly-map3").animate({"opacity":"1"})

		}
	});


	$(".scrolly-text-6").waypoint(function(dir){
		if (dir == "down") {

			$(".scrolly-bg").animate({"opacity":"0"})

		} if (dir == "up") {

			$(".scrolly-bg").animate({"opacity":"1"})

		}

	});


	// MAP SWITCHY THING

	$(".map1-button").click(function(){
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


	//CAROUSEL OF STORIES

	$.get('https://raw.githubusercontent.com/abcotvdata/climate-stories/main/stories.csv', function(csvString) {

		var url = (window.location != window.parent.location)
        ? document.referrer
        : document.location.href;

        console.log(url)

		// Use PapaParse to convert string to array of objects
    	var stories = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

    	stories = stories.filter(function(obj) {
        	// return the filtered value
        	return obj.national_slug !== "extreme-heat";
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


	// TABLE STUFF

	var zipval
	var zipclean
	var filtered_zip_length
	var county_fips
	var county_name
	var state_fips
	var state_name
	var picked_county

	$(".zip-go").on('click', function(){

		zipval = $(".zip-input").val()
		console.log(zipval)

		zipvallength = zipval.length
    	console.log(zipvallength)




    	if (zipvallength<5) {

	      $(".tryagaintext p").html("This is either not a valid zip code or doesn't appear in this data. Please try again.")

	      $(".tryagain").fadeIn()

	      $("#oktryagain").click(function(){
	        $(".tryagain").fadeOut()
	      });

	    } else {

	    	$.get('https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heat_zip_data_for_JS.csv', function(csvString) {

				// Use PapaParse to convert string to array of objects
		    	var zips = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    	// console.log(zips)

		    	filtered_zip = zips.filter(function(obj) {
		        	// return the filtered value

		        	return obj.geoid_zcta === Number(zipval);
		      	});

		      	// console.log(filtered_zip)

		      	filtered_zip_length  = filtered_zip.length

		      	if (filtered_zip_length == 0) {
		      		$(".tryagaintext p").html("This is either not a valid zip code or doesn't appear in this data. Please try again.")

					$(".tryagain").fadeIn()

					$("#oktryagain").click(function(){
					$(".tryagain").fadeOut()
					});
		      	} else if (filtered_zip_length == 1) {

		    		//zip county crosswalk -- fill zip dropdown data
					$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/zcta_counties_crosswalk_merge.csv', function(csvString) {
						

						// Use PapaParse to convert string to array of objects
				    	var zip_xwalk_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    	filtered_zip_xwalk_data = zip_xwalk_data.filter(function(obj) {
				        	// return the filtered value
				        	return obj.GEOID_ZCTA5_20 === Number(zipval);
				      	});

				      	// console.log(filtered_zip_xwalk_data)

				      	if (filtered_zip_xwalk_data.length == 1) {

				      		$("#county-label").hide()
				      		$("#counties").hide()
				      		$(".county-go").hide()

				      		//put zip code data in zip code stuff

				      		for (i = 0; i < filtered_zip.length; i++) {

				      			$(".table-loading").fadeIn()
						    	$(".table-loading").delay(1000).fadeOut()

						    	$(".table").delay(1000).fadeIn()
						    	$(".source").delay(1000).fadeIn()

						    	$(".table-section").delay(1000).qcss({"height":"auto"}).fadeIn(function(){
						    		Waypoint.refreshAll()
						    	});

				      			$(".zip_code_display").html(zipval)

				    			$(".zip_today_90").html(filtered_zip[0].days_above_90_today)
				    			$(".zip_30yrs_90").html(filtered_zip[0].days_above_90_30yrs)

				    			$(".zip_today_100").html(filtered_zip[0].days_above_100_today)
				    			$(".zip_30yrs_100").html(filtered_zip[0].days_above_100_30yrs)

				    			$(".zip_more_days_90").html(filtered_zip[0].change_days_above_90)
				    			$(".zip_more_days_100").html(filtered_zip[0].change_days_above_100)
				    		}

				      		for (i = 0; i < filtered_zip_xwalk_data.length; i++) {
					      		county_fips = filtered_zip_xwalk_data[i].GEOID_COUNTY_20
								county_name = filtered_zip_xwalk_data[i].county_name
								state_fips = filtered_zip_xwalk_data[i].state_fips
								state_name = filtered_zip_xwalk_data[i].state_name

								console.log(county_fips)
								console.log(county_name)
								console.log(state_fips)
								console.log(state_name)


								$.get('https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heat_county_for_JS.csv', function(csvString) {

									// Use PapaParse to convert string to array of objects
							    	var counties = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

							    	console.log(county_fips)

							    	filtered_county = counties.filter(function(obj) {
							        	// return the filtered value

							        	return obj.geoid === Number(county_fips);
							      	});

							      	console.log(filtered_county)

							      	for (i = 0; i < filtered_county.length; i++) {

						      			$(".county_display").html(filtered_county[0].county_name + ', ' + filtered_county[0].state_abbr)

						    			$(".county_today_90").html(filtered_county[0].days_above_90_today)
						    			$(".county_30yrs_90").html(filtered_county[0].days_above_90_30yrs)

						    			$(".county_today_100").html(filtered_county[0].days_above_100_today)
						    			$(".county_30yrs_100").html(filtered_county[0].days_above_100_30yrs)

						    			$(".county_more_days_90").html(filtered_county[0].change_days_above_90)
						    			$(".county_more_days_100").html(filtered_county[0].change_days_above_100)
						    		}

							    });

			    			} // end crosswalk loop

				      	} else if (filtered_zip_xwalk_data.length > 1) {

				      		$("#county-label").show()
				      		$("#counties").show()
				      		$(".county-go").show()

				      		console.log(filtered_zip_xwalk_data)

				      		for (i = 0; i < filtered_zip_xwalk_data.length; i++) {
				      			$('#counties').append('<option value="'+filtered_zip_xwalk_data[i].GEOID_COUNTY_20+'" county_name="'+filtered_zip_xwalk_data[i].county_name+'" state_fips="'+filtered_zip_xwalk_data[i].state_fips+'" state_name="'+filtered_zip_xwalk_data[i].state_name+'">'+filtered_zip_xwalk_data[i].county_name+', '+filtered_zip_xwalk_data[i].state_name+'</option>')
				      		}

				      		$(".county-go").click(function(){

				      			filtered_zip = zips.filter(function(obj) {
						        	// return the filtered value

						        	return obj.geoid_zcta === Number(zipval);
						      	});

						      	for (i = 0; i < filtered_zip.length; i++) {

						      		$(".table-loading").fadeIn()
							    	$(".table-loading").delay(1000).fadeOut()

							    	$(".table").delay(1000).fadeIn()
							    	$(".source").delay(1000).fadeIn()

							    	$(".table-section").delay(1000).qcss({"height":"auto"}).fadeIn(function(){
							    		Waypoint.refreshAll()
							    	});

					      			$(".zip_code_display").html(zipval)

					    			$(".zip_today_90").html(filtered_zip[0].days_above_90_today)
					    			$(".zip_30yrs_90").html(filtered_zip[0].days_above_90_30yrs)

					    			$(".zip_today_100").html(filtered_zip[0].days_above_100_today)
					    			$(".zip_30yrs_100").html(filtered_zip[0].days_above_100_30yrs)

					    			$(".zip_more_days_90").html(filtered_zip[0].change_days_above_90)
					    			$(".zip_more_days_100").html(filtered_zip[0].change_days_above_100)
					    		}

				      			county_fips = $("#counties").val()
				      			county_name = $('#counties option:selected').attr('county_name');
								state_fips = $('#counties option:selected').attr('state_fips');
								state_name = $('#counties option:selected').attr('state_name');

				      			console.log(county_fips)
				      			console.log(county_name)
				      			console.log(state_fips)
				      			console.log(state_name)

				      			$.get('https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heat_county_for_JS.csv', function(csvString) {

									// Use PapaParse to convert string to array of objects
							    	var counties = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

							    	console.log(county_fips)

							    	filtered_county = counties.filter(function(obj) {
							        	// return the filtered value

							        	return obj.geoid === Number(county_fips);
							      	});

							      	console.log(filtered_county)

							      	for (i = 0; i < filtered_county.length; i++) {

						      			$(".county_display").html(filtered_county[0].county_name + ', ' + filtered_county[0].state_abbr)

						    			$(".county_today_90").html(filtered_county[0].days_above_90_today)
						    			$(".county_30yrs_90").html(filtered_county[0].days_above_90_30yrs)

						    			$(".county_today_100").html(filtered_county[0].days_above_100_today)
						    			$(".county_30yrs_100").html(filtered_county[0].days_above_100_30yrs)

						    			$(".county_more_days_90").html(filtered_county[0].change_days_above_90)
						    			$(".county_more_days_100").html(filtered_county[0].change_days_above_100)
						    		}

							    });

				      		});

				      		



				      	}

				      	

				    });





		      	} //end else if zip data length is 1

		    	

	    	}); // end get zip code data

	    } // end "else"


	 }); // end click on "go"



}); //end document.ready block
