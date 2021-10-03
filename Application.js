function initialise_application() {

//************************ Add data to Console for exploration *********************/

const url = "samples.json";
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

//************************ This is the code for selector*********************/

let dropdown_menu = d3.select("#selDataset");

d3.json(url).then((data) => {
    var dataNames = data.names;
console.log(dataNames);

dataNames.forEach((element)=> {
    dropdown_menu
    .append("option")
    .text(element)
    .property("value", element);
});

var firstID = dataNames[0];
plots(firstID);
Metadata(firstID);
gauge(firstID);
});
};

//***** This function triggers the Metadata and plots functions with the default ID *********************/

initialise_application();

//***** This function triggers the Metadata and plots functions with new data for the selected Sample ID *********************/

function newid(newID) {
    // Fetch new data each time a new sample is selected
    Metadata(newID);
    plots(newID);
    gauge(newID);
};

//***** This function populates the Metadata to the display *********************/

function Metadata(element) {
     d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      console.log(metadata);
      var metadata = metadata.filter(object => object.id == element);
      var result = metadata[0];
      var metadata_display = d3.select("#sample-metadata");
      metadata_display.html("");
      Object.entries(result).forEach(([key, value]) => {
        metadata_display.append("h4").text(`${key.toUpperCase()}: ${value}`);
      });
     });
};

//***** This function creates the bar and bubble plots *********************/

function plots(element) {
        d3.json("samples.json").then((data) => {
          var samples_array = data.samples;
          var samples = samples_array.filter(object => object.id == element); 
          var result = samples[0];
          var otu_id = result.otu_ids;
          var otu_label = result.otu_labels;
          var sample_value = result.sample_values.map((value) => parseInt(value));
          var yticks = otu_id.slice(0,10).map((id) => "OTU " + id).reverse();
          
          //***** Horizontal Bar Chart *********************/

          var bartrace = {
            x: sample_value.slice(0,10).reverse(),
            y: yticks,
            hoverinfo: otu_label,
            type: "bar",
            orientation: "h",
          };

          data = [bartrace];

          var barlayout = {
              height: 200,
                  yaxis: {                        
                color: "#f8f8ff",
                size: 6,
                },
                xaxis: {title: {
    
                text: "<b>OTU Count</b>",
                font: {
                    color: "#f8f8ff",
                    size: 10,
                }},
                        color: "#f8f8ff",
                        size: 6,
                    },        margin: {
                        l: 100,
                        r: 35,
                        b: 50,
                        t: 5,
                        pad: 4
                      },    
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
          };

          Plotly.newPlot("bar", data, barlayout);

         //***** Bubble Chart *********************/
      
          var bubbletrace = {
            x: otu_id,
            y: sample_value,
            type: "bubble",
            text: otu_label,
            hoverinfo: "x+y+text",
            mode: "markers",
            marker: {size: sample_value, color: otu_id, colorscale: "Earth"}
          };

          data = [bubbletrace];

          var bubblelayout = {
            autosize: true,
            height: 1000,
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            yaxis: {
                title: {
                    text: "<b>OTU Count</b>",
            font: {
                color: "#f8f8ff",
                size: 20,
            }}, color: "#f8f8ff"},
            xaxis: {title: {
            text: "<b>OTU ID</b>",
            font: {
                color: "#f8f8ff",
                size: 20,
            }}, color: "#f8f8ff"
         },
          };

          Plotly.newPlot("bubble", data, bubblelayout);
        });
    };

//***** This function creates the gauge *********************/

        function gauge(element) {
            d3.json("samples.json").then((data) => {
             var metadata_array = data.metadata;
             console.log(metadata);
        var metadata = metadata_array.filter(object => object.id == element);
        var result = metadata[0];
        console.log(result);
        var washing_frequency = parseFloat(result.wfreq);
        console.log(washing_frequency);
     
        var gaugetrace = {
                type: "indicator",
                mode: "gauge+number",
                value: washing_frequency,
                title: { text: "Weekly Washing Frequency", font: { size: 24 }, },
                gauge: {
                    axis: { range: [0, 10], dtick: 2 },
                    bar: { color: "black" },
                    steps: [
                        {range: [0,2], color: "red"},
                        {range: [2,4], color: "orange"},
                        {range: [4,6], color: "yellow"},
                        {range: [6,8], color: "yellowgreen"},
                        {range: [8,10], color: "green"}]
                  }
        };  

        data = [gaugetrace];

        var gaugelayout = { 
            height: 150,
                margin: { t: 25, r: 25, l: 25, b: 25 },
                paper_bgcolor: "rgba(0,0,0,0)",
                font: { color: "white", family: "Arial",
                size: 24  }
        };

        Plotly.newPlot("gauge", data, gaugelayout);
    

    });
};

    