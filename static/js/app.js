function gaugeChart(sampleWfreq) {
    if(sampleWfreq.wfreq === null){
      sampleWfreq.wfreq = 0;
    }
//draw gauge graph
    var degree = parseInt(sampleWfreq.wfreq) * (180/10);
    console.log(degree)
    var degrees = 180 - degree;
    var radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
  
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);
    
    var trace = [{ type: 'scatter',
       x: [0], y:[0],
        marker: {size: 50, color:'2F6497'},
        showlegend: false,
        name: 'Wash Freq',
        text: sampleWfreq.wfreq,
        hoverinfo: 'text+name'},
      { values: [1, 1, 1, 1, 1, 1, 1, 1, 1, 9],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1',''],
      textinfo: 'text',
      textposition:'inside',
      textfont:{
        size : 16,
        },
    
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '2-1', '0-1',''],
      marker: {colors:["blue", "red", "orange", "green", "pink", "purple", "gray", "yellow", "brown", "white"]},
      hoverinfo: 'text',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];
  
    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '#2F6497',
          line: {
            color: '#2F6497'
          }
        }],
  
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      height: 550,
      width: 550,
      xaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                 showgrid: false, range: [-1, 1]},
    };
  
    Plotly.newPlot('gauge', trace, layout, {responsive: true});

  }



function plotter(testId){
    //promise from json file
    d3.json("../data/samples.json").then((data)=> {
        var sampleWfreq = data.metadata.filter(d => String(d.id) === testId)[0];
    //filtered values by given on testId
        var filteredSamples = data.samples.filter(d => String(d.id) === testId)[0];
    //get top 10 samples
        var filteredValues  = filteredSamples.sample_values.slice(0,10);
    //Get otu ids with format for Graph
        var filteredIds     = filteredSamples.otu_ids.slice(0, 10).map(d => "OTU " + d)
    //Get otu labels
        var filteredOtuLabels = filteredSamples.otu_labels.slice(0, 10);
    // create trace variable for the bar plot
        var trace = {
                x: filteredValues,
                y: filteredIds,
                text: filteredOtuLabels,
                type:"bar",
                orientation: "h",
                transforms: [{
                    type: 'sort',
                    target: 'x',
                    order: 'ascending'
                  }, {
                    type: 'filter',
                    target: 'x',
                    operation: '>',
                    value: 1
                  }]};
        
        // create data variable
        var data = [trace];
         var layout = {
                title: "Top 10 Bacteria Cultures Found",
                yaxis:{
                    tickmode:"linear",
                },
                margin: {                        
                    l: 100,
                    r: 100,
                    t: 30,
                    b: 20
                    }
                };
        
         // create the bar plot
        Plotly.newPlot("bar", data, layout);

//////////////////////////////////////////////////
// Bubble Chart
 // create trace variable for the bar plot
        var trace2 = {
            x: filteredSamples.otu_ids,
            y: filteredSamples.sample_values,
            mode: "markers",
            marker: {
                size: filteredSamples.sample_values,
                color: filteredSamples.otu_ids
            },
            text: filteredSamples.otu_labels

        };
 // create layout variable for the bar plot
        var layout2 = {
            title: "Bacteria Cultures per Sample",
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1300
        };
        var data2 = [trace2];

        Plotly.newPlot("bubble", data2, layout2); 
//Call gauge function
        gaugeChart(sampleWfreq)
//Add data to description
        var demoInfo = d3.select("#sample-metadata");
        demoInfo.html("");
        Object.entries(sampleWfreq).forEach((key) => {   
                demoInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
         
    })
    

};

// create the function for the change event
function optionChanged(testId) {
    plotter(testId);
}

//
function init() {
// select dropdown menu 
    var selection = d3.select("#selDataset");
    d3.json("../data/samples.json").then((data)=> {

        data.names.forEach(function(name) {
            selection.append("option").text(name).property("value");
        });
//Initialize page with initial values
        plotter(data.names[0]);
    });
}

init();