var geojson;

// Create the tile layer that will be the background of our map
var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1Ijoic29uYWxwYXRlbDIxMTciLCJhIjoiY2s5ajkyZHp6MDRqaTNscHBobnJwazBhbyJ9.7tawAY0DsmQMQDBDVW6nBw"
});

var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: "pk.eyJ1Ijoic29uYWxwYXRlbDIxMTciLCJhIjoiY2s5ajkyZHp6MDRqaTNscHBobnJwazBhbyJ9.7tawAY0DsmQMQDBDVW6nBw"
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
  var myMap = L.map("gdp-map", {
    center: [ 51.5074, -0.1278],
    zoom: 1.5,
    layers: [
        grayscale,
        outdoors,
        layers.africa,
        layers.asia,
        layers.europe,
        layers.northamerica,
        layers.oceania,
        layers.southamerica
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
  return d > 9 ? '#3e280e' :
           d > 5 ? '#684218' :
           d > 2  ? '#a66a26' :
           d > 1  ? '#d69549' :
           d > 0  ? '#e7c297' :
                     '#faf3ea' ;
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.gdp_growth),
        weight: 2,
        opacity: 1,
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
        color: '#fc1717',
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
  }

  //// Happens on mouse out
  function reset(e) {
    geojson.resetStyle(e.target);
  }

  // Click listener that zooms to country
  function zoomToCountry(e) {
    myMap.fitBounds(e.target.getBounds());
   }
  
  //reset zoom
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
    
    
  function onEachFeature(feature, layer) {
    layer.bindPopup("Year: " + feature.properties.year + "<br>Country: " +
           feature.properties.country_name  +
           "<br>Continent: " + feature.properties.continent_name +"<br>GDP Growth: " + 
           feature.properties.gdp_growth + "%");
    layer.on({
          mouseover: highlight,
          click: zoomToCountry,
          mouseout: reset
    });
    
    layer.on('mouseover', function(event){
      layer.openPopup();
    });
    layer.on('mouseout', function(event){
      layer.closePopup();
    }
    ); 
  }


  var legend = L.control({
    position: 'bottomright'
    }
  );
  

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        colors = [-150,1, 2,5,9],
        labels = [];

    div.innerHTML += '<h6>WORLD GDP GROWTH<br>(% of Total GDP Growth)</h6>';

    // Loops through GDP data and grabs colors for each range and puts them in the legend's key
    for (var i = 0; i < colors.length; i++) {
     div.innerHTML +=
        '<i style="background:' + getColor(colors[i] + 1) + '"></i>'  +
         colors[i] + '&nbsp;'+ '&nbsp;'+ (colors[i + 1] ? '&mdash;'+ '&nbsp;'+ '&nbsp;' + colors[i + 1] + '<br>' : '+');
    }
    return div;
  };
   legend.addTo(myMap); 

  // Set up the legend
  
  // On hover control that displays information about hovered upon country
  var displayInfo = L.control();
  displayInfo.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
  }; 

  
// Passes properties of hovered upon country and displays it in the control
displayInfo.update = function (props) {
    this._div.innerHTML = '<h6>WORLD GDP GROWTH</h6>' +  (props ?
        '<h3>' + props.year + '</h3>' + '<b>' +  'GDP GROWTH: ' + '</b>' + props.gdp_growth + '%' +'<br />'
        +'<b>' + ' COUNTRY: ' + '</b>' + props.country_name + '<br />'
            + '<b>' + 'CONTINENT: ' + '</b>' + props.continent_name + '<br />'
        : 'Hover over a country');
};


function showData(p_year) {

    geojson =  L.geoJson(countriesData, {
      filter: function(feature, layer) {
        return feature.properties.continent_name == "Africa" & feature.properties.year == p_year;},
      style: style,
      onEachFeature: onEachFeature
    }).addTo(layers.africa);
    geojson =  L.geoJson(countriesData, {
    filter: function(feature, layer) {
      return feature.properties.continent_name == "Asia" & feature.properties.year == p_year;},
    style: style,
    onEachFeature: onEachFeature
  }).addTo(layers.asia);
  geojson =  L.geoJson(countriesData, {
    filter: function(feature, layer) {
      return feature.properties.continent_name == "Europe" & feature.properties.year == p_year;},
    style: style,
    onEachFeature: onEachFeature
  }).addTo(layers.europe);
  geojson =  L.geoJson(countriesData, {
    filter: function(feature, layer) {
      return feature.properties.continent_name == "North America" & feature.properties.year == p_year;},
    style: style,
    onEachFeature: onEachFeature
  }).addTo(layers.northamerica);
  geojson =  L.geoJson(countriesData, {
    filter: function(feature, layer) {
      return feature.properties.continent_name == "Oceania" & feature.properties.year == p_year;},
    style: style,
    onEachFeature: onEachFeature
  }).addTo(layers.oceania);
  geojson =  L.geoJson(countriesData, {
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

var slider_data = processData(countriesData);
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
 


 function createTemporalLegend(startTimestamp) {

	 var temporalLegend = L.control({ position: 'bottomleft' }); 
	 temporalLegend.onAdd = function(map) { 
		   var output = L.DomUtil.create("output", "temporal-legend");
			 $(output).text(startTimestamp)
		   return output; 
	  }

		temporalLegend.addTo(myMap); 
	}
