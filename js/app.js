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

  this.layer_viz = d3.select("#map").append("svg")
  
  this.zoom = d3.behavior.zoom()
    .translate(this.projection.translate())
    .scale(this.projection.scale())
    .on("zoom", function() {
      //console.log(d3.event.scale, self.projection.scale())
      self.projection.translate(d3.event.translate).scale(d3.event.scale);
      self.prev_event = d3.event.scale;

      self.project();
  });
  //this.layer_viz.call(this.zoom);
  
  //this.updatePath();
  
  this.createMap();
}


torApp.prototype.project = function(){
  var self = this;
  var path = this.path;

  this.layer_viz.selectAll('path')
    .attr("d", path);
    
  d3.selectAll("circle")
    .attr("transform", function(d) { return "translate(" + self.projection([d.longitude,d.latitude]) + ")";})

}

torApp.prototype.updatePath = function() {
  var h  = document.height;
  var w  = document.width;

  //this.projection = d3.geo.Eckert1() //Composer.Map.projection.name ]()
  this.projection = d3.geo.albers()
    .scale(1300)
    .center([-0, 38])
    .translate([w / 2, h / 2]);


  this.path = d3.geo.path()
      .projection( this.projection );
}


torApp.prototype.createMap = function () {
  var self = this;
  
  d3.json("data/world.json", function(error, world) {
    //console.log('world', world)
    self.layer_viz.insert("path")
      .datum(topojson.object(world, world.objects.world))
      .attr('class', 'world')
      .attr("d", self.path);
      
    self.layer_viz.insert("path")
      .datum(topojson.object(world, world.objects.counties))
      .attr('class', 'counties')
      .attr("d", self.path);
      
    self.layer_viz.insert("path")
      .datum(topojson.object(world, world.objects.water))
      .style('fill', '#FEFEFE')
      .attr('class', 'lakes')
      .attr("d", self.path);
      
    self.loadReports();
  });
}

torApp.prototype.loadReports = function() {
  var self = this;
    
     d3.csv('data/apr-11-12-1965.csv')
    .row(function(d) { return { time: d.Time, scale: d.Fugita, location: d.Location, county: d.County,
      state: d.State, latitude: d.TouchdownLat, longitude: d.TouchdownLon, comments: d.Comments, type: 'Reported Tornado'}; })
    .get(function(error, rows) {
      var reports = self.layer_viz.append('g');

      $('#tornado-count .count').html(rows.length);

      reports.selectAll("circle")
        .data(rows)
      .enter().insert("circle")
        .attr("transform", function(d) { return "translate(" + self.projection([d.longitude,d.latitude]) + ")";})
        .attr("fill", "#FF0000")
        .attr('class', 'storm-reports')
        .attr('r', 3)
        .style("display", "block")
        .on('mouseover', function() {
          d3.select(this)
            .attr('d', self.hover)
            .transition()
              .duration(1000)
              .attr('r', 10)
            .transition()
              .duration(400)
              .attr('r', 3)  
        });
        
     });
}


