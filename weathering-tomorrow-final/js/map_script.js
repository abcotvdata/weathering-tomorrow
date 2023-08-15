/* script.js 
   Author:
   Date:
*/

//zip search option on map

//convert to digits
$.fn.digits = function(){ 
    return this.each(function(){ 
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") ); 
    })
}

$.fn.extend({
   qcss: function(css) {
      return $(this).queue(function(next) {
         $(this).css(css);
         next();
      });
   }
});

	// function zipMapFilterFunction() {
	//   var input, filter, ul, li, a, i;
	//   input = document.getElementById("zipInputMap");
	//   filter = input.value.toUpperCase();
	//   div = document.getElementById("zipDropdownMap");
	//   p = div.getElementsByTagName("p");
	//   for (i = 0; i < p.length; i++) {
	//     txtValue = p[i].textContent || p[i].innerText;
	//     if (txtValue.toUpperCase().indexOf(filter) > -1) {
	//       p[i].style.display = "";
	//     } else {
	//       p[i].style.display = "none";
	//     }
	//   }
	// }




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


// COLORS FOR MAP____________________________

// function getColor(d) {
//     return d > 90 ? '#0d0787' :
//     d > 80 ? '#6703a5' :
//     d > 70 ? '#8b169a' :
//     d > 60 ? '#ac2790' :
//     d > 50 ? '#c2407d' :
//     d > 40 ? '#d8586a' :
//     d > 30 ? '#f38a47' :
//     d > 20 ? '#fbbf2b' :
//     d > 10 ? '#f5dd27' :
//     d > 0.001 ? '#f0f723' :
//     '#DADADA'
// }

function getColor(d) {
    return d > 90 ? '#be0000' :
    d > 80 ? '#da290c' :
    d > 70 ? '#ea4213' :
    d > 60 ? '#f95819' :
    d > 50 ? '#fa791a' :
    d > 40 ? '#fb991b' :
    d > 30 ? '#fcc51a' :
    d > 20 ? '#fcf019' :
    d > 10 ? '#f6f074' :
    d > 0.001 ? '#f0f0cb' :
    '#DADADA'
}



function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElm('.polygons').then((elm) => {
    console.log('Element is ready');
    $(".loading").delay(1500).fadeOut()
});

// const elm = await waitForElm('.polygon');


