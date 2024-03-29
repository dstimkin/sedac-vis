let ctx = {
	data: null,
	globew: 500,
	globeh: 500,
	width: window.innerWidth / 2,
	height: window.innerHeight / 2,
	sensitivity: 75,
	svg: null,
	dflag: 0,
	TRANSITION_DURATION: 1500,
};

function createViz() {
	console.log("Using D3 v" + d3.version);

	loadData();

	const width = window.innerWidth;
	const height = window.innerHeight;

	// Globe
	var divGlobe = d3
		.select("#main")
		.append("div")
		.attr("width", width / 4)
		.attr("height", height / 2)
		.attr("id", "divGlobe")
		.style("position", "absolute")
		.style("top", 25 + "px")
		.style("left", width / 4 + "px");

	var svgGlobe = divGlobe
		.append("svg")
		.attr("width", width / 4)
		.attr("height", -40 + height / 2)
		.attr("id", "svgGlobe");
	// .style("background-color", "#f00");

	// Description, Config
	var divConfig = d3
		.select("#main")
		.append("div")
		.attr("width", width / 4)
		.attr("height", -50 + height / 2)
		.attr("id", "divConfig")
		.style("position", "absolute")
		.style("top", 50+ "px")
		.style("left", 0 + "px");

	var svgConfig = divConfig
		.append("svg")
		.attr("width", width / 4)
		.attr("height", -50 + height / 2)
		.attr("id", "svgConfig");

	// EPI
	var divEpi = d3
		.select("#main")
		.append("div")
		.attr("width", width / 2)
		.attr("height", height / 2 - 100)
		.attr("id", "divEpi")
		.style("position", "absolute")
		.style("top", 0 + "px")
		.style("left", width / 2 + "px");

	var svgEpi = divEpi
		.append("svg")
		.attr("width", width / 2)
		.attr("height", height / 2 - 100)
		.attr("id", "svgEpi");
	// .style("background-color", "#0f0");

	// Emissions
	var divEmissions = d3
		.select("#main")
		.append("div")
		.attr("width", width / 2)
		.attr("height", -50 + height / 2)
		.attr("id", "divEmissions")
		.style("position", "absolute")
		.style("top", 50 + height / 2 + "px")
		.style("left", 0 + "px");

	var svgEmissions = divEmissions
		.append("svg")
		.attr("width", width / 2)
		.attr("height", -50 + height / 2)
		.attr("id", "svgEmissions");
	// .style("background-color", "#00f");

	var divTimeLine = d3
		.select("#main")
		.append("div")
		.attr("width", width / 2)
		.attr("height", 100)
		.attr("id", "divTimeLine")
		.style("position", "absolute")
		.style("top", -50 + height / 2 + "px")
		.style("left", 0 + "px");

	var svgTimeLine = divTimeLine
		.append("svg")
		.attr("width", width / 2)
		.attr("height", 100)
		.attr("id", "svgTimeLine");

	// Food
	var divFood = d3
		.select("#main")
		.append("div")
		.attr("width", width / 2)
		.attr("height", height / 2)
		.attr("id", "divFood")
		.style("position", "absolute")
		.style("top", height / 2 + "px")
		.style("left", width / 2 + "px");

	var svgFood = divFood
		.append("svg")
		.attr("width", width / 2)
		.attr("height", height / 2)
		.attr("id", "svgFood");
	// .style("background-color", "#ff0");
}

function loadData() {
	let promises = [
		d3.dsv(";", "data/food.csv"),
		d3.csv("data/CDA_ind.csv"),
		d3.csv("data/PMD_ind.csv"),
		d3.csv("data/REC_ind.csv"),
		d3.csv("data/TCL_ind.csv"),
		d3.csv("data/gdp_per_capita.csv"),
	];
	Promise.all(promises)
		.then(function ([food, cda, pmd, rec, tcl, gdp_per_capita]) {
			createGlobeViz(),
				createEmissionsViz(),
				createEpiViz(cda, pmd, rec, tcl, gdp_per_capita),
				createFoodViz(food);
		})
		.catch(function (error) {
			console.log(error);
		});
}

function createEpiViz() {
	console.log("Loading EPI data");
}

function createFoodViz() {
	console.log("Loading Food data");
}
