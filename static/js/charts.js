function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var requiredSamples = samples.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = requiredSamples[0]
    console.log(firstSample)


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // var otu_ids = firstSample.map(i => i.otu_ids)
    // var otu_labels = firstSample.map(i => i.otu_labels)
    // var sample_values = firstSample.map(i => i.sample_values)
    var otu_ids = firstSample.otu_ids
    var otu_labels = firstSample.otu_labels
    var sample_values = firstSample.sample_values
    
    console.log(otu_ids, otu_labels, sample_values)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.map(i => `OTU ${i}`).slice(0,10).reverse()
    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [{
      
      type: 'bar',
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      orientation: 'h',
      text: otu_labels.slice(0,10).reverse()
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
  
      title: "Top 10 Bacteria Cultures Found",
      xaxis:{title: "Sample Values"},
      yaxis: {title: "OTU IDs"}
            //tickprefix: `OTU `}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // DELIVERABLE 2
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids
      },
      colorscale : "Portland",
      text: otu_labels

    }];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Values"},
      hovermode: "closest",
      showlegend: false,
      height: 600,
      width: 1000
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


    // DELIVERABLE 3
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataSamples = data.metadata;
    var sampleArray = metadataSamples.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var sampleFirst = sampleArray[0];


    // 3. Create a variable that holds the washing frequency.
    var washingFrequency = parseFloat(sampleFirst.wfreq);
    console.log(washingFrequency)

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingFrequency,
        type: "indicator",
        mode: "gauge+number",
        title: { text: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week', font: { size: 20 } },
        gauge: {
          axis: { range: [0, 10], tickwidth: 2, tickcolor: "black" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lime" },
            { range: [8, 10], color: "green" }
          ]}
     
        }]
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "black", family: "Arial"}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

// Initialize the dashboard
init();