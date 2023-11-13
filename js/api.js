// const apiData = {
// 	token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBiZGI0NWIyZDAwNGRmZDgyNDliY2QwMjJhMTY0YTg3ZTY0MWZhMjMyYWZmMjBiYmE5OTUwNzgwZjUwMTJmYTk4Yjg5OWFlODU5ZWQzZDkxIn0.eyJhdWQiOiI2IiwianRpIjoiMGJkYjQ1YjJkMDA0ZGZkODI0OWJjZDAyMmExNjRhODdlNjQxZmEyMzJhZmYyMGJiYTk5NTA3ODBmNTAxMmZhOThiODk5YWU4NTllZDNkOTEiLCJpYXQiOjE2NzU3OTg2MTQsIm5iZiI6MTY3NTc5ODYxNCwiZXhwIjoxOTkxNDE3ODE0LCJzdWIiOiI0Njc3NiIsInNjb3BlcyI6W119.Ltw2S8OhuxamZL20Bc0py0peLPqnQsHHRdxA84CadezKJU1j1H8gptnxmh1aBDZhtL7tvzPApQfEsViSFa5IYQ",
// 	url: "https://www.huduser.gov/hudapi/public/usps?type=2&year=2021&query=All"
// }

// console.log(apiData.url)

// const cities = []

// fetch('https://www.huduser.gov/hudapi/public/usps?type=2&year=2021&query=CA', {
// 	method: 'GET',
// 	headers: new Headers({
// 		'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBiZGI0NWIyZDAwNGRmZDgyNDliY2QwMjJhMTY0YTg3ZTY0MWZhMjMyYWZmMjBiYmE5OTUwNzgwZjUwMTJmYTk4Yjg5OWFlODU5ZWQzZDkxIn0.eyJhdWQiOiI2IiwianRpIjoiMGJkYjQ1YjJkMDA0ZGZkODI0OWJjZDAyMmExNjRhODdlNjQxZmEyMzJhZmYyMGJiYTk5NTA3ODBmNTAxMmZhOThiODk5YWU4NTllZDNkOTEiLCJpYXQiOjE2NzU3OTg2MTQsIm5iZiI6MTY3NTc5ODYxNCwiZXhwIjoxOTkxNDE3ODE0LCJzdWIiOiI0Njc3NiIsInNjb3BlcyI6W119.Ltw2S8OhuxamZL20Bc0py0peLPqnQsHHRdxA84CadezKJU1j1H8gptnxmh1aBDZhtL7tvzPApQfEsViSFa5IYQ'
// 	})
// }).then((response) => response.json())
//    .then((data) => {

//    	var results = data.data.results
//    	console.log(results)

//    	var results_leng = results.length;

//    	for (var i=0; i<results_leng; i++) {
//    		var city = results[i].city
//    		// console.log(results[i].city)
//    		cities.push(city)
//    	}

//    	console.log(cities)

//    	let uniqueCities = [...new Set(cities)].sort();

//    	console.log(uniqueCities)

//    });

// var results = data.data.results
