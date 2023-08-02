/* script.js 
   Author:
   Date:
*/

//padding
function leftPad(value, length) { 
    return ('0'.repeat(length) + value).slice(-length); 
}

// DROPDOWN/LOCATION CODE __________________________________________

var picked_state;
var picked_state_fips;
var picked_state_name;
var picked_county;
var picked_county_fips;
var picked_zip;
var which_gobutton;

var queryString = location.search.substring(1);
console.log(queryString)

var string_split = queryString.split("|");
console.log(string_split)



$.fn.extend({
   qcss: function(css) {
      return $(this).queue(function(next) {
         $(this).css(css);
         next();
      });
   }
});

	function statefilterFunction() {
	  var input, filter, ul, li, a, i;
	  input = document.getElementById("stateInput");
	  filter = input.value.toUpperCase();
	  div = document.getElementById("stateDropdown");
	  p = div.getElementsByTagName("p");
	  for (i = 0; i < p.length; i++) {
	    txtValue = p[i].textContent || p[i].innerText;
	    if (txtValue.toUpperCase().indexOf(filter) > -1) {
	      p[i].style.display = "";
	    } else {
	      p[i].style.display = "none";
	    }
	  }
	}

	function countyfilterFunction() {
	  var input, filter, ul, li, a, i;
	  input = document.getElementById("countyInput");
	  filter = input.value.toUpperCase();
	  div = document.getElementById("countyDropdown");
	  p = div.getElementsByTagName("p");
	  for (i = 0; i < p.length; i++) {
	    txtValue = p[i].textContent || p[i].innerText;
	    if (txtValue.toUpperCase().indexOf(filter) > -1) {
	      p[i].style.display = "";
	    } else {
	      p[i].style.display = "none";
	    }
	  }
	}

	function zipfilterFunction() {
	  var input, filter, ul, li, a, i;
	  input = document.getElementById("zipInput");
	  filter = input.value.toUpperCase();
	  div = document.getElementById("zipDropdown");
	  p = div.getElementsByTagName("p");
	  for (i = 0; i < p.length; i++) {
	    txtValue = p[i].textContent || p[i].innerText;
	    if (txtValue.toUpperCase().indexOf(filter) > -1) {
	      p[i].style.display = "";
	    } else {
	      p[i].style.display = "none";
	    }
	  }
	}	


//LOADING THING
$(document).ready(function(){

	var polygons = $(".leaflet-overlay-pane svg").find("g")
	length_polygons = polygons.length
	console.log(length_polygons)

});	


