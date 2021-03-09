var myMap=L.map("mapid",{
center: [31.51073, -96.4247],
zoom: 5
});
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(response){
  console.log(response);
  function styleInfo(feature){
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: colorIntensity(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: feature.properties.mag*5,
      stroke: true,
      weight: 0.5
    }
  }
  function colorIntensity(coordinates) {

    if (coordinates >= 90){
      return "#ff0000"; 
    }
    else if (90> coordinates & coordinates>=70){
      return "#ff7f50"; 
    }
    else if (70> coordinates & coordinates>=50){
      return "#ff8000"; 
    }
    else if (50> coordinates & coordinates>=30){
      return "#ffbf00"; 
    }
    else if (30> coordinates & coordinates>=10){
      return "#ffff00"; 
    }
    else if (10> coordinates){
      return "#bfff00"; 
    }
    
    }
  
  
  
      L.geoJson(response, {
        
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
       
        style: styleInfo,
        onEachFeature: function(feature, layer) {
          layer.bindPopup("Magnitude: " + feature.properties.mag +"<br>Depth:"+ feature.geometry.coordinates[2]+"<br>Location: " + feature.properties.place);
        }
      }).addTo(myMap);

      function getColor(d){
        return d >90 ? "#ff0000":
               d >70 ?  "#ff7f50":
               d >50 ? "#ff8000":
               d >30 ? "#ffbf00":
               d >10 ? "#ffff00":
                        "#bfff00";
              
      }


      var legend= L.control({position: "bottomright"});
      legend.onAdd=function(myMap){
        var div = L.DomUtil.create("div", "info legend"),
        grades =[-10,10,30,50,70,90];
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  legend.addTo(myMap);
});




