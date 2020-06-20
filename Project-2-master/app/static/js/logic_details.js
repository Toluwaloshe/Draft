var geojson;

// Create the tile layer that will be the background of our map
var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoiZGFuaWVsbGVobyIsImEiOiJjazlweGpyZTAwZjVvM3BycmM1OTM2MHk0In0.219ncmTIvxFW-tKUB_kDsg"
});

var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: "pk.eyJ1IjoiZGFuaWVsbGVobyIsImEiOiJjazlweGpyZTAwZjVvM3BycmM1OTM2MHk0In0.219ncmTIvxFW-tKUB_kDsg"
});


var layers = {
    africa: new L.LayerGroup(),
    asia: new L.LayerGroup(),
    europe: new L.LayerGroup(),
    northamerica: new L.LayerGroup(),
    oceania: new L.LayerGroup(),
    southamerica: new L.LayerGroup()
  };
  
  // Create a map object
  var myMap = L.map("fem-map", {
    center: [ 51.5074, -0.1278],
    zoom: 1.5,
    layers: [
        outdoors,
        grayscale,
        layers.africa,
        layers.asia,
        layers.europe,
        layers.northamerica,
        layers.oceania,
        layers.southamerica,
    ]
  });

var baseMaps = {
  Outdoor : outdoors,
  Grayscale: grayscale
};

var overlayMaps = {
    "Africa": layers.africa,
    "Asia": layers.asia,
    "Europe": layers.europe,
    "North America": layers.northamerica,
    "Oceania": layers.oceania,
    "South America": layers.southamerica
  };

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

function getColor(d) {
  return d > 42  ? '#56222e' :
         d > 36  ? '#803345' :
         d > 26  ? '#be5b72' :
         d > 18  ? '#DAA095' :
                   '#f2ddd9' ;
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.fem_laborforce),
        weight: 1,
        opacity: 2,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.9
    };
}
// // Happens on mouse hover
function highlight(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 3,
        color: '#ffd32a',
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
  }
  //// Happens on mouse out
  function reset(e) {
    geojson.resetStyle(e.target);
  }

  function zoomToCountry(e) {
    myMap.fitBounds(e.target.getBounds());
  }
  
   function onEachFeature(feature, layer) {
    layer.bindPopup("Year: " + feature.properties.year + 
    "<br>Country: " + feature.properties.country_name +
    "<br>Continent: "+ feature.properties.continent_name +
    "<br>Female Laborforce: "+ feature.properties.fem_laborforce + "%");
    layer.on({
          mouseover: highlight,
          mouseout: reset,
          click: zoomToCountry
    });
    layer.on('mouseover', function(event){
      layer.openPopup();
    });
    layer.on('mouseout', function(event){
      layer.closePopup();
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
    
    myMap.addControl(new extentControl());

  

  // Legend
  var legend = L.control({
    position: 'bottomright'
    }
  );
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        colors = [0,18,26,36,42],
        labels = [];
    div.innerHTML += '<h6>Female Laborforce <br> (% of Total Labor Force)</h6>';
    // Loops through GDP data and grabs colors for each range and puts them in the legend's key
    for (var i = 0; i < colors.length; i++) {
     div.innerHTML +=
        '<i style="background:' + getColor(colors[i] + 1) + '"></i>'  +
         colors[i] + (colors[i + 1] ? '&ndash;' + colors[i + 1] + '<br>' : '+');
    }
    return div;
  };
   legend.addTo(myMap); 
  // Set up the legend
  
   //Filter display of the map by particular year
  function showData(p_year) {
  
    geojson =  L.geoJson(workforceData, {
      filter: function(feature, layer) {
        return feature.properties.continent_name == "Africa" & feature.properties.year == p_year;},
      style: style,
      onEachFeature: onEachFeature
    }).addTo(layers.africa);
  
    geojson =  L.geoJson(workforceData, {
    filter: function(feature, layer) {
      return feature.properties.continent_name == "Asia" & feature.properties.year == p_year;},
    style: style,
    onEachFeature: onEachFeature
  }).addTo(layers.asia);
  
  geojson =  L.geoJson(workforceData, {
    filter: function(feature, layer) {
      return feature.properties.continent_name == "Europe" & feature.properties.year == p_year;},
    style: style,
    onEachFeature: onEachFeature
  }).addTo(layers.europe);
  
  geojson =  L.geoJson(workforceData, {
    filter: function(feature, layer) {
      return feature.properties.continent_name == "North America" & feature.properties.year == p_year;},
    style: style,
    onEachFeature: onEachFeature
  }).addTo(layers.northamerica);
  
  geojson =  L.geoJson(workforceData, {
    filter: function(feature, layer) {
      return feature.properties.continent_name == "Oceania" & feature.properties.year == p_year;},
    style: style,
    onEachFeature: onEachFeature
  }).addTo(layers.oceania);
  
  geojson =  L.geoJson(workforceData, {
    filter: function(feature, layer) {
      return feature.properties.continent_name == "South America" & feature.properties.year == p_year;},
    style: style,
    onEachFeature: onEachFeature
  }).addTo(layers.southamerica);
  };  
  
  function processData(data) {
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
  function createSliderUI(slider_data) {
    var sliderControl = L.control({ position: 'bottomleft'} );
    sliderControl.onAdd = function(map) {
      var slider = L.DomUtil.create("input", "slider");
      L.DomEvent.addListener(slider, 'mousedown', function(e) { 
        L.DomEvent.stopPropagation(e); 
      });
      $(slider)
        .attr({'type':'range', 
          'max': slider_data.max, 
          'min': 1990, 
          'step': 1,
          'value': String(slider_data.max)})
          .on('input change', function() {
          showData($(this).val().toString());
          $(".temporal-legend").text(this.value);
        });
      return slider;
    }
    sliderControl.addTo(myMap)
    createTemporalLegend(slider_data.max);
  }
var slider_data = processData(workforceData);

showData(slider_data.max);

createSliderUI(slider_data);

 function createTemporalLegend(startTimestamp) {
	 var temporalLegend = L.control({ position: 'bottomleft' }); 
	 temporalLegend.onAdd = function(map) { 
		   var output = L.DomUtil.create("output", "temporal-legend");
			 $(output).text(startTimestamp)
		   return output; 
	  }
		temporalLegend.addTo(myMap); 
  }