//CAROUSEL OF STORIES
$(document).ready(function(){

	$.get('https://raw.githubusercontent.com/abcotvdata/climate-stories/main/stories.csv', function(csvString) {

			var url = (window.location != window.parent.location)
            ? document.referrer
            : document.location.href;

            console.log(url)

			// Use PapaParse to convert string to array of objects
	    	var stories = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	stories = stories.filter(function(obj) {
	        	// return the filtered value
	        	return obj.national_slug !== "climate-risks";
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
});	

	

//JQUERY PUTTING THE STATES IN THE FIRST DROPDOWN
$(document).ready(function(){
	var states_leng = states.length;

	for (var i=0; i<states_leng; i++) {
		//console.log(counties[i])
		$('#statedrop').append('<p abbr="'+states[i].STATE_ABBR+'" name="'+states[i].STATE+'" fips='+states[i].FIPS+'>'+ states[i].STATE +'</p>')

	}

	$("#stateInput").click(function(){
		$("#statedrop").show()
	});
});

//set empty counties array 
	
$(document).ready(function(){

	// make it so the dropdowns go away if you click outside of them/the inputs

	$('body').click(function (event) {
		if ((!$(event.target).is('#stateInput')&&(!$(event.target).is('#statedrop')))) {
			// console.log("outside stateInput/statedop")
			$("#statedrop").hide()
		} else {
			// console.log("inside stateInput/statedop")
		}
    });

    $('body').click(function (event) {
		if ((!$(event.target).is('#countyInput')&&(!$(event.target).is('#countydrop')))) {
			$("#countydrop").hide()
		} else {
		}
    });

    $('body').click(function (event) {
		if ((!$(event.target).is('#zipInput')&&(!$(event.target).is('#zipdrop')))) {
			$("#zipdrop").hide()
		} else {
		}
    });





	// Click on the "change geo" button
	$('.change_geo').click(function(){
		$(".zoom-out-or-in-container").show();
	});

	$(".exit").click(function(){
		$(".zoom-out-or-in-container").hide();
	});

	$(".zoombutton").click(function(){
		$(".zoom-out-or-in-container").hide();
	});

	// fill county dropdown
	$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/uscounties_simple.csv', function(csvString) {

			// Use PapaParse to convert string to array of objects
	    	var county_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	// console.log(county_data)

			   	var county_data_leng = county_data.length;

			   	//putting just counties into an array
			   	for (var i=0; i<county_data_leng; i++) {

			   		// var county = county_data[i].county_name
			   		// counties.push(county)
			   		$('#countydrop').append('<p fips="'+county_data[i].geoid+'" county="'+county_data[i].county_name+'" state_name="'+county_data[i].state_name+'">'+ county_data[i].county_name +', '+ county_data[i].state_name +'</p>')

			   	}

			   	// console.log(counties)


				$("#countyInput").click(function(){
					$("#countydrop").show()
				});	


				//which county did you pick?
				$('#countydrop').on('click', 'p', function(){

					$("#countydrop").hide()
					$("#zipDropdown").show()
					$("#OR2").show()

					picked_county = $(this).attr("county")
					picked_county_fips = $(this).attr("fips")
					picked_state_fips = Number((leftPad(picked_county_fips, 5)).substr(0, 2));
					picked_county_fips = Number(picked_county_fips)
					picked_state_name = $(this).attr("state_name")
					console.log(picked_county_fips)
					console.log(picked_state_fips)

					$("#county_gobutton").show().attr("county_fips", picked_county_fips).attr("state_fips", picked_state_fips)

					$("#countyInput").val(picked_county + ', ' + picked_state_name)

					$(".county_location").html(picked_county + ', ' + picked_state_name)


				}); 
				// end click on county


   }); 
   // end county data response


	   

	$(".gobutton").click(function(){
		$(this).hide()

		$("#first-content").show()

		which_gobutton = $(this).attr("gobutton-title");
		console.log(which_gobutton)

		$(".dropdown-content").css({"float":"none", "margin":"auto"})

		// $("#countyDropdown").hide()
		$("#county_gobutton").hide()

		$("#stateInput").val("")

		// $("#countydrop").empty()
		$("#countyInput").val("")


		$('body').css({"overflow":"scroll"});

		$(".content").show()


	    $('html, body').animate({
	        scrollTop: $("#first-content").offset().top //- $(".header").height()
	    }, 500, function() {
	    	$(".header").addClass("hidden");
	    	$(document).scrollTop(0)

	  //   	$(".content-menu").qcss({
		 //    	"position":"fixed",
		 //    	"top":"0px",
		 //    	"left":"0px"
		 //    });

			// $(".content-header").qcss({
		 //    	"margin-top":"60px"
		 //    });

		    	//zip county crosswalk -- fill zip dropdown data
				$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/zcta_counties_crosswalk_merge.csv', function(csvString) {
					
					// Use PapaParse to convert string to array of objects
			    	var zip_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

			    	// console.log(zip_data)

			    	filtered_zips = zip_data.filter(function(obj) {
			        	// return the filtered value
			        	return obj.GEOID_COUNTY_20 === Number(picked_county_fips);
			      	});

					var zip_leng = filtered_zips.length;

					for (var i=0; i<zip_leng; i++) {
						// console.log(zip_filter[i])
						var zip_clean = leftPad(filtered_zips[i].GEOID_ZCTA5_20, 5)
						$('#zipdrop').append('<p zip="'+zip_clean+'" county_fips="'+filtered_zips[i].GEOID_COUNTY_20+'" county_name="'+filtered_zips[i].county_name+'" state_fips="'+filtered_zips[i].state_fips+'" state_name="'+filtered_zips[i].state_name+'">'+ zip_clean +' - '+filtered_zips[i].county_name+', '+filtered_zips[i].state_name+'</p>')

					}

					$("#zipInput").click(function(){
						$("#zipdrop").show()
					});	

					$("#zipdrop").on('click', 'p', function(){
						$("#zipdrop").hide()

						picked_zip = Number($(this).attr('zip'))
						picked_county = $(this).attr("county_name")
						picked_county_fips = $(this).attr("county_fips")
						picked_state_fips = $(this).attr("state_fips")
						picked_state_name = $(this).attr("state_name")
						console.log(picked_zip)

						$("#zip_zoombutton").show().attr("zip_fips", picked_zip).attr("county_fips", picked_county_fips).attr("state_fips", picked_state_fips)

						$("#zipInput").val(picked_zip)

						$(".zip_location").html(picked_zip +' - '+ picked_county + ', ' + picked_state_name)



					}); //end click on zip

				}); // end zip data response

	    });

		


		//which go button did you pick??? that will determine which data it comes from

			if (which_gobutton == "county") {

				console.log(picked_county_fips)	


				$(".content-location").html(picked_county + ', ' + picked_state_name)
				$(".state_location").html(picked_state_name)

				//fire county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/fire_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_county_fips;
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".fire-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wildfire</span><br><span class="big-numb bold wildfire-risk-major">NO DATA</span><br><span class="of-properties-fire-major">available for this area</span>')
		          	} else {

		          		$(".fire-map-link").attr("href", "risk-maps.html?county|fire|"+picked_state_fips+"|"+picked_county_fips)

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".wildfire-risk-major").html('NO')
			          		$(".of-properties-fire-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".wildfire-risk-major").html('<1%')
			          	} else {
			          		$(".wildfire-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".wildfire-risk-severe").html('NO')
			          		$(".of-properties-fire-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".wildfire-risk-severe").html('<1%')
			          	} else {
			          		$(".wildfire-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}


		          	}


				});

				//heat county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/heat_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_county_fips;
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".heat-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Heat</span><br><span class="big-numb bold heat-risk-major">NO DATA</span><br><span class="of-properties-heat-major">available for this area</span>')
		          	} else {

		          		$(".heat-map-link").attr("href", "risk-maps.html?county|heat|"+picked_state_fips+"|"+picked_county_fips)

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".heat-risk-major").html('NO')
			          		$(".of-properties-heat-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".heat-risk-major").html('<1%')
			          	} else {
			          		$(".heat-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".heat-risk-severe").html('NO')
			          		$(".of-properties-heat-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".heat-risk-severe").html('<1%')
			          	} else {
			          		$(".heat-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}

			          	

		          	}



				});


				//flood county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/flood_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_county_fips;
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".flood-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Flooding</span><br><span class="big-numb bold flood-risk-major">NO DATA</span><br><span class="of-properties-flood-major">available for this area</span>')
		          	} else {

		          		$(".flood-map-link").attr("href", "risk-maps.html?county|flood|"+picked_state_fips+"|"+picked_county_fips)

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".flood-risk-major").html('NO')
			          		$(".of-properties-flood-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".flood-risk-major").html('<1%')
			          	} else {
			          		$(".flood-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".flood-risk-severe").html('NO')
			          		$(".of-properties-flood-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".flood-risk-severe").html('<1%')
			          	} else {
			          		$(".flood-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}
			          	

		          	}

		          	


				});

				//wind county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/wind_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_county_fips;
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".wind-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wind</span><br><span class="big-numb bold wind-risk-major">NO DATA</span><br><span class="of-properties-wind-major">available for this area</span>')
		          	} else {

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".wind-risk-major").html('NO')
			          		$(".of-properties-wind-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".wind-risk-major").html('<1%')
			          	} else {
			          		$(".wind-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".wind-risk-severe").html('NO')
			          		$(".of-properties-wind-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".wind-risk-severe").html('<1%')
			          	} else {
			          		$(".wind-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}

			          	$(".wind-map-link").attr("href", "risk-maps.html?county|wind|"+picked_state_fips+"|"+picked_county_fips)

		          	}

		          	


				});

				
			} 



	}); //end button click!!!!


	//___________________________menu stuff___________________________

	$(".back-to-choose").click(function(){

		$(".header").fadeIn();

		$('html, body').animate({
	        scrollTop: $(".header").offset().top
	    }, 1000).delay(1000);

	    $("body").css({"overflow":"hidden"})


		$(".content-menu").css({
	    	"position":"relative",
	    	"top":"0px",
	    	"left":"0px"
	    	});

		$(".content-header").css({
	    	"margin-top":"0px"
	    	});

	});



	$(".concern").mouseenter(function(){
		$(this).find("video").get(0).play()
	});

	$(".concern").mouseleave(function(){
		$(this).find("video").get(0).pause()
	});


	//IF YOU CLICK ON THE STATE ZOOM OUT BUTTON

	$("#state_zoombutton").click(function(){
		which_gobutton = "state"

		$(this).hide()
		$("#county_zoombutton").show()
		$("#choose_zip").show()
		$(".in-or-out").html('in')
		$("#zipdrop").empty()

		//fill in county dropdown again

		console.log(picked_state_fips)

		$(".content-location").html(picked_state_name)

		//zip county crosswalk -- fill zip dropdown data
		$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/zcta_counties_crosswalk_merge.csv', function(csvString) {
			
			// Use PapaParse to convert string to array of objects
	    	var zip_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	// console.log(zip_data)

	    	filtered_zips = zip_data.filter(function(obj) {
	        	// return the filtered value
	        	return obj.state_name === picked_state_name;
	      	});

			var zip_leng = filtered_zips.length;

			for (var i=0; i<zip_leng; i++) {
				// console.log(zip_filter[i])
				var zip_clean = leftPad(filtered_zips[i].GEOID_ZCTA5_20, 5)
				$('#zipdrop').append('<p zip="'+zip_clean+'" county_fips="'+filtered_zips[i].GEOID_COUNTY_20+'" county_name="'+filtered_zips[i].county_name+'" state_fips="'+filtered_zips[i].state_fips+'" state_name="'+filtered_zips[i].state_name+'">'+ zip_clean +' - '+filtered_zips[i].county_name+', '+filtered_zips[i].state_name+'</p>')

			}

			$("#zipInput").click(function(){
				$("#zipdrop").show()
			});	

			$("#zipdrop").on('click', 'p', function(){
				$("#zipdrop").hide()

				picked_zip = Number($(this).attr('zip'))
				picked_county = $(this).attr("county_name")
				picked_county_fips = $(this).attr("county_fips")
				picked_state_fips = $(this).attr("state_fips")
				picked_state_name = $(this).attr("state_name")
				console.log(picked_zip)

				$("#zip_zoombutton").show().attr("zip_fips", picked_zip).attr("county_fips", picked_county_fips).attr("state_fips", picked_state_fips)

				$("#zipInput").val(picked_zip)

				$(".zip_location").html(picked_zip +' - '+ picked_county + ', ' + picked_state_name)
				$(".county_location").html(picked_county + ', ' + picked_state_name)



			}); //end click on zip

		}); // end zip data response

		//fill in content boxes for picked state
		//fire state
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/fire_state_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === Number(picked_state_fips);
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".fire-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wildfire</span><br><span class="big-numb bold wildfire-risk-major">NO DATA</span><br><span class="of-properties-fire-major">available for this area</span>')
          	} else {

          		$(".fire-map-link").attr("href", "risk-maps.html?state|fire|"+picked_state_fips)

          		if (filtered_data[0].pct_major == 0) {
	          		$(".wildfire-risk-major").html('NO')
	          		$(".of-properties-fire-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".wildfire-risk-major").html('<1%')
	          	} else {
	          		$(".wildfire-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".wildfire-risk-severe").html('NO')
	          		$(".of-properties-fire-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".wildfire-risk-severe").html('<1%')
	          	} else {
	          		$(".wildfire-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}


          	}

          


		});

		//heat state
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/heat_state_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === Number(picked_state_fips);
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".heat-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Heat</span><br><span class="big-numb bold heat-risk-major">NO DATA</span><br><span class="of-properties-heat-major">available for this area</span>')
          	} else {

          		$(".heat-map-link").attr("href", "risk-maps.html?state|heat|"+picked_state_fips)

          		if (filtered_data[0].pct_major == 0) {
	          		$(".heat-risk-major").html('NO')
	          		$(".of-properties-heat-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".heat-risk-major").html('<1%')
	          	} else {
	          		$(".heat-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".heat-risk-severe").html('NO')
	          		$(".of-properties-heat-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".heat-risk-severe").html('<1%')
	          	} else {
	          		$(".heat-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}

	          	

          	}

          	


		});


		//flood state
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/flood_state_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === Number(picked_state_fips);
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".flood-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Flooding</span><br><span class="big-numb bold flood-risk-major">NO DATA</span><br><span class="of-properties-flood-major">available for this area</span>')
          	} else {

          		if (filtered_data[0].pct_major == 0) {
	          		$(".flood-risk-major").html('NO')
	          		$(".of-properties-flood-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".flood-risk-major").html('<1%')
	          	} else {
	          		$(".flood-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".flood-risk-severe").html('NO')
	          		$(".of-properties-flood-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".flood-risk-severe").html('<1%')
	          	} else {
	          		$(".flood-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}


	          	$(".flood-map-link").attr("href", "risk-maps.html?state|flood|"+picked_state_fips)

          	}

          	


		});

		//wind state
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/wind_state_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === Number(picked_state_fips);
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".wind-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wind</span><br><span class="big-numb bold wind-risk-major">NO DATA</span><br><span class="of-properties-wind-major">available for this area</span>')
          	} else {

          		if (filtered_data[0].pct_major == 0) {
	          		$(".wind-risk-major").html('NO')
	          		$(".of-properties-wind-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".wind-risk-major").html('<1%')
	          	} else {
	          		$(".wind-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".wind-risk-severe").html('NO')
	          		$(".of-properties-wind-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".wind-risk-severe").html('<1%')
	          	} else {
	          		$(".wind-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}

	          	$(".wind-map-link").attr("href", "risk-maps.html?state|wind|"+picked_state_fips)

          	}

          	


		});

	}); // end state zoom button click

	//if you zoom back to a county

	$("#county_zoombutton").click(function(){

		which_gobutton = "county"
		console.log(picked_county_fips)

		$(".content-location").html(picked_county + ', ' + picked_state_name)
		$(".state_location").html(picked_state_name)
		$(this).hide()
		$("#choose_zip").show()
		$("#state_zoombutton").show()
		$("#zipdrop").empty()

		//zip county crosswalk -- fill zip dropdown data
		$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/zcta_counties_crosswalk_merge.csv', function(csvString) {
			
			// Use PapaParse to convert string to array of objects
	    	var zip_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	// console.log(zip_data)

	    	filtered_zips = zip_data.filter(function(obj) {
	        	// return the filtered value
	        	return obj.GEOID_COUNTY_20 === Number(picked_county_fips);
	      	});

			var zip_leng = filtered_zips.length;

			for (var i=0; i<zip_leng; i++) {
				// console.log(zip_filter[i])
				var zip_clean = leftPad(filtered_zips[i].GEOID_ZCTA5_20, 5)
				$('#zipdrop').append('<p zip="'+zip_clean+'" county_fips="'+filtered_zips[i].GEOID_COUNTY_20+'" county_name="'+filtered_zips[i].county_name+'" state_fips="'+filtered_zips[i].state_fips+'" state_name="'+filtered_zips[i].state_name+'">'+ zip_clean +' - '+filtered_zips[i].county_name+', '+filtered_zips[i].state_name+'</p>')

			}

			$("#zipInput").click(function(){
				$("#zipdrop").show()
			});	

			$("#zipdrop").on('click', 'p', function(){
				$("#zipdrop").hide()

				picked_zip = Number($(this).attr('zip'))
				picked_county = $(this).attr("county_name")
				picked_county_fips = $(this).attr("county_fips")
				picked_state_fips = $(this).attr("state_fips")
				picked_state_name = $(this).attr("state_name")
				console.log(picked_zip)

				$("#zip_zoombutton").show().attr("zip_fips", picked_zip).attr("county_fips", picked_county_fips).attr("state_fips", picked_state_fips)

				$("#zipInput").val(picked_zip)

				$(".zip_location").html(picked_zip +' - '+ picked_county + ', ' + picked_state_name)



			}); //end click on zip

		}); // end zip data response

		//fill the boxes again with county data
		//fire county
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/fire_county_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === Number(picked_county_fips);
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".fire-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wildfire</span><br><span class="big-numb bold wildfire-risk-major">NO DATA</span><br><span class="of-properties-fire-major">available for this area</span>')
          	} else {

          		$(".fire-map-link").attr("href", "risk-maps.html?county|fire|"+picked_state_fips+"|"+picked_county_fips)

          		if (filtered_data[0].pct_major == 0) {
	          		$(".wildfire-risk-major").html('NO')
	          		$(".of-properties-fire-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".wildfire-risk-major").html('<1%')
	          	} else {
	          		$(".wildfire-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".wildfire-risk-severe").html('NO')
	          		$(".of-properties-fire-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".wildfire-risk-severe").html('<1%')
	          	} else {
	          		$(".wildfire-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}


          	}


		});

		//heat county
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/heat_county_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === Number(picked_county_fips);
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".heat-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Heat</span><br><span class="big-numb bold heat-risk-major">NO DATA</span><br><span class="of-properties-heat-major">available for this area</span>')
          	} else {

          		$(".heat-map-link").attr("href", "risk-maps.html?county|heat|"+picked_state_fips+"|"+picked_county_fips)

          		if (filtered_data[0].pct_major == 0) {
	          		$(".heat-risk-major").html('NO')
	          		$(".of-properties-heat-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".heat-risk-major").html('<1%')
	          	} else {
	          		$(".heat-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".heat-risk-severe").html('NO')
	          		$(".of-properties-heat-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".heat-risk-severe").html('<1%')
	          	} else {
	          		$(".heat-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}

	          	

          	}



		});


		//flood county
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/flood_county_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === Number(picked_county_fips);
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".flood-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Flooding</span><br><span class="big-numb bold flood-risk-major">NO DATA</span><br><span class="of-properties-flood-major">available for this area</span>')
          	} else {

          		$(".flood-map-link").attr("href", "risk-maps.html?county|flood|"+picked_state_fips+"|"+picked_county_fips)

          		if (filtered_data[0].pct_major == 0) {
	          		$(".flood-risk-major").html('NO')
	          		$(".of-properties-flood-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".flood-risk-major").html('<1%')
	          	} else {
	          		$(".flood-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".flood-risk-severe").html('NO')
	          		$(".of-properties-flood-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".flood-risk-severe").html('<1%')
	          	} else {
	          		$(".flood-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}
	          	

          	}

          	


		});

		//wind county
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/wind_county_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === Number(picked_county_fips);
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".wind-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wind</span><br><span class="big-numb bold wind-risk-major">NO DATA</span><br><span class="of-properties-wind-major">available for this area</span>')
          	} else {

          		if (filtered_data[0].pct_major == 0) {
	          		$(".wind-risk-major").html('NO')
	          		$(".of-properties-wind-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".wind-risk-major").html('<1%')
	          	} else {
	          		$(".wind-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".wind-risk-severe").html('NO')
	          		$(".of-properties-wind-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".wind-risk-severe").html('<1%')
	          	} else {
	          		$(".wind-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}

	          	$(".wind-map-link").attr("href", "risk-maps.html?county|wind|"+picked_state_fips+"|"+picked_county_fips)

          	}

          	


		});



	});

	
	//if you zoom to a zip code

	$("#zip_zoombutton").click(function(){

		which_gobutton = "zip"
		console.log(picked_zip)

		$(".content-location").html(picked_zip +' - '+ picked_county + ', ' + picked_state_name)
		$("#choose_zip").hide()
		$("#zipInput").val("")
		$("#zipInput").empty()
		$("#county_zoombutton").show()
		$("#state_zoombutton").show()
		$(this).hide()


		//fire zip
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/fire_zip_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === picked_zip;
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".fire-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wildfire</span><br><span class="big-numb bold wildfire-risk-major">NO DATA</span><br><span class="of-properties-fire-major">available for this area</span>')
          	} else {

          		$(".fire-map-link").attr("href", "risk-maps.html?zip|fire|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)

          		if (filtered_data[0].pct_major == 0) {
	          		$(".wildfire-risk-major").html('NO')
	          		$(".of-properties-fire-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".wildfire-risk-major").html('<1%')
	          	} else {
	          		$(".wildfire-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".wildfire-risk-severe").html('NO')
	          		$(".of-properties-fire-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".wildfire-risk-severe").html('<1%')
	          	} else {
	          		$(".wildfire-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}


          	}



		});

		//heat zip
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/heat_zip_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === picked_zip;
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".heat-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Heat</span><br><span class="big-numb bold heat-risk-major">NO DATA</span><br><span class="of-properties-heat-major">available for this area</span>')
          	} else {

          		$(".heat-map-link").attr("href", "risk-maps.html?zip|heat|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)

          		if (filtered_data[0].pct_major == 0) {
	          		$(".heat-risk-major").html('NO')
	          		$(".of-properties-heat-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".heat-risk-major").html('<1%')
	          	} else {
	          		$(".heat-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".heat-risk-severe").html('NO')
	          		$(".of-properties-heat-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".heat-risk-severe").html('<1%')
	          	} else {
	          		$(".heat-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}

	          	

          	}



		});


		//flood zip
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/flood_zip_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === picked_zip;
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".flood-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Flooding</span><br><span class="big-numb bold flood-risk-major">NO DATA</span><br><span class="of-properties-flood-major">available for this area</span>')
          	} else {

          		$(".flood-map-link").attr("href", "risk-maps.html?zip|flood|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)

          		if (filtered_data[0].pct_major == 0) {
	          		$(".flood-risk-major").html('NO')
	          		$(".of-properties-flood-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".flood-risk-major").html('<1%')
	          	} else {
	          		$(".flood-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".flood-risk-severe").html('NO')
	          		$(".of-properties-flood-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".flood-risk-severe").html('<1%')
	          	} else {
	          		$(".flood-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}
	          	

          	}
          	


		});

		//wind zip
		$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/wind_zip_chart.csv', function(csvString) {

		    // Use PapaParse to convert string to array of objects
		    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    filtered_data = data.filter(function(obj) {
            	// return the filtered value
            	return obj.fips === picked_zip;
          	});

          	console.log(filtered_data)

          	if (filtered_data.length == 0) {
          		$(".wind-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wind</span><br><span class="big-numb bold wind-risk-major">NO DATA</span><br><span class="of-properties-wind-major">available for this area</span>')
          	} else {

          		if (filtered_data[0].pct_major == 0) {
	          		$(".wind-risk-major").html('NO')
	          		$(".of-properties-wind-major").html('properties at')
	          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
	          		$(".wind-risk-major").html('<1%')
	          	} else {
	          		$(".wind-risk-major").html(filtered_data[0].pct_major + '%')
	          	}

	          	if (filtered_data[0].pct_severe == 0) {
	          		$(".wind-risk-severe").html('NO')
	          		$(".of-properties-wind-severe").html('properties at')
	          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
	          		$(".wind-risk-severe").html('<1%')
	          	} else {
	          		$(".wind-risk-severe").html(filtered_data[0].pct_severe + '%')
	          	}

	          	$(".wind-map-link").attr("href", "risk-maps.html?zip|wind|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)

          	}    	


		}); //end wind zip

	}); //end zip zoom button click
				

				




	//IF PEOPLE CLICK THE BACK BUTTON!!!_____________________________________________________________________


	if (queryString == "") {
		console.log("THERE'S NOTHING!!!")
	} else {

		console.log("SOMETHING!!")

		var geo_type = string_split[0];
		console.log("geo type is", geo_type)

		$(".content").show()

		$('html, body').animate({
	        scrollTop: $("#first-content").offset().top //- $(".header").height()
	    }, 500, function() {
	    	$(".header").addClass("hidden");
	    	$(document).scrollTop(0)

	    	$(".content-menu").qcss({
		    	"position":"fixed",
		    	"top":"0px",
		    	"left":"0px"
		    });

			$(".content-header").qcss({
		    	"margin-top":"60px"
		    });
	    });


		if (geo_type == "state") {
			picked_state_fips = string_split[1].replace(/%20/g, " ");
			picked_state_fips = picked_state_fips
			

			picked_state_name = string_split[2].replace(/%20/g, " ");
			picked_state_name = picked_state_name
			console.log(picked_state_name)

			$(".content-location").html(picked_state_name)
			$(".state_location").html(picked_state_name)
			$("#state_zoombutton").hide()
			$("#choose_zip").show()

			//zip county crosswalk -- fill zip dropdown data
			$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/zcta_counties_crosswalk_merge.csv', function(csvString) {
				
				// Use PapaParse to convert string to array of objects
		    	var zip_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    	// console.log(zip_data)

		    	filtered_zips = zip_data.filter(function(obj) {
		        	// return the filtered value
		        	return obj.state_name === picked_state_name;
		      	});

				var zip_leng = filtered_zips.length;

				for (var i=0; i<zip_leng; i++) {
					// console.log(zip_filter[i])
					var zip_clean = leftPad(filtered_zips[i].GEOID_ZCTA5_20, 5)
					$('#zipdrop').append('<p zip="'+zip_clean+'" county_fips="'+filtered_zips[i].GEOID_COUNTY_20+'" county_name="'+filtered_zips[i].county_name+'" state_fips="'+filtered_zips[i].state_fips+'" state_name="'+filtered_zips[i].state_name+'">'+ zip_clean +' - '+filtered_zips[i].county_name+', '+filtered_zips[i].state_name+'</p>')

				}

				$("#zipInput").click(function(){
					$("#zipdrop").show()
				});	

				$("#zipdrop").on('click', 'p', function(){
					$("#zipdrop").hide()

					picked_zip = Number($(this).attr('zip'))
					picked_county = $(this).attr("county_name")
					picked_county_fips = $(this).attr("county_fips")
					picked_state_fips = $(this).attr("state_fips")
					picked_state_name = $(this).attr("state_name")
					console.log(picked_zip)

					$("#zip_zoombutton").show().attr("zip_fips", picked_zip).attr("county_fips", picked_county_fips).attr("state_fips", picked_state_fips)

					$("#zipInput").val(picked_zip)

					$(".zip_location").html(picked_zip +' - '+ picked_county + ', ' + picked_state_name)
					$(".county_location").html(picked_county + ', ' + picked_state_name)



				}); //end click on zip

			}); // end zip data response



				//fire state
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/fire_state_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_state_fips);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".fire-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wildfire</span><br><span class="big-numb bold wildfire-risk-major">NO DATA</span><br><span class="of-properties-fire-major">available for this area</span>')
		          	} else {

		          		$(".fire-map-link").attr("href", "risk-maps.html?state|fire|"+picked_state_fips)

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".wildfire-risk-major").html('NO')
			          		$(".of-properties-fire-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".wildfire-risk-major").html('<1%')
			          	} else {
			          		$(".wildfire-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".wildfire-risk-severe").html('NO')
			          		$(".of-properties-fire-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".wildfire-risk-severe").html('<1%')
			          	} else {
			          		$(".wildfire-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}


		          	}

		          	


				});

				//heat state
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/heat_state_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_state_fips);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".heat-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Heat</span><br><span class="big-numb bold heat-risk-major">NO DATA</span><br><span class="of-properties-heat-major">available for this area</span>')
		          	} else {

		          		$(".heat-map-link").attr("href", "risk-maps.html?state|heat|"+picked_state_fips)

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".heat-risk-major").html('NO')
			          		$(".of-properties-heat-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".heat-risk-major").html('<1%')
			          	} else {
			          		$(".heat-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".heat-risk-severe").html('NO')
			          		$(".of-properties-heat-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".heat-risk-severe").html('<1%')
			          	} else {
			          		$(".heat-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}

			          	

		          	}


				});


				//flood state
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/flood_state_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_state_fips);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".flood-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Flooding</span><br><span class="big-numb bold flood-risk-major">NO DATA</span><br><span class="of-properties-flood-major">available for this area</span>')
		          	} else {

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".flood-risk-major").html('NO')
			          		$(".of-properties-flood-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".flood-risk-major").html('<1%')
			          	} else {
			          		$(".flood-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".flood-risk-severe").html('NO')
			          		$(".of-properties-flood-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".flood-risk-severe").html('<1%')
			          	} else {
			          		$(".flood-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}


			          	$(".flood-map-link").attr("href", "risk-maps.html?state|flood|"+picked_state_fips)

		          	}


				});

				//wind state
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/wind_state_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_state_fips);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".wind-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wind</span><br><span class="big-numb bold wind-risk-major">NO DATA</span><br><span class="of-properties-wind-major">available for this area</span>')
		          	} else {

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".wind-risk-major").html('NO')
			          		$(".of-properties-wind-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".wind-risk-major").html('<1%')
			          	} else {
			          		$(".wind-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".wind-risk-severe").html('NO')
			          		$(".of-properties-wind-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".wind-risk-severe").html('<1%')
			          	} else {
			          		$(".wind-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}

			          	$(".wind-map-link").attr("href", "risk-maps.html?state|wind|"+picked_state_fips)

		          	}


				});
		} // end state

		else if (geo_type == "county") {
			picked_state_fips = string_split[1].replace(/%20/g, " ");
			console.log(picked_state_fips)

			picked_state_name = string_split[2].replace(/%20/g, " ");
			console.log(picked_state_name)

			picked_county_fips = string_split[3].replace(/%20/g, " ");
			console.log(picked_county_fips)

			picked_county = string_split[4].replace(/%20/g, " ");
			console.log(picked_county)

			$(".content-location").html(picked_county + ', ' + picked_state_name)
			$(".state_location").html(picked_state_name)
			$(".county_location").html(picked_county + ', ' + picked_state_name)

			//zip county crosswalk -- fill zip dropdown data
			$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/zcta_counties_crosswalk_merge.csv', function(csvString) {
				
				// Use PapaParse to convert string to array of objects
		    	var zip_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    	// console.log(zip_data)

		    	filtered_zips = zip_data.filter(function(obj) {
		        	// return the filtered value
		        	return obj.GEOID_COUNTY_20 === Number(picked_county_fips);
		      	});

				var zip_leng = filtered_zips.length;

				for (var i=0; i<zip_leng; i++) {
					// console.log(zip_filter[i])
					var zip_clean = leftPad(filtered_zips[i].GEOID_ZCTA5_20, 5)
					$('#zipdrop').append('<p zip="'+zip_clean+'" county_fips="'+filtered_zips[i].GEOID_COUNTY_20+'" county_name="'+filtered_zips[i].county_name+'" state_fips="'+filtered_zips[i].state_fips+'" state_name="'+filtered_zips[i].state_name+'">'+ zip_clean +' - '+filtered_zips[i].county_name+', '+filtered_zips[i].state_name+'</p>')

				}

				$("#zipInput").click(function(){
					$("#zipdrop").show()
				});	

				$("#zipdrop").on('click', 'p', function(){
					$("#zipdrop").hide()

					picked_zip = Number($(this).attr('zip'))
					picked_county = $(this).attr("county_name")
					picked_county_fips = $(this).attr("county_fips")
					picked_state_fips = $(this).attr("state_fips")
					picked_state_name = $(this).attr("state_name")
					console.log(picked_zip)

					$("#zip_zoombutton").show().attr("zip_fips", picked_zip).attr("county_fips", picked_county_fips).attr("state_fips", picked_state_fips)

					$("#zipInput").val(picked_zip)

					$(".zip_location").html(picked_zip +' - '+ picked_county + ', ' + picked_state_name)
					$(".county_location").html(picked_county + ', ' + picked_state_name)



				}); //end click on zip

			}); // end zip data response

				//fire county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/fire_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_county_fips);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".fire-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wildfire</span><br><span class="big-numb bold wildfire-risk-major">NO DATA</span><br><span class="of-properties-fire-major">available for this area</span>')
		          	} else {

		          		$(".fire-map-link").attr("href", "risk-maps.html?county|fire|"+picked_state_fips+"|"+picked_county_fips)

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".wildfire-risk-major").html('NO')
			          		$(".of-properties-fire-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".wildfire-risk-major").html('<1%')
			          	} else {
			          		$(".wildfire-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".wildfire-risk-severe").html('NO')
			          		$(".of-properties-fire-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".wildfire-risk-severe").html('<1%')
			          	} else {
			          		$(".wildfire-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}


		          	}


				});

				//heat county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/heat_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_county_fips);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".heat-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Heat</span><br><span class="big-numb bold heat-risk-major">NO DATA</span><br><span class="of-properties-heat-major">available for this area</span>')
		          	} else {

		          		$(".heat-map-link").attr("href", "risk-maps.html?county|heat|"+picked_state_fips+"|"+picked_county_fips)

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".heat-risk-major").html('NO')
			          		$(".of-properties-heat-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".heat-risk-major").html('<1%')
			          	} else {
			          		$(".heat-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".heat-risk-severe").html('NO')
			          		$(".of-properties-heat-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".heat-risk-severe").html('<1%')
			          	} else {
			          		$(".heat-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}

			          	

		          	}


				});


				//flood county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/flood_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_county_fips);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".flood-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Flooding</span><br><span class="big-numb bold flood-risk-major">NO DATA</span><br><span class="of-properties-flood-major">available for this area</span>')
		          	} else {

		          		$(".flood-map-link").attr("href", "risk-maps.html?county|flood|"+picked_state_fips+"|"+picked_county_fips)

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".flood-risk-major").html('NO')
			          		$(".of-properties-flood-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".flood-risk-major").html('<1%')
			          	} else {
			          		$(".flood-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".flood-risk-severe").html('NO')
			          		$(".of-properties-flood-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".flood-risk-severe").html('<1%')
			          	} else {
			          		$(".flood-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}
			          	

		          	}


				});

				//wind county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/wind_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_county_fips);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".wind-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wind</span><br><span class="big-numb bold wind-risk-major">NO DATA</span><br><span class="of-properties-wind-major">available for this area</span>')
		          	} else {

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".wind-risk-major").html('NO')
			          		$(".of-properties-wind-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".wind-risk-major").html('<1%')
			          	} else {
			          		$(".wind-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".wind-risk-severe").html('NO')
			          		$(".of-properties-wind-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".wind-risk-severe").html('<1%')
			          	} else {
			          		$(".wind-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}

			          	$(".wind-map-link").attr("href", "risk-maps.html?county|wind|"+picked_state_fips+"|"+picked_county_fips)

		          	}


				});
		} //end county

		else if (geo_type == "zip") {
			picked_state_fips = string_split[1].replace(/%20/g, " ");
			console.log(picked_state_fips)

			picked_state_name = string_split[2].replace(/%20/g, " ");
			console.log(picked_state_name)

			picked_county_fips = string_split[3].replace(/%20/g, " ");
			console.log(picked_county_fips)

			picked_county = string_split[4].replace(/%20/g, " ");
			console.log(picked_county)

			picked_zip = string_split[5].replace(/%20/g, " ");
			console.log(picked_zip)

			$(".content-location").html(picked_zip +' - '+ picked_county + ', ' + picked_state_name)
			$(".state_location").html(picked_state_name)
			$("#choose_zip").hide()
			$("#county_zoombutton").show()
			$(".county_location").html(picked_county + ', ' + picked_state_name)


				//fire zip
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/fire_zip_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_zip);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".fire-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wildfire</span><br><span class="big-numb bold wildfire-risk-major">NO DATA</span><br><span class="of-properties-fire-major">available for this area</span>')
		          	} else {

		          		$(".fire-map-link").attr("href", "risk-maps.html?zip|fire|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".wildfire-risk-major").html('NO')
			          		$(".of-properties-fire-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".wildfire-risk-major").html('<1%')
			          	} else {
			          		$(".wildfire-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".wildfire-risk-severe").html('NO')
			          		$(".of-properties-fire-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".wildfire-risk-severe").html('<1%')
			          	} else {
			          		$(".wildfire-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}


		          	}


				});

				//heat zip
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/heat_zip_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_zip);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".heat-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Heat</span><br><span class="big-numb bold heat-risk-major">NO DATA</span><br><span class="of-properties-heat-major">available for this area</span>')
		          	} else {

		          		$(".heat-map-link").attr("href", "risk-maps.html?zip|heat|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".heat-risk-major").html('NO')
			          		$(".of-properties-heat-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".heat-risk-major").html('<1%')
			          	} else {
			          		$(".heat-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".heat-risk-severe").html('NO')
			          		$(".of-properties-heat-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".heat-risk-severe").html('<1%')
			          	} else {
			          		$(".heat-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}

			          	

		          	}


				});


				//flood zip
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/flood_zip_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_zip);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".flood-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Flooding</span><br><span class="big-numb bold flood-risk-major">NO DATA</span><br><span class="of-properties-flood-major">available for this area</span>')
		          	} else {

		          		$(".flood-map-link").attr("href", "risk-maps.html?zip|flood|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".flood-risk-major").html('NO')
			          		$(".of-properties-flood-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".flood-risk-major").html('<1%')
			          	} else {
			          		$(".flood-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".flood-risk-severe").html('NO')
			          		$(".of-properties-flood-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".flood-risk-severe").html('<1%')
			          	} else {
			          		$(".flood-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}
			          	

		          	}


				});

				//wind zip
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/wind_zip_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === Number(picked_zip);
		          	});

		          	console.log(filtered_data)

		          	if (filtered_data.length == 0) {
		          		$(".wind-map-link").attr("href", "index.html#begin").find(".concern-title").html('<span class="lines">Wind</span><br><span class="big-numb bold wind-risk-major">NO DATA</span><br><span class="of-properties-wind-major">available for this area</span>')
		          	} else {

		          		if (filtered_data[0].pct_major == 0) {
			          		$(".wind-risk-major").html('NO')
			          		$(".of-properties-wind-major").html('properties at')
			          	} else if ((filtered_data[0].pct_major > 0) & (filtered_data[0].pct_major < 1)) {
			          		$(".wind-risk-major").html('<1%')
			          	} else {
			          		$(".wind-risk-major").html(filtered_data[0].pct_major + '%')
			          	}

			          	if (filtered_data[0].pct_severe == 0) {
			          		$(".wind-risk-severe").html('NO')
			          		$(".of-properties-wind-severe").html('properties at')
			          	} else if ((filtered_data[0].pct_severe > 0) & (filtered_data[0].pct_severe < 1)) {
			          		$(".wind-risk-severe").html('<1%')
			          	} else {
			          		$(".wind-risk-severe").html(filtered_data[0].pct_severe + '%')
			          	}

			          	$(".wind-map-link").attr("href", "risk-maps.html?zip|wind|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)

		          	}


				});

		} //end zip


	} //end if else




	

}); 
//end document ready function


	

	