$(document).ready(function(){

	$(".content").show()
	//___________________________menu stuff___________________________

	$(".back-to-results").click(function(){

		$(".header").fadeIn(500)

		$('html, body').animate({
	        scrollTop: $(".header").offset().top
	    }, 1000).delay(1000);

	    // $("body").css({"overflow":"hidden"})


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

	//______________________________________________generic stuff______________________________________________

	$(".click-more-info-map").click(function(){
		$(".popup-background").show()
		$("body").css({"overflow":"hidden"})
	});

	$(".exit").click(function(){
		$(".popup-background").hide()
		$("body").css({"overflow":"scroll"})
	});



	//_____________________________title stuff____________________________

	$("#card").flip({
	  axis: 'x',
	  trigger: 'manual'
	});

	var flipcount = 0
	// console.log(flipcount)

	$("#card").each(function (i) {
        var el = $(this);
        setInterval(function () {
            el.flip('toggle');

            var flip = $("#card").data("flip-model");

            if (flipcount == 3) {
            	flipcount = 0
            } else {
            	flipcount = Number(flipcount)+1
            }

            if (flipcount == 0) {
            	$(".front").html("live")
            	$(".back").html("learn")
            } else if (flipcount == 1) {
            	$(".front").html("live")
            	$(".back").html("work")
            } else if (flipcount == 2) {
            	$(".front").html("play")
            	$(".back").html("work")
            } else if (flipcount == 3) {
            	$(".front").html("play")
            	$(".back").html("learn")
            }

            

			// e.g. to see currect flip state
			// console.log(flipcount)
        }, 1000);

            
    });


	//_______________________________MAP PAGE HEADER____________________________________

	var queryString = location.search.substring(1);
	// console.log(queryString)

	var string_split = queryString.split("|");
	// console.log(string_split)

	var geo_type = string_split[0];
	console.log(geo_type)

	var risk_type = ""
	risk_type = string_split[1];

	console.log(risk_type)


	
	//zip search function

	// make it so the dropdowns go away if you click outside of them/the inputs

	$('body').click(function (event) {
		if ((!$(event.target).is('#zipInputMap')&&(!$(event.target).is('#zipdropmap')))) {
			// console.log("outside stateInput/statedop")
			$("#zipdropmap").hide()
		} else {
			// console.log("inside stateInput/statedop")
		}
    });

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
			$('#zipdropmap').append('<p zip="'+zip_clean+'" county_name="'+filtered_zips[i].county_name+'" state_name="'+filtered_zips[i].state_name+'">'+ zip_clean +' - '+filtered_zips[i].county_name+', '+filtered_zips[i].state_name+'</p>')

		}

		$("#zipInputMap").click(function(){
			$("#zipdropmap").show()
		});	

		$("#zipdropmap").on('click', 'p', function(){
			$("#zipdropmap").hide()
			$("#zip_mapbutton").show()

			picked_zip = Number($(this).attr('zip'))

			$("#zipInputMap").val(picked_zip)



		}); //end click on zip

	}); // end zip data response

	


	

	// tab styling!!!

	if (risk_type == "fire") {
		$(".fire-tab").css({"background-color":"#fb991b", "color":"white", "box-shadow":"0px 0px 3px #b1b7ba"})
		$(".heat-tab").css({"background-color":"#b1b7ba"})
		$(".flood-tab").css({"background-color":"#b1b7ba"})
		$(".wind-tab").css({"background-color":"#b1b7ba"})

		$(".risk_type_title").html("fire");
		$(".risk_definition").html("Major risk means a property is forecast to have a 6-14% percent chance of being directly damaged by wildfire over 30 years. Severe risk means at least a 15% chance.");

	}

	else if (risk_type == "heat") {
		$(".fire-tab").css({"background-color":"#b1b7ba"})
		$(".heat-tab").css({"background-color":"#fb991b", "color":"white", "box-shadow":"0px 0px 3px #b1b7ba"})
		$(".flood-tab").css({"background-color":"#b1b7ba"})
		$(".wind-tab").css({"background-color":"#b1b7ba"})

		$(".risk_type_title").html("heat");
		$(".risk_definition").html("Major risk means a property is forecast to experience an average July heat index of 89-95 degrees over 30 years. Severe risk means an average of 95-110 degrees.");

	}

	else if (risk_type == "flood") {
		$(".fire-tab").css({"background-color":"#b1b7ba"})
		$(".heat-tab").css({"background-color":"#b1b7ba"})
		$(".flood-tab").css({"background-color":"#fb991b", "color":"white", "box-shadow":"0px 0px 3px #b1b7ba"})
		$(".wind-tab").css({"background-color":"#b1b7ba"})

		$(".risk_type_title").html("flooding");
		$(".risk_definition").html("Major risk means a property is forecast to have an 80% percent chance of flooding once over 30 years. Severe risk means at least a 99% chance.");

	}

	else if (risk_type == "wind") {
		$(".fire-tab").css({"background-color":"#b1b7ba"})
		$(".heat-tab").css({"background-color":"#b1b7ba"})
		$(".flood-tab").css({"background-color":"#b1b7ba"})
		$(".wind-tab").css({"background-color":"#fb991b", "color":"white", "box-shadow":"0px 0px 3px #b1b7ba"})

		$(".risk_type_title").html("wind");
		$(".risk_definition").html("Major risk means a property is forecast to have an 26% percent chance of experiencing tropical storm winds once over 30 years. Severe risk means at least a 80% chance.");

	}



	if (geo_type == "state") {

		picked_state_fips = string_split[2];
		// console.log(picked_state_fips)


		filtered_state = states.filter(function(obj) {
        	// return the filtered value
        	return obj.FIPS === Number(picked_state_fips);
      	});

      	picked_state_name = filtered_state[0].STATE

      	console.log(picked_state_name)

      	$(".content-location").html(picked_state_name)
      	$(".link-to-results").attr('href', 'index.html?state|'+picked_state_fips+"|"+picked_state_name)

	} else if (geo_type == "county") {


		picked_state_fips = string_split[2];
		picked_county_fips = string_split[3];
		console.log(picked_state_fips)
		console.log(picked_county_fips)

		$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/uscounties_simple.csv', function(csvString) {

			// Use PapaParse to convert string to array of objects
	    	var county_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	// console.log(county_data)

	    	filter_counties = county_data.filter(function(obj) {
            	// return the filtered value
            	return obj.geoid === Number(picked_county_fips);
          	});

          	// console.log(filter_counties)

          	picked_state_name = filter_counties[0].state_name
          	picked_county = filter_counties[0].county_name

          	$(".content-location").html(picked_county + ', ' + picked_state_name)
          	$(".link-to-results").attr('href', 'index.html?county|'+picked_state_fips+"|"+picked_state_name+"|"+picked_county_fips+"|"+picked_county)

	    });

	} else if (geo_type == "zip") {

		picked_state_fips = string_split[2];
		picked_county_fips = string_split[3];
		picked_zip = string_split[4];
		console.log(picked_state_fips)
		console.log(picked_county_fips)
		console.log(picked_zip)

		$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/uscounties_simple.csv', function(csvString) {

			// Use PapaParse to convert string to array of objects
	    	var county_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	// console.log(county_data)

	    	filter_counties = county_data.filter(function(obj) {
            	// return the filtered value
            	return obj.geoid === Number(picked_county_fips);
          	});

          	// console.log(filter_counties)

          	picked_state_name = filter_counties[0].state_name
          	picked_county = filter_counties[0].county_name


          	$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/zcta_counties_crosswalk_merge.csv', function(csvString) {
						
				// Use PapaParse to convert string to array of objects
		    	var zip_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    	console.log(picked_zip)

		    	filter_zips_for_county = zip_data.filter(function(obj) {
	            	// return the filtered value
	            	return obj.GEOID_COUNTY_20 === Number(picked_county_fips);
	          	});

	          	filter_zips = filter_zips_for_county.filter(function(obj) {
	            	// return the filtered value
	            	return obj.GEOID_ZCTA5_20 === Number(picked_zip);
	          	});

	          	console.log(filter_zips)

	          	$(".content-location").html(picked_zip +' - '+ picked_county + ', ' + picked_state_name)
	          	$(".link-to-results").attr('href', 'index.html?zip|'+picked_state_fips+"|"+picked_state_name+"|"+picked_county_fips+"|"+picked_county+"|"+picked_zip)

			});

	    });
		

	} // end if else


	//___________BUILD MAP!___________

	var map = L.map('map', {
		minZoom: 3,
		zoomControl: false
	}).setView([40.3596928,-99.0598404], 5);

	var pane = map.createPane('boundary', document.getElementById('map'));

	map.createPane('labels');
	map.getPane('labels').style.zIndex = 650;

	L.control.zoom({
		position: 'topright'
	}).addTo(map)



	//tile layer
	// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	// }).addTo(map);
	var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '&copyOpenStreetMap, &copyCartoDB'
	}).addTo(map);

	var positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
	    attribution: '&copyOpenStreetMap, &copyCartoDB',
	    pane: 'labels'
	}).addTo(map);


	if (geo_type == "state") {

		picked_state_fips = string_split[2];
		console.log(picked_state_fips)

		var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
		console.log(url)


		$.getJSON(url,function(data){

        	var items = data;

        	// console.log(items.features)

			// items = data.features.filter(function(obj) {
			// // return the filtered value
			// return obj.properties.state === leftPad(String(picked_state_fips), 2);
			// });

         	// console.log(items)

         	function majorStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_major),
			        weight: 0.25,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}

			function severeStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_severe),
			        weight: 0.25,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}

			// var geojsonLayer = L.geoJson.ajax(url);

	        var major = L.geoJson(items, {
	            style: majorStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style', direction: 'auto', sticky: 'true', interactive: 'true'})
	            }

	        }).addTo(map);

	        var severe = L.geoJson(items, {
	            style: severeStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
	            }

	        }); //.addTo(map)


	        var risk_severity = {
			    "Major risk": major,
			    "Severe risk": severe
			};

			var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);

	        var bounds = major.getBounds();
            var zoom = map.getBoundsZoom(bounds);
            var swPoint = map.project(bounds.getSouthWest(), zoom);
            var nePoint = map.project(bounds.getNorthEast(), zoom);
            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
            map.flyTo(center, (zoom-1));  


    

	         

      });


	} else if (geo_type == "county") {


		picked_state_fips = string_split[2];
		picked_county_fips = string_split[3];
		console.log(picked_state_fips)
		console.log(picked_county_fips)


		var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
		console.log(url)

		var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/counties.geojson"
		console.log(url)

		$.getJSON(url,function(data){ //actual tract data

        	var items = data;

        	// console.log(items.features)

			items = data.features.filter(function(obj) {
			// return the filtered value
			return obj.properties.state === leftPad(String(picked_state_fips), 2);
			});

         	console.log(items)

         	function majorStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_major),
			        weight: 0.25,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}

			function severeStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_severe),
			        weight: 0.25,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}


	        var major = L.geoJson(items, {
	            style: majorStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
	            }

	        }).addTo(map);

	        var severe = L.geoJson(items, {
	            style: severeStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
	            }

	        }); //.addTo(map)


	        var risk_severity = {
			    "Major risk": major,
			    "Severe risk": severe
			};

			var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);


		});

		$.getJSON(url_boundary,function(data){ //county boundary data

        	var items_boundary = data;

        	console.log(data)

			items_boundary = data.features.filter(function(obj) {
			// return the filtered value
			return obj.properties.geoid === leftPad(String(picked_county_fips), 5);
			});

			console.log(items_boundary)

         	var boundary_style = {
              "fillColor": "none",
              "color": "black",
              "weight": 2,
              "fillOpacity": 0.9
          	};

            var boundaries = L.geoJson(items_boundary, {
                style: boundary_style,
                // pane: "boundary",
                opacity:1,
                className: "boundary"
            }).addTo(map)


	        var bounds = boundaries.getBounds();
            var zoom = map.getBoundsZoom(bounds);
            var swPoint = map.project(bounds.getSouthWest(), zoom);
            var nePoint = map.project(bounds.getNorthEast(), zoom);
            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
            map.flyTo(center, (zoom-1));  

            map.on("layeradd", function (event) {
				boundaries.bringToFront();
			});	

		});

		




	} else if (geo_type == "zip") {

		picked_state_fips = string_split[2];
		picked_county_fips = string_split[3];
		picked_zip = string_split[4];
		console.log(picked_state_fips)
		console.log(picked_county_fips)
		console.log(picked_zip)


		var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
		console.log(url)

		var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/all_zips.geojson"
		console.log(url)

		$.getJSON(url,function(data){ //actual tract data

        	var items = data;

        	// console.log(items.features)

			// items = data.features.filter(function(obj) {
			// // return the filtered value
			// return obj.properties.county === leftPad(String(picked_county_fips), 5);
			// });

         	// console.log(items)

         	function majorStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_major),
			        weight: 0.25,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}

			function severeStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_severe),
			        weight: 0.25,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}


	        var major = L.geoJson(items, {
	            style: majorStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
	            }

	        }).addTo(map);

	        var severe = L.geoJson(items, {
	            style: severeStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
	            }

	        }); //.addTo(map)


	        var risk_severity = {
			    "Major risk": major,
			    "Severe risk": severe
			};

			var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);


		});

		$.getJSON(url_boundary,function(data){ //zip boundary data

        	var items_boundary = data;
			
			console.log(items_boundary)

			items_boundary = data.features.filter(function(obj) {
			// return the filtered value
			return obj.properties.geoid === leftPad(String(picked_zip), 5);
			});

			

         	var boundary_style = {
              "fillColor": "none",
              "color": "black",
              "weight": 2,
              "fillOpacity": 0.9
          	};

            var boundaries = L.geoJson(items_boundary, {
                style: boundary_style,
                // pane: "boundary",
                opacity:1,
                className: "boundary"
            }).addTo(map)


	        var bounds = boundaries.getBounds();
            var zoom = map.getBoundsZoom(bounds);
            var swPoint = map.project(bounds.getSouthWest(), zoom);
            var nePoint = map.project(bounds.getNorthEast(), zoom);
            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
            map.flyTo(center, (zoom-2));  

            map.on("layeradd", function (event) {
				boundaries.bringToFront();
			});	


		});
		

	} // end initial MAP if else


