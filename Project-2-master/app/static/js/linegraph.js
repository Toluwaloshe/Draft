d3.json("../static/data/final_workforce_data.json").then(function(femdata) {
    d3.json("../static/data/final_gdp_data.json").then(gdpData => {
        var all_years = femdata.data.map(row => row.year)

        //Find min max of all years
        min_year = d3.min(all_years)
        max_year = d3.max(all_years)

        //Create variables for value that will go on the chart
        var years = d3.range(1990, max_year)
        var avgFemLaborForce = [];
        var avgGDPgrowth = [];

        //Calculate average female labor force participation and average GDP growth
        years.forEach(year =>{
            var rows = femdata.data.filter(row => row.year == year)
            var gdpRows = gdpData.data.filter(row => row.year == year)
            avgFemLaborForce.push(d3.mean(rows.map(row => row.fem_laborforce)))
            avgGDPgrowth.push(d3.mean(gdpRows.map(row => row.gdp_growth)))

        })

        //Create traces
        var trace1 = {
        x: years,
        y:avgFemLaborForce,
        type: "line",
        marker: {
          color: "#56222E"},
        name: "Female Workforce Paticipation"
            
        };

        var trace2 = {
        x: years,
        y:avgGDPgrowth,
        type: "line",
        marker: {
          color: "#D69549"},
        yaxis: 'y2',
        name: "GDP Growth"
            
        };

        var data =[trace1, trace2];

        var layout = {
            title: 'Percentage of Females in the Workforce & GDP Growth (1990-2018)',
            font: {
              size: 10,
              font: 'verdana',
            },
            legend: {
              x: 0,
              y: 1,
              traceorder: 'normal'
            },
            yaxis: {
              title: 'Average Female Workforce Participation (%)',
              showgrid: false,
            },
            yaxis2: {
              title: 'Average GDP Growth (%)',
              titlefont: {color: 'black'},
              tickfont: {color: 'black'},
              overlaying: 'y',
              side: 'right',
            }
          };
        
        var config = {responsive: true}

        Plotly.newPlot("linegraph", data, layout, config)



    });

});
