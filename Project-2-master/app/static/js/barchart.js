d3.json("../static/data/final_workforce_data.json").then(function(femdata) {
  d3.json("../static/data/final_gdp_data.json").then(gdpData => {
      
    var all_years = femdata.data.map(row => row.year)
    var continent_name = femdata.data.map(row => row.continent_name)
    var cont_distinct = [...new Set(continent_name)]
  //  console.log(cont_distinct)
    
    var avgFemLaborForce = [];
    var avgGDPgrowth = [];
    //Find min max of all years
    min_year = d3.min(all_years)
    max_year = d3.max(all_years)

    min_fem = d3.min(avgFemLaborForce)
    max_fem = d3.max(avgFemLaborForce)

    femxaxis = d3.range(min_fem, max_fem)

    //Create variables for value that will go on the chart
    var years = d3.range(1990, max_year)
    //Calculate average female labor force participation and average GDP growth

    years.forEach(year =>{
        var femRows = femdata.data.filter(row => row.year == year)
        var gdpRows = gdpData.data.filter(row => row.year == year)
        avgFemLaborForce.push(d3.mean(femRows.map(row => row.fem_laborforce)))
        avgGDPgrowth.push(d3.mean(gdpRows.map(row => row.gdp_growth)))

    })


    //Africa
      var avgFemLaborForce_Africa = [];
      var avgGDPgrowth = [];
      years.forEach(year =>{
          var femRows = femdata.data.filter(row => row.year == year & row.continent_name == "Africa")
          var gdpRows = gdpData.data.filter(row => row.year == year)
          avgFemLaborForce_Africa.push(d3.mean(femRows.map(row => row.fem_laborforce)))
          avgGDPgrowth.push(d3.mean(gdpRows.map(row => row.gdp_growth)))
      })


      //Asia
      var avgFemLaborForce_Asia = [];
      var avgGDPgrowth = [];
      years.forEach(year =>{
          var femRows = femdata.data.filter(row => row.year == year & row.continent_name == "Asia")
          var gdpRows = gdpData.data.filter(row => row.year == year)
          avgFemLaborForce_Asia.push(d3.mean(femRows.map(row => row.fem_laborforce)))
          avgGDPgrowth.push(d3.mean(gdpRows.map(row => row.gdp_growth)))
      })

      //Europe
      var avgFemLaborForce_Europe = [];
      var avgGDPgrowth = [];
      years.forEach(year =>{
          var femRows = femdata.data.filter(row => row.year == year & row.continent_name == "Europe")
          var gdpRows = gdpData.data.filter(row => row.year == year)
          avgFemLaborForce_Europe.push(d3.mean(femRows.map(row => row.fem_laborforce)))
          avgGDPgrowth.push(d3.mean(gdpRows.map(row => row.gdp_growth)))
      })

      //Oceana
      var avgFemLaborForce_Oceana = [];
      var avgGDPgrowth = [];
      years.forEach(year =>{
          var femRows = femdata.data.filter(row => row.year == year & row.continent_name == "Oceana")
          var gdpRows = gdpData.data.filter(row => row.year == year)
          avgFemLaborForce_Oceana.push(d3.mean(femRows.map(row => row.fem_laborforce)))
          avgGDPgrowth.push(d3.mean(gdpRows.map(row => row.gdp_growth)))
      })

      //North America
      var avgFemLaborForce_NA = [];
      var avgGDPgrowth = [];
      years.forEach(year =>{
          var femRows = femdata.data.filter(row => row.year == year & row.continent_name == "North America")
          var gdpRows = gdpData.data.filter(row => row.year == year)
          avgFemLaborForce_NA.push(d3.mean(femRows.map(row => row.fem_laborforce)))
          avgGDPgrowth.push(d3.mean(gdpRows.map(row => row.gdp_growth)))
      })

      //South America
      var avgFemLaborForce_SA = [];
      var avgGDPgrowth = [];
      years.forEach(year =>{
          var femRows = femdata.data.filter(row => row.year == year & row.continent_name == "South America")
          var gdpRows = gdpData.data.filter(row => row.year == year)
          avgFemLaborForce_SA.push(d3.mean(femRows.map(row => row.fem_laborforce)))
          avgGDPgrowth.push(d3.mean(gdpRows.map(row => row.gdp_growth)))
      })
      

      //Create traces
      var trace1 = {
      x:cont_distinct,
      y:avgFemLaborForce,
      type: "bar",
      marker: {
        color: "#56222E"},
      // yaxis: 'y1',
      name: "Female Labor Force"
          
      };

      var trace2 = {
      x:cont_distinct,
      y:avgGDPgrowth,
      type: "line",
      marker: {
        color: "#D69549"},
      yaxis: 'y2',
      name: "GDP Growth"
          
      };

      var data =[trace1, trace2];

      var layout = {
          title: 'Percentage of Females in the Workforce vs. GDP Growth',
          font: {
            size: 10,
            font: 'verdana',
          },
          legend: {
            x: 0,
            y: 1,
            traceorder: 'normal'
          },
          yaxis1: {
            title: 'Average Female Workforce Participation (%)',
            titlefont: {color: 'black'},
            showgrid: false,
          range: [33,34.1]
          },
          yaxis2: {
            title: 'Average GDP Growth (%)',
            titlefont: {color: 'black'},
            tickfont: {color: 'black'},
            overlaying: 'y',
            side: 'right'
          },
          barmode: 'group',
        };

      var config = {responsive: true}

      Plotly.newPlot("barchart", data, layout, config)



  });

});