//zoom map on zip click

$("#zip_mapbutton").click(function(){
	// geo_type = "zip"
	// console.log(geo_type)

	var map_picked_zip = $("#zipInputMap").val()
	console.log(map_picked_zip)

	var map_picked_zip_name = 'ZCTA5 ' + map_picked_zip


	$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/zcta_counties_crosswalk_merge.csv', function(csvString) {
		
		// Use PapaParse to convert string to array of objects
    	var zip_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

    	// console.log(zip_data)

    	check_zip = zip_data.filter(function(obj) {
        	// return the filtered value
        	return obj.NAMELSAD_ZCTA5_20 === map_picked_zip_name;
      	});

      	var typed_zip_states = []

      	for (i = 0; i < check_zip.length; i++) {
      		var typed_zip_state = check_zip[i].state_fips
      		typed_zip_states.push(typed_zip_state)
      	}

      	if (typed_zip_states.indexOf(Number(picked_state_fips)) != -1) {

      		$(".loading").fadeIn()

			waitForElm('.zip-boundary').then((elm) => {
			    console.log('Element is ready');
			    $(".loading").delay(1500).fadeOut()
			});
      		
      		var url_zip_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/all_zips.geojson"
			console.log(url)

			$.getJSON(url_zip_boundary,function(data){ //zip boundary data

		    	var items_zip_boundary = data;
				
				console.log(items_zip_boundary)

				items_zip_boundary = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.geoid === leftPad(String(map_picked_zip), 5);
				});

				
		     	var boundary_style = {
		          "fillColor": "none",
		          "color": "black",
		          "weight": 2,
		          "fillOpacity": 0.9
		      	};

		        var zip_boundaries = L.geoJson(items_zip_boundary, {
		            style: boundary_style,
		            // pane: "boundary",
		            opacity:1,
		            className: "zip-boundary"
		        }).addTo(map)


		        var bounds = zip_boundaries.getBounds();
		        var zoom = map.getBoundsZoom(bounds);
		        var swPoint = map.project(bounds.getSouthWest(), zoom);
		        var nePoint = map.project(bounds.getNorthEast(), zoom);
		        var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
		        map.flyTo(center, (zoom-2));  

		        map.on("layeradd", function (event) {
					zip_boundaries.bringToFront();
				});	


			});

      	} else {
      		$(".tryagain").fadeIn()

			$("#oktryagain").click(function(){
				$(".tryagain").fadeOut()
			});
      	}

      	console.log(typed_zip_states)

    	// filtered_zips = zip_data.filter(function(obj) {
     //    	// return the filtered value
     //    	return obj.state_name === picked_state_name;
     //  	});

     //  	var zip_leng = filtered_zips.length;

     //  	console.log(zip_leng)

      	// if (zip_leng == 0) {
      	// 	alert("NOT IN THE STATE!")
      	// } else if (zip_leng != 0) {
      	// 	alert("YES! KEEP GOING!")
      	// }
 



	}); // end zip data response

	

});



