/*
 * Top Tornado Outbreaks of All time
 *  
 * Brendan Heberton
 * www.brendansweather.com
 * @brendansweather
 * 
 */


$(document).ready(function(){
  // Cache the Window object
  $window = $(window);
    $('section[data-type="background"]').each(function(){
      var $bg = $(this);
      $(window).scroll(function() {
      
      var yPos = -($window.scrollTop() / $bg.data('speed')); 
      var coords = '50% '+ yPos + 'px';
      
      // Move the background
      $bg.css({ backgroundPosition: coords });
    
    });
 });
 var app = new torApp();   
}); 

//ie fix
document.createElement("article");
document.createElement("section");

var torApp = function() {
  var self = this;
  var h = 1000;
  var w = document.width;
  
  this.projection = d3.geo.albers()
    .scale(800)
    .center([5, 38])
    .translate([w / 2, h / 2]);

  this.path = d3.geo.path()
    .projection(this.projection);

  this.map_one = d3.select("#map1").append("svg");
  this.map_two = d3.select("#map2").append("svg");
  this.map_three = d3.select("#map3").append("svg");
  this.map_four = d3.select("#map4").append("svg");
  this.map_five = d3.select("#map5").append("svg");
  this.map_six = d3.select("#map6").append("svg");
  this.map_seven = d3.select("#map7").append("svg");
  this.map_eight = d3.select("#map8").append("svg");
  
  this.createMap();
}

torApp.prototype.createMap = function () {
  var self = this;
  var maps = ["map_one", "map_two", "map_three", "map_four", "map_five", "map_six", "map_seven", "map_eight"];
  
  $.each(maps, function(i, map) {
    d3.json("data/world.json", function(error, world) {
      //console.log('world', world)
      self[ map ].insert("path")
        .datum(topojson.object(world, world.objects.world))
        .attr('class', 'world')
        .attr("d", self.path);
        
      self[ map ].insert("path")
        .datum(topojson.object(world, world.objects.counties))
        .attr('class', 'counties')
        .attr("d", self.path);
        
      self[ map ].insert("path")
        .datum(topojson.object(world, world.objects.water))
        .style('fill', '#FEFEFE')
        .attr('class', 'lakes')
        .attr("d", self.path);
        
      self.LoadPoints( map );
    });
  });
}

torApp.prototype.LoadPoints = function( map ) {
  var self = this;
  
  var datasets = {
    map_one: 'data/may-24-26-2011.csv',
    map_two: 'data/feb-5-6-2008.csv',
    map_three: 'data/may-22-2011.csv',
    map_four: 'data/may-3-1999.csv',
    map_five: 'data/nov-21-23-1992.csv',
    map_six: 'data/apr-11-12-1965.csv',
    map_seven: 'data/apr-26-27-28-2011.csv',
    map_eight: 'data/apr-3-4-1974.csv',
  }
    
  d3.csv( datasets[ map ])
    .row(function(d) { return { time: d.Time, scale: d.Fugita, location: d.Location, county: d.County,
      state: d.State, latitude: d.TouchdownLat, longitude: d.TouchdownLon, comments: d.Comments, type: 'Reported Tornado'}; })
    .get(function(error, rows) {
      var reports = self[ map ].append('g');

      $('#tornado-count .count').html(rows.length);

      reports.selectAll("circle")
        .data(rows)
      .enter().insert("circle")
        .attr("transform", function(d) { return "translate(" + self.projection([d.longitude,d.latitude]) + ")";})
        .attr("fill", "#FF0000")
        .attr('class', 'storm-reports')
        .attr('r', 3);
     });
}


