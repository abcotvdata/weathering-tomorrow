/* script.js 
   Author:
   Date:
*/

$.fn.extend({
   qcss: function(css) {
      return $(this).queue(function(next) {
         $(this).css(css);
         next();
      });
   }
});


$(document).ready(function(){ // begin document.ready block

	//jquery code here

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

				      			$(".loading").fadeIn()
						    	$(".loading").delay(1000).fadeOut()

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

							      		$(".table-section").delay(1000).qcss({"height":"auto"})

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

						      		$(".loading").fadeIn()
							    	$(".loading").delay(1000).fadeOut()

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

							      		$(".table-section").delay(1000).qcss({"height":"auto"})

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
