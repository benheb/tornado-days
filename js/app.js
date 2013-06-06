/*
 * Top Tornado Outbreaks of All time
 *  
 * Brendan Heberton
 * www.brendansweather.com
 * @brendansweather
 * 
 */


$(document).ready(function(){
  app = new torApp();
}); 

//ie fix
document.createElement("article");
document.createElement("section");

var torApp = function() {
  var self = this, 
    h = 1000,
    w = document.width,
    min = -1000,
    max = 0,
    posWas,
    direction = "down";
  
  $window = $(window);
    $('section[data-type="background"]').each(function(){
      var $bg = $(this);
      $(window).scroll(function() {
        
        var pos = $(window).scrollTop(); //position of the scrollbar
        
        if(pos > posWas){ direction = "down"; }
        if(pos < posWas){ direction = "up"; }
        posWas = pos;
        
        var yPos = -($window.scrollTop() / $bg.data('speed'));
        var coords = '50% '+ yPos + 'px';
        
        if ( self.visibleMap ) {
          if ($('#'+self.visibleMap).is(':appeared')) {
            
            var m = parseInt($('#'+self.visibleMap).css('margin-top').replace(/px/, ''));
            
            if (direction === 'down') {
              m = m + 3;
              if ( m >= max ) m = max;
            } else {
              m = m - 3;
              if ( m <= min ) m = min;
            }
            
            $('#'+self.visibleMap).css('margin-top', m+'px');
            
          }
        }
        
        $bg.css({ backgroundPosition: coords });
      
      });
    });
    
    
    
    $('.about').appear();
    $('.about').on('appear', function() {
      var id = $(this).children('.maps').attr('id');
      
      //TODO add back in
      //$('#'+id+'_counties').show();
      self.visibleMap = id;
      app.LoadPoints( id );
    });
    
    $('.maps').on('disappear', function() {
      var id = $(this).attr('id');
      $('#'+id+'_counties').hide();
      app.RemovePoints( id );
    }); 
  
  this.projection = d3.geo.albers()
    .scale(1300)
    .center([2, 38])
    .translate([w / 2, h / 2]);

  this.path = d3.geo.path()
    .projection(this.projection);

  this.map_one = d3.select("#map_one").append("svg");
  this.map_two = d3.select("#map_two").append("svg");
  this.map_three = d3.select("#map_three").append("svg");
  this.map_four = d3.select("#map_four").append("svg");
  this.map_five = d3.select("#map_five").append("svg");
  this.map_six = d3.select("#map_six").append("svg");
  this.map_seven = d3.select("#map_seven").append("svg");
  this.map_eight = d3.select("#map_eight").append("svg");
  
  this.scales = {
     0: 0,
     1: 2,
     2: 3,
     3: 5,
     4: 8,
     5: 14
  }
  
  
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
        .attr('id', map+'_counties')
        .style('display', 'none')
        .attr("d", self.path);
      
      self[ map ].insert("path")
        .datum(topojson.object(world, world.objects.states))
        .attr('class', 'states')
        .attr('id', map+'_states')
        .attr("d", self.path);
        
      self[ map ].insert("path")
        .datum(topojson.object(world, world.objects.water))
        .style('fill', '#FEFEFE')
        .attr('class', 'lakes')
        .attr("d", self.path);
        
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
  
  
  if ( $('#'+map+'_graphic').length ) return;
  
  d3.csv( datasets[ map ])
    .row(function(d) { return { time: d.Time, scale: d.Fujita, location: d.Location, county: d.County,
      state: d.State, latitude: d.TouchdownLat, longitude: d.TouchdownLon, comments: d.Comments, type: 'Reported Tornado'}; })
    .get(function(error, rows) {
      
      var strongTors = self[ map ].append('g');

      $('#tornado-count .count').html(rows.length);

      strongTors.selectAll("circle")
        .data(rows)
      .enter().insert("circle")
        .attr("transform", function(d) { return "translate(" + self.projection([d.longitude,d.latitude]) + ")";})
        .attr("fill", "#FFFFFF")
        .attr('stroke', "#700000")
        .attr('class', 'storm-reports')
        .attr('opacity', 0.7)
        .attr('id', map+'_graphic')
        .attr('r', function(d) {
          var size = ( d.scale == undefined ) ? 0 : self.scales[d.scale];
          return size;
        });
      
      var reports = self[ map ].append('g');

      $('#tornado-count .count').html(rows.length);

      reports.selectAll("circle")
        .data(rows)
      .enter().insert("circle")
        .attr("transform", function(d) { return "translate(" + self.projection([d.longitude,d.latitude]) + ")";})
        .attr("fill", "#ff3322")
        .attr('class', 'storm-reports')
        .attr('id', map+'_graphic')
        .attr('r', 1);
      
     });
}

torApp.prototype.RemovePoints = function( map ) {
  $('#'+map+'_graphic').remove(); 
}
