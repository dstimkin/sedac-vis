ctx.scenarios = ["A1F", "A2a", "A2b", "A2c", "B1a", "B2a", "B2b"];
ctx.border = 60;
ctx.bheight = ctx.height / 20;
ctx.bwidth = ctx.width / 20;
ctx_food = { button_flag: false, axis_flag: false };

function createFoodViz(fooddata) {
	ctx.fooddata = fooddata;
	ctx.country = ctx_globe.selectedCountry;
	let divScenarios = d3.select("#divFood");
	let divFood = d3.select("#svgFood");

	// Creates or clears the div
	let wheat = createOrClear(divFood, "wheat", "g");
	let rice = createOrClear(divFood, "rice", "g");
	let maize = createOrClear(divFood, "maize", "g");

	// add x and y default scales
	xscale = d3
		.scaleLinear()
		.domain([1990, 2090])
		.range([0, ctx.width * 0.7]);
	yscale = d3
		.scaleLinear()
		.domain([
			d3.max(fooddata, function (d) {
				return d.Production;
			}),
			0,
		])
		.range([0, ctx.height * 0.9 - ctx.border]);

	createOrClear(divFood, "x-axis", "g")
		.attr("class", "x-axis")
		.attr(
			"transform",
			"translate(" + ctx.border * 1.5 + "," + ctx.height * 0.9 + ")"
		)
		.attr("fill", "white")
		.call(d3.axisBottom(xscale));
	createOrClear(divFood, "y-axis", "g")
		.attr("class", "y-axis")
		.attr(
			"transform",
			"translate(" + ctx.border * 1.5 + ", " + ctx.border + ")"
		)
		.attr("fill", "white")
		.call(d3.axisLeft(yscale));

	divFood.selectAll(".x-axis path, .x-axis line").attr("stroke", "white");
	divFood.selectAll(".y-axis path, .y-axis line").attr("stroke", "white");

	// Add x and y legends
	createOrClear(divFood, "x-axis-label", "text")
		.attr("class", "x-axis-label")
		.text("Year")
		.attr("x", ctx.width / 2 - ctx.width / 20)
		.attr("y", ctx.height - ctx.border / 3)
		.attr("fill", "white");
	createOrClear(divFood, "y-axis-label", "text")
		.attr("class", "y-axis-label")
		.text("Crop production ( t )")
		.attr("x", -ctx.width / 4)
		.attr("y", ctx.border / 3)
		.style("text-anchor", "middle")
		.attr("transform", "rotate(-90)")
		.attr("fill", "white");

	// Add Title
	createOrClear(divFood, "Title", "text")
		.attr("class", "Title")
		.text(`Crop production prediction in ${ctx_globe.selectedCountry}`)
		.attr("x", ctx.width / 2 - ctx.width / 20)
		.attr("y", ctx.border / 2)
		.style("text-anchor", "middle")
		.style("font-size", 20)
		.attr("fill", "white");

	createOrClear(divFood, "Title buttons", "text")
		.attr("class", "Title")
		.text(`SRES Scenarios`)
		.style("position", "absolute")
		.attr("x", ctx.width - ctx.width / 10)
		.attr("y", ctx.border)
		.style("text-anchor", "middle")
		.style("font-size", 20)
		.attr("fill", "white");

	loadCountryData(
		ctx_globe.selectedCountry,
		fooddata,
		wheat,
		rice,
		maize,
		false
	);
	// Create legend
	addLegend()

	// Creates the buttons
	if (ctx_food.button_flag == false) {
		for (var i = 0; i < ctx.scenarios.length; i++) {
			console.log("creating a button");
			divScenarios
				.append("button")
				.attr("id", ctx.scenarios[i])
				.attr("width", ctx.bwidth)
				.attr("height", ctx.bheight)
				.attr("class", "foodScenarioButton")
				.text(ctx.scenarios[i])
				.style("position", "absolute")
				.style("left", ctx.width - ctx.width / 9 + "px") // Set the left position
				.style("top", ctx.bwidth * (i + 1.5) + "px") // Set the top position
				.raise()
				.on("click", function () {
					showScenarios(this.id);
				});
		}
		ctx_food.button_flag = true;
	}
}

