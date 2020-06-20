var geojson;

var myMapFem = L.map('fem-map-sum').setView([51.5074, -0.1278], 1);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + "pk.eyJ1IjoiZGFuaWVsbGVobyIsImEiOiJjazlweGpyZTAwZjVvM3BycmM1OTM2MHk0In0.219ncmTIvxFW-tKUB_kDsg", {
    id: 'mapbox/light-v9',
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    zoomOffset: -1
}).addTo(myMapFem);


function getColorFem(d) {
  return d > 42  ? '#56222e' :
         d > 36  ? '#803345' :
         d > 26  ? '#be5b72' :
         d > 18  ? '#DAA095' :
                   '#f2ddd9' ;
}

function styleFem(feature) {
    return {
        fillColor: getColorFem(feature.properties.fem_laborforce),
        weight: 1,
        opacity: 2,
        color: 'white',
        // dashArray: '3',
        fillOpacity: 1
    };
}

// // Happens on mouse hover
function highlightFem(e) {
    var layer_fem = e.target;
    layer_fem.setStyle({
        weight: 3,
        color: '#ffd32a',
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer_fem.bringToFront();
    }
    displayInfoFem.update(layer_fem.feature.properties);
  }

 //// Happens on mouse out  
  function resetFem(e) {
    geojson.resetStyle(e.target);
    displayInfoFem.update();
  }

// Click listener that zooms to country
  function zoomToCountryFem(e) {
    myMapFem.fitBounds(e.target.getBounds());
  }


  function onEachFeature(feature, layer_fem) {
    layer_fem.on({
        mouseover: highlightFem,
        mouseout: resetFem,
        click: zoomToCountryFem
    });
  }

  // Zoom out function
  var extentControl = L.Control.extend({
    options: {
        position: 'topleft'
    },
    onAdd: function (map) {
        var llBounds = map.getBounds();
        var container = L.DomUtil.create('div', 'extentControl');
        $(container).css('background', 'url(../static/css/extend.png) no-repeat 50% 50%').css('width', '26px').css('height', '26px').css('outline', '1px black');
        $(container).on('click', function () {
            map.fitBounds(llBounds);
        });
        return container;
       }
    })
    
    myMapFem.addControl(new extentControl());




  // Legend
  var legend = L.control({
    position: 'bottomright'
    }
  );

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        colors = [0,18, 26, 36, 42],
        labels = [];

    div.innerHTML += '<h7>FEMALE LABORFORCE</h7><br><h10>(% of Total Labor Force)</h10>';

    // Loops through GDP data and grabs colors for each range and puts them in the legend’s key
    for (var i = 0; i < colors.length; i++) {
     div.innerHTML +=
        '<i style="background:' + getColorFem(colors[i] + 1) + '"></i>'  +
         colors[i] + (colors[i + 1] ? '&ndash;' + colors[i + 1] + '<br>' : '+');

    }

    return div;
  };

   legend.addTo(myMapFem);



  // On hover control that displays information about hovered upon country
  var displayInfoFem = L.control();

  displayInfoFem.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'infoside'); // create a div with a class "info"
      this.update();
      return this._div;
  }; 
  
// Passes properties of hovered upon country and displays it in the control
displayInfoFem.update = function (props) {

    this._div.innerHTML = '<h6>FEMALE LABORFORCE</h6>' +  (props ?
        '<h3>' + props.year + '</h3>' + 
        '<b>' + 'FEMALE LABORFORCE: ' + '</b>' + props.fem_laborforce + '%' +'<br />' +
        '<b>' +  'COUNTRY: ' + '</b>' + props.country_name  +'<br />' +
        '<b>' +  'CONTINENT: ' + '</b>' + props.continent_name  +'<br />' 
        : 'Hover over a country');
};

displayInfoFem.addTo(myMapFem);


 // Happens on mouse hover
 function highlightFem(e) {
    var layer_fem = e.target;

    layer_fem.setStyle({
        weight: 3,
        color: '#ffd32a'
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer_fem.bringToFront();
    }

    // Updates custom legend on hover
    displayInfoFem.update(layer_fem.feature.properties);
  }

  // Happens on mouse out
  function resetFem(e) {
    geojson.resetStyle(e.target);
    // Resets custom legend when user unhovers
    displayInfoFem.update();
  }

  //Filter display of the map by particular year
  function showDataFem(p_year) {
    geojson =  L.geoJson(workforceData, {
    filter: function(feature, layer_fem) {
      return feature.properties.year == p_year;},
    style: styleFem,
    onEachFeature: onEachFeature}
    ).addTo(myMapFem)};


  function processDataFem(data) {
    var timestamps = [];
    var min = Infinity; 
    var max = -Infinity;
    for (var feature in data.features) {
      var properties = data.features[feature].properties; 
      for (var attribute in properties) { 
        if ( attribute == 'year') {		
          if ( $.inArray(attribute,timestamps) === -1) {
            timestamps.push(attribute);		
          }
          if (properties[attribute] < min) {	
            min = properties[attribute];
          }
          if (properties[attribute] > max) { 
            max = properties[attribute]; 
          }
        }
      }
    }
    return {
      timestamps : timestamps,
      min : min,
      max : max
    }
  }
function createSliderUIFem(slider_data_fem) {
  var sliderControlFem = L.control({ position: 'bottomleft'} );
  sliderControlFem.onAdd = function(map) {
    var sliderFem = L.DomUtil.create("input", "slider");
    L.DomEvent.addListener(sliderFem, 'mousedown', function(e) { 
      L.DomEvent.stopPropagation(e); 
    });
    $(sliderFem)
      .attr({'type':'range', 
        'max': slider_data_fem.max, 
        'min': 1990, 
        'step': 1,
        'value': String(slider_data_fem.max)})
        .on('input change', function() {
        showDataFem($(this).val().toString());
        $(".temporal-legend-fem").text(this.value);
      });
    return sliderFem;
  }
sliderControlFem.addTo(myMapFem)
createTemporalLegendFem(slider_data_fem.max);
}

var slider_data_fem = processDataFem(workforceData);

showDataFem(slider_data_fem.max);

createSliderUIFem(slider_data_fem);

function createTemporalLegendFem(startTimestamp) {
  var temporalLegendFem = L.control({ position: 'bottomleft' }); 
  temporalLegendFem.onAdd = function(map) { 
    var output = L.DomUtil.create("output", "temporal-legend-fem");
    $(output).text(startTimestamp)
    return output; 
  }
  temporalLegendFem.addTo(myMapFem); 
}