//CHANGE MAP ON CLICK________________________________________________________


	$(".map-tab").click(function(){
		var tab_risk_type = $(this).attr("risk_type")
		var tab_risk_type_long = $(this).attr("risk_type_long")
		var tab_risk_description = $(this).attr("risk_description")
		risk_type = tab_risk_type

		$(this).css({"background-color":"#fb991b", "color":"white", "box-shadow":"0px 0px 3px #b1b7ba"})
		$(".map-tab").not(this).css({"background-color":"#b1b7ba", "box-shadow":"none", "color":"black"})

		$(".risk_type_title").html(tab_risk_type_long);
		$(".risk_definition").html(tab_risk_description);

		console.log(risk_type)

		$(".leaflet-overlay-pane svg g").empty()
		$(".leaflet-right").empty()

		if (geo_type == "state") {

			picked_state_fips = string_split[2];
			console.log(picked_state_fips)

			var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
			console.log(url)

			$.getJSON(url,function(data){

	        	var items = data;

	        	// console.log(items.features)

				// items = data.features.filter(function(obj) {
				// // return the filtered value
				// return obj.properties.state === leftPad(String(picked_state_fips), 2);
				// });

	         	// console.log(items)

	         	function majorStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_major),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}

				function severeStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_severe),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}


		        var major = L.geoJson(items, {
		            style: majorStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }).addTo(map);

		        var severe = L.geoJson(items, {
		            style: severeStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }); //.addTo(map)


		        var risk_severity = {
				    "Major risk": major,
				    "Severe risk": severe
				};

				var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);

		        var bounds = major.getBounds();
	            var zoom = map.getBoundsZoom(bounds);
	            var swPoint = map.project(bounds.getSouthWest(), zoom);
	            var nePoint = map.project(bounds.getNorthEast(), zoom);
	            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
	            map.flyTo(center, (zoom-1));  

	            L.control.zoom({
					position: 'topright'
				}).addTo(map)
	    

		         

	      });


		} else if (geo_type == "county") {


			picked_state_fips = string_split[2];
			picked_county_fips = string_split[3];
			console.log(picked_state_fips)
			console.log(picked_county_fips)


			var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
			console.log(url)

			var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/counties.geojson"
			console.log(url)

			$.getJSON(url,function(data){ //actual tract data

	        	var items = data;

	        	// console.log(items.features)

				/*items = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.state === leftPad(String(picked_state_fips), 2);
				});*/

	         	// console.log(items)

	         	function majorStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_major),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}

				function severeStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_severe),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}


		        var major = L.geoJson(items, {
		            style: majorStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }).addTo(map);

		        var severe = L.geoJson(items, {
		            style: severeStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }); //.addTo(map)


		        var risk_severity = {
				    "Major risk": major,
				    "Severe risk": severe
				};

				var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);


			});

			$.getJSON(url_boundary,function(data){ //county boundary data

	        	var items_boundary = data;


				items_boundary = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.geoid === leftPad(String(picked_county_fips), 5);
				});

				console.log(items_boundary)

	         	var boundary_style = {
	              "fillColor": "none",
	              "color": "black",
	              "weight": 2,
	              "fillOpacity": 0.9
	          	};

	            var boundaries = L.geoJson(items_boundary, {
	                style: boundary_style,
	                // pane: "boundary",
	                opacity:1,
	                className: "boundary"
	            }).addTo(map)


		        var bounds = boundaries.getBounds();
	            var zoom = map.getBoundsZoom(bounds);
	            var swPoint = map.project(bounds.getSouthWest(), zoom);
	            var nePoint = map.project(bounds.getNorthEast(), zoom);
	            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
	            map.flyTo(center, (zoom-1));  

	            map.on("layeradd", function (event) {
					boundaries.bringToFront();
				});	

	            L.control.zoom({
					position: 'topright'
				}).addTo(map)				


			});



		} else if (geo_type == "zip") {

			picked_state_fips = string_split[2];
			picked_county_fips = string_split[3];
			picked_zip = string_split[4];
			console.log(picked_state_fips)
			console.log(picked_county_fips)
			console.log(picked_zip)


			var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
			console.log(url)

			var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/all_zips.geojson"
			console.log(url)

			$.getJSON(url,function(data){ //actual tract data

	        	var items = data;

	        	// console.log(items.features)

				// items = data.features.filter(function(obj) {
				// // return the filtered value
				// return obj.properties.county === leftPad(String(picked_county_fips), 5);
				// });

	         	// console.log(items)

	         	function majorStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_major),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}

				function severeStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_severe),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}


		        var major = L.geoJson(items, {
		            style: majorStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }).addTo(map);

		        var severe = L.geoJson(items, {
		            style: severeStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://riskfactor.com/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }); //.addTo(map)


		        var risk_severity = {
				    "Major risk": major,
				    "Severe risk": severe
				};

				var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);


			});

			$.getJSON(url_boundary,function(data){ //zip boundary data

	        	var items_boundary = data;
				
				console.log(items_boundary)

				items_boundary = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.geoid === leftPad(String(picked_zip), 5);
				});

				

	         	var boundary_style = {
	              "fillColor": "none",
	              "color": "black",
	              "weight": 2,
	              "fillOpacity": 0.9
	          	};

	            var boundaries = L.geoJson(items_boundary, {
	                style: boundary_style,
	                // pane: "boundary",
	                opacity:1,
	                className: "boundary"
	            }).addTo(map)


		        var bounds = boundaries.getBounds();
	            var zoom = map.getBoundsZoom(bounds);
	            var swPoint = map.project(bounds.getSouthWest(), zoom);
	            var nePoint = map.project(bounds.getNorthEast(), zoom);
	            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
	            map.flyTo(center, (zoom-2)); 

	            map.on("layeradd", function (event) {
					boundaries.bringToFront();
				});	 

	            L.control.zoom({
					position: 'topright'
				}).addTo(map)	            

			});
			

		} // end click to change MAP if else
	});

//mobile map description 

	$(".map-subheader-mobile-click").click(function(){
		$(".map-subheader").slideDown()
		// $(".map-header").css({"position":"absolute"})
		$(this).hide()
		$(".map-subheader-mobile").hide()
		$(".map-subheader-mobile-hide").show()
		// $("#map").css({"-webkit-mask-image": "linear-gradient(to top, black 20%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.1) 40%, transparent 100%)"})
	});

	$(".map-subheader-mobile-hide").click(function(){
		$(".map-subheader").slideUp()
		$(".map-header").css({"position":"relative"})
		$(this).hide()
		$(".map-subheader-mobile").show()
		$(".map-subheader-mobile-click").show()
		$("#map").css({"-webkit-mask-image": "linear-gradient(to top, black 90%, rgba(0,0,0,0.3) 95%, rgba(0,0,0,0.1) 98%, transparent 100%)"})
	});


//CAROUSEL OF STORIES

	$.get('https://raw.githubusercontent.com/abcotvdata/climate-stories/main/stories.csv', function(csvString) {

		var url = (window.location != window.parent.location)
        ? document.referrer
        : document.location.href;

        console.log(url)

        url2 = parent.document.URL;

        console.log(url2)

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
	

}); 
//end document ready function


	

	



