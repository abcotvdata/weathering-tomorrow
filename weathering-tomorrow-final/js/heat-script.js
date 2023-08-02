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
    return d > 90 ? '#be0000' :
    d > 80 ? '#da290c' :
    d > 70 ? '#ea4213' :
    d > 60 ? '#f95819' :
    d > 50 ? '#fa791a' :
    d > 40 ? '#fb991b' :
    d > 30 ? '#fcc51a' :
    d > 20 ? '#fcf019' :
    d > 10 ? '#f6f074' :
    d >= 0 ? '#f0f0cb' :
    d == null ? '#DADADA' :
    '#DADADA'
}


function get125Color(d) {
    return d > 0 ? '#be0000' :
    '#DADADA'
}

var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"


$(document).ready(function(){ // begin document.ready block

	//jquery code here

	var boundaries;

	var heat_map_1 = L.map('heat_map_1', {
		minZoom: 3,
		zoomControl: false
	}).setView([40.3596928,-99.0598404], 3);

	heat_map_1.createPane('labels');

	//tile layer
	// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	// }).addTo(heat_map_1);

	var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '&copyOpenStreetMap, &copyCartoDB'
	}).addTo(heat_map_1);

	var positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
	    attribution: '&copyOpenStreetMap, &copyCartoDB',
	   	pane: 'labels'
	}).addTo(heat_map_1);

	var url_counties = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/counties.geojson"

		$.getJSON(url_counties,function(data){ //county boundary data

        	var counties = data;

         	var counties_style = {
              "fillColor": "#DADADA",
              "color": "white",
              "weight": 0.25,
              "fillOpacity": 0.7
          	};

            counties = L.geoJson(counties, {
                style: counties_style,
                // pane: "boundary",
                opacity:1,
                className: "counties"
            }).addTo(heat_map_1)

        });


	$(".scrolly-box-1").waypoint(function(dir){
		if (dir == "down") {

			$(".scrolly-bg").css({"position":"fixed"})
			var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/counties.geojson"

			$.getJSON(url_boundary,function(data){ //county boundary data

	        	var items_boundary = data;


				items_boundary = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.geoid === "12086";
				});

				console.log(items_boundary)

	         	var boundary_style = {
	              "fillColor": "#f95819",
	              "color": "white",
	              "weight": 2,
	              "fillOpacity": 0.7
	          	};

	            boundaries = L.geoJson(items_boundary, {
	                style: boundary_style,
	                // pane: "boundary",
	                opacity:0.8,
	                className: "boundary"
	            }).addTo(heat_map_1)


		        var bounds = boundaries.getBounds();
	            var zoom = heat_map_1.getBoundsZoom(bounds);
	            var swPoint = heat_map_1.project(bounds.getSouthWest(), zoom);
	            var nePoint = heat_map_1.project(bounds.getNorthEast(), zoom);
	            var center = heat_map_1.unproject(swPoint.add(nePoint).divideBy(2), zoom);
	            heat_map_1.flyTo(center, (zoom));  

	            heat_map_1.on("layeradd", function (event) {
					boundaries.bringToFront();
				});	

			});
			
		} else if (dir == "up") {
			$(".scrolly-bg").css({"position":"absolute"})

			heat_map_1.flyTo([40.3596928,-99.0598404], 3).removeLayer(boundaries);
		}
	});

	$(".scrolly-text-2").waypoint(function(dir){
		if (dir == "down") {

			$("#heat_map_1").fadeOut(1000)

		} if (dir == "up") {

			$("#heat_map_1").fadeIn(1000)

		}

	});

	$(".story2").waypoint(function(dir){
		if (dir == "down") {

			heat_map_1.flyTo([40.3596928,-99.0598404], 3).removeLayer(boundaries);

		} else if (dir == "up") {

			var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/counties.geojson"

			$.getJSON(url_boundary,function(data){ //county boundary data

	        	var items_boundary = data;


				items_boundary = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.geoid === "12086";
				});

				console.log(items_boundary)

	         	var boundary_style = {
	              "fillColor": "#f95819",
	              "color": "white",
	              "weight": 2,
	              "fillOpacity": 0.7
	          	};

	            boundaries = L.geoJson(items_boundary, {
	                style: boundary_style,
	                // pane: "boundary",
	                opacity:0.8,
	                className: "boundary"
	            }).addTo(heat_map_1)


		        var bounds = boundaries.getBounds();
	            var zoom = heat_map_1.getBoundsZoom(bounds);
	            var swPoint = heat_map_1.project(bounds.getSouthWest(), zoom);
	            var nePoint = heat_map_1.project(bounds.getNorthEast(), zoom);
	            var center = heat_map_1.unproject(swPoint.add(nePoint).divideBy(2), zoom);
	            heat_map_1.flyTo(center, (zoom));  

	            heat_map_1.on("layeradd", function (event) {
					boundaries.bringToFront();
				}).removeLayer(heat125);	

			});

		}
	});

	$(".scrolly-box-3").waypoint(function(dir){

		if (dir=="down") {

			$("#heat_map_1").fadeIn(1000)

			// var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"

			$.getJSON(url_heat,function(data){ //county boundary data

				var items_heat = data

	        	items_heat = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.days_above_100_30yrs !== null;
				});

				console.log(items_heat)

	         	function heatStyle(feature) {
				    return {
				        fillColor: getHeatColor(feature.properties.days_above_100_30yrs),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.9
				    };
				}

	            heat = L.geoJson(items_heat, {
	                style: heatStyle,
	                // pane: "boundary",
	                opacity:1,
	                className: "heat"
	            }).addTo(heat_map_1)


	            if ($(window).width() >= 900) {
					heat_map_1.flyTo([37.6475237,-100.4348271], 5); 
				}
				else if (($(window).width() < 900) & ($(window).width() >= 500)) {
					heat_map_1.flyTo([37.6295171,-95.4234094], 4);
				} 
				else if ($(window).width() < 500) {
					heat_map_1.flyTo([19.7115385,-97.5207257], 3.2);
				}
	             


			});
				

		} else if (dir=="up") {
			$("#heat_map_1").fadeOut(1000)

			if ($(window).width() >= 900) {
				heat_map_1.flyTo([40.3596928,-99.0598404], 3).removeLayer(heat); 
			}
			else if (($(window).width() < 900) & ($(window).width() >= 500)) {
				heat_map_1.flyTo([40.3596928,-99.0598404], 3).removeLayer(heat); 
			} 
			else if ($(window).width() < 500) {
				heat_map_1.flyTo([40.3596928,-99.0598404], 3).removeLayer(heat); 
			}


			
			// heat_map_1.removeLayer(heat125);

		}

	});

	$(".scrolly-box-4").waypoint(function(dir){

		if (dir=="down") {

			if ($(window).width() >= 900) {
				heat_map_1.flyTo([41.2137874,-73.8419899], 6);
			}
			else if (($(window).width() < 900) & ($(window).width() >= 500)) {
				heat_map_1.flyTo([40.3077536,-74.618075], 6); 
			} 
			else if ($(window).width() < 500) {
				heat_map_1.flyTo([38.9345634,-74.7171206], 5); 
			}

			
		}

		else if (dir=="up") {

			if ($(window).width() >= 900) {
				heat_map_1.flyTo([37.6475237,-100.4348271], 5); 
			}
			else if (($(window).width() < 900) & ($(window).width() >= 500)) {
				heat_map_1.flyTo([37.6295171,-95.4234094], 4);
			} 
			else if ($(window).width() < 500) {
				heat_map_1.flyTo([19.7115385,-97.5207257], 3.2);
			}
		}
	});

	$(".scrolly-box-5").waypoint(function(dir){

		if (dir=="down") {
			heat_map_1.removeLayer(heat);

			// var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"

			$.getJSON(url_heat,function(data){ //county boundary data

	        	var items_heat = data;

				console.log(items_heat)

	         	function heat125Style(feature) {
				    return {
				        fillColor: get125Color(feature.properties.bin_flag_today),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.9
				    };
				}

	            heat125 = L.geoJson(items_heat, {
	                style: heat125Style,
	                // pane: "boundary",
	                opacity:1,
	                className: "heat"
	            }).addTo(heat_map_1)


	            if ($(window).width() >= 900) {
					heat_map_1.flyTo([37.6475237,-100.4348271], 5); 
				}
				else if (($(window).width() < 900) & ($(window).width() >= 500)) {
					heat_map_1.flyTo([37.6295171,-95.4234094], 4);
				} 
				else if ($(window).width() < 500) {
					heat_map_1.flyTo([19.7115385,-97.5207257], 3.2);
				}  


			});
		}

		else if (dir=="up") {
			heat_map_1.removeLayer(heat125);
			// var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"

			$.getJSON(url_heat,function(data){ //county boundary data

	        	var items_heat = data;

				console.log(items_heat)

	         	function heatStyle(feature) {
				    return {
				        fillColor: getHeatColor(feature.properties.days_above_100_30yrs),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.9
				    };
				}

	            heat = L.geoJson(items_heat, {
	                style: heatStyle,
	                // pane: "boundary",
	                opacity:1,
	                className: "heat"
	            }).addTo(heat_map_1)


	            if ($(window).width() >= 900) {
					heat_map_1.flyTo([41.2137874,-73.8419899], 6);
				}
				else if (($(window).width() < 900) & ($(window).width() >= 500)) {
					heat_map_1.flyTo([40.3077536,-74.618075], 6); 
				} 
				else if ($(window).width() < 500) {
					heat_map_1.flyTo([38.9345634,-74.7171206], 5); 
				}  


			});
		}
	});


	$(".scrolly-box-6").waypoint(function(dir){

		if (dir=="down") {
			 heat_map_1.removeLayer(heat125);

			// var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"

			$.getJSON(url_heat,function(data){ //county boundary data

	        	var items_heat = data;

				console.log(items_heat)

	         	function heat125Style(feature) {
				    return {
				        fillColor: get125Color(feature.properties.bin_flag_30yrs),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.9
				    };
				}

	            heat125 = L.geoJson(items_heat, {
	                style: heat125Style,
	                // pane: "boundary",
	                opacity:1,
	                className: "heat"
	            }).addTo(heat_map_1)


	            // heat_map_1.flyTo([37.6475237,-100.4348271], 5);  


			});
		}

		else if (dir=="up") {
			heat_map_1.removeLayer(heat125);
			// var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"

			$.getJSON(url_heat,function(data){ //county boundary data

	        	var items_heat = data;

				console.log(items_heat)

	         	function heat125Style(feature) {
				    return {
				        fillColor: get125Color(feature.properties.bin_flag_today),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.9
				    };
				}

	            heat125 = L.geoJson(items_heat, {
	                style: heat125Style,
	                // pane: "boundary",
	                opacity:1,
	                className: "heat"
	            }).addTo(heat_map_1)


	            // heat_map_1.flyTo([37.6475237,-100.4348271], 5);  


			});
		}
	});


	$(".scrolly-text-6").waypoint(function(dir){
		if (dir == "down") {

			$("#heat_map_1").fadeOut(1000)

		} if (dir == "up") {

			$("#heat_map_1").fadeIn(1000)

		}

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


	// TABLE STUFF

	var zipval
	var zipclean
	var filtered_zip_length
	var county_fips
	var county_name
	var state_fips
	var state_name
	var picked_county

	$(".zip-go").click(function(){
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

						    	$(".table-section").delay(1000).qcss({"height":"auto"})

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

							    	$(".table-section").delay(1000).qcss({"height":"auto"})

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
