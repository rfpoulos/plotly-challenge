async function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
	const metadata = await d3.json(`/metadata/${sample}`);

	// Use d3 to select the panel with id of `#sample-metadata`
	const sampleMetadata = d3.select("#sample-metadata");

	// Use `.html("") to clear any existing metadata
	sampleMetadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
	// tags for each key-value in the metadata.
	const metaDataEntries = Object.entries(metadata);
    metaDataEntries.forEach(([key, value]) => {
		const li = sampleMetadata.append("li");
		li.text(`${key}: ${value}`);
	});

	// metadata.forEach()

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

async function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
	const data = await d3.json(`/samples/${sample}`);
	buildBubbleChart(data);

	buildPieChart(data);
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
	// otu_ids, and labels (10 each).
	

}
const buildPieChart = (data) => {
	const inputData = [{
		values: data.sample_values.slice(0, 10),
		labels: data.otu_ids.slice(0, 10),
		type: 'pie'
	  }];
	  
	const layout = {
	height: 400,
	width: 500
	};
	
	Plotly.newPlot("pie", inputData, layout);
}

const buildBubbleChart = (data) => {
		// @TODO: Build a Bubble Chart using the sample data
		const trace1 = {
			x: data.otu_ids,
			y: data.sample_values,
			mode: 'markers',
			marker: {
			  size: data.sample_values
			}
		  };
		  
		  
		const layout = {
			title: "Bubble Chart",
			showlegend: false,
			height: 600,
			width: 600
		  };
		  
		  Plotly.newPlot("bubble", [trace1], layout);
	
} 

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    optionChanged(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