function loadCountryData(country, fooddata, wheat, rice, maize, animate) {
	let divFood = d3.select("#svgFood");
	let countrydata = fooddata.filter((d) => d.Country === country);

	// update the scale
	let max = d3.max(countrydata, function (d) {
		return parseFloat(d.Production);
	});
	console.log(max);
	yscale.domain([max, -max / 20]);
	divFood.select(".y-axis").transition().call(d3.axisLeft(yscale));

	// Creates wheat data
	wheat
		.selectAll("image")
		.data(countrydata.filter((d) => d.Crop === "Wheat"))
		.join(
			(enter) =>
				enter
					.append("image")
					.attr(
						"transform",
						(d) =>
							`translate(${xscale(d.Year) + ctx.border},${
								yscale(d.Production) + ctx.border
							})`
					)
					.attr("id", (d) => `wheat-${d.Country}-${d.Year}`)
					.attr("width", 20)
					.attr("height", 20)
					.attr("xlink:href", "wheat_icon.png")
					.attr("scenario", (d) => d.Scenario),
			(update) =>
				update.call((update) =>
					update
						.transition()
						.duration(animate ? 10 : 0)
						.attr(
							(d) =>
								`translate(${xscale(d.Year) + ctx.border},${
									yscale(d.Production) + ctx.border
								})`
						)
				),
			(exit) => exit.remove()
		);

	// Creates rice data
	rice
		.selectAll("image")
		.data(countrydata.filter((d) => d.Crop === "Rice"))
		.join((enter) =>
			enter
				.append("image")
				.attr(
					"transform",
					(d) =>
						`translate(${xscale(d.Year) + ctx.border},${
							yscale(d.Production) + ctx.border
						})`
				)
				.attr("id", (d) => `rice-${d.Country}-${d.Year}`)
				.attr("width", 20)
				.attr("height", 20)
				.attr("xlink:href", "rice_icon.png")
				.attr("scenario", (d) => d.Scenario)
		),
		(update) =>
			update.call((update) =>
				update
					.transition()
					.duration(animate ? 10 : 0)
					.attr(
						(d) =>
							`translate(${xscale(d.Year) + ctx.border},${
								yscale(d.Production) + ctx.border
							})`
					)
			),
		(exit) => exit.remove();

	// Creates maize data
	maize
		.selectAll("image")
		.data(countrydata.filter((d) => d.Crop === "Maize"))
		.join(
			(enter) =>
				enter
					.append("image")
					.attr(
						"transform",
						(d) =>
							`translate(${xscale(d.Year) + ctx.border},${
								yscale(d.Production) + ctx.border
							})`
					)
					.attr("id", (d) => `maize-${d.Country}-${d.Year}`)
					.attr("width", 20)
					.attr("height", 20)
					.attr("xlink:href", "corn_icon.png")
					.attr("scenario", (d) => d.Scenario),
			(update) =>
				update.call((update) =>
					update
						.transition()
						.duration(animate ? 10 : 0)
						.attr(
							(d) =>
								`translate(${xscale(d.Year) + ctx.border},${
									yscale(d.Production) + ctx.border
								})`
						)
				),
			(exit) => exit.remove()
		);
}

function showScenarios(scenario) {
	wheat = d3.select("#wheat");
	rice = d3.select("#rice");
	maize = d3.select("#maize");

	// Makes other scenarios dissapear
	for (var i = 0; i < ctx.scenarios.length; i++) {
		if (ctx.scenarios[i] !== scenario) {
			maize
				.selectAll('image[scenario="' + ctx.scenarios[i] + '"]')
				.style("opacity", 0.2)
				.attr("width", 10)
				.attr("height", 10);
			wheat
				.selectAll('image[scenario="' + ctx.scenarios[i] + '"]')
				.style("opacity", 0.2)
				.attr("width", 10)
				.attr("height", 10);
			rice.selectAll('image[scenario="' + ctx.scenarios[i] + '"]')
				.style("opacity", 0.2)
				.attr("width", 10)
				.attr("height", 10);
		}
		// Resets current scenario
		if (ctx.scenarios[i] == scenario) {
			maize
				.selectAll('image[scenario="' + ctx.scenarios[i] + '"]')
				.style("opacity", 1)
				.attr("width", 20)
				.attr("height", 20);
			wheat
				.selectAll('image[scenario="' + ctx.scenarios[i] + '"]')
				.style("opacity", 1)
				.attr("width", 20)
				.attr("height", 20);
			rice.selectAll('image[scenario="' + ctx.scenarios[i] + '"]')
				.style("opacity", 1)
				.attr("width", 20)
				.attr("height", 20);
		}
	}
}

function createOrClear(div, id, type) {
	let group = d3.select(`#${id}`);
	if (group.empty()) {
		group = div.append(`${type}`).attr("id", id);
	} else {
		group.selectAll("*").remove();
	}
	return group;
}

function moveFoodData() {
	createFoodViz(ctx.fooddata);
}

function addLegend() {
	let divScenarios = d3.select("#divFood");
	let divFood = d3.select("#svgFood")

		let legend = divFood.select('Legend')
		console.log(legend)
		if (legend.empty()) {
			legend = divFood.append('g').attr("class", "legend")
			print('legeend')
		
		
		  //.attr("transform", "translate(" + (ctx.width - 100) + "," + 20 + ")")
	
		legend.append("image")
		  .attr("xlink:href", "wheat_icon.png") // Replace with the actual path to your rice icon image
		  .attr("width", 20) // Set the width of the legend item
		  .attr("height", 20) // Set the height of the legend item
		  .attr("x", ctx.width - ctx.width / 9) // Adjust the horizontal positioning
		  .attr("y", 8*ctx.bwidth);
		legend.append("image")
		  .attr("xlink:href", "rice_icon.png") // Replace with the actual path to your rice icon image
		  .attr("width", 20) // Set the width of the legend item
		  .attr("height", 20) // Set the height of the legend item
		  .attr("x", ctx.width - ctx.width / 9) // Adjust the horizontal positioning
		  .attr("y", 8.5*ctx.bwidth);
		legend.append("image")
		  .attr("xlink:href", "corn_icon.png") // Replace with the actual path to your rice icon image
		  .attr("width", 20) // Set the width of the legend item
		  .attr("height", 20) // Set the height of the legend item
		  .attr("x", ctx.width - ctx.width / 9) // Adjust the horizontal positioning
		  .attr("y", 9*ctx.bwidth);
		legend.append("text")
			.attr("x", ctx.width - ctx.width / 12) // Adjust the horizontal positioning of the text label
			.attr("y", 8.3*ctx.bwidth) // Adjust the vertical positioning of the text label
			.text(": Wheat")
			.attr("fill", 'white');
		legend.append("text")
			.attr("x", ctx.width - ctx.width / 12) // Adjust the horizontal positioning of the text label
			.attr("y", 8.8*ctx.bwidth) // Adjust the vertical positioning of the text label
			.text(": Rice")
			.attr("fill", 'white');
		legend.append("text")
			.attr("x", ctx.width - ctx.width / 12) // Adjust the horizontal positioning of the text label
			.attr("y", 9.3*ctx.bwidth) // Adjust the vertical positioning of the text label
			.text(": Maize")
			.attr("fill", 'white');
		}
}