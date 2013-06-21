/*
 * Top Tornado Outbreaks of All time
 *  
 * Brendan Heberton
 * www.brendansweather.com
 * @brendansweather
 * 
 */


$(document).ready(function(){
  var height = $(window).height() + 20;
  $('.about').css('height', height+'px');
  $('#home').css('height', height+'px');
  
  var w = $(window).width(),
      h = $(window).height() + 100;
  
  $('#intro-map').css( { 'width': w+'px', 'height': h+'px' } );
  
  app = new torApp();
}); 

//ie fix
document.createElement("article");
document.createElement("section");

var torApp = function() {
  var self = this, 
    h = 1000,
    w = document.width,
    min = 40,
    max = 95,
    m = 0,
    posWas,
    direction = "down";
  
  this.can_scroll = false;
  this.intro();
  
  $window = $(window);
    $('section[data-type="background"]').each(function(){
      var $bg = $(this);
      var $wbg = $('#intro-map-window .inner.wbg');
      var $text = $('.map-blurb-text');
      
      $(window).scroll(function(e) {
        
        if ( !self.can_scroll ) {
          $('body').css('overflow', 'hidden');
          return;
        }
        
        var pos = $(window).scrollTop(); //position of the scrollbar
        
        if ( pos > 10 ) {
          $('#intro-map').fadeOut();
          $('#intro-map-window-one').fadeOut();
          $('#intro-map-window-two').show();
          $('#scroll-tip-container').hide();
        } else {
          $('#intro-map-window-two').hide();
          $('#intro-map').fadeIn();
          $('#intro-map-window-one').show();
          $('#scroll-tip-container').show();
        }
        
        var active = self.visible || 'map_one';
        var $blurb = $('.map-blurb.'+active);
        
        var yPos = -($window.scrollTop() / $bg.data('speed'));
        var coords = '50% '+ yPos + 'px';
        var bcoords = 'right '+yPos + 'px';
        
        $bg.css({ backgroundPosition: coords });
        
      });
    });
    
    
    
    $('.about').appear();
    $('.about').on('appear', function() {
      var id = $(this).children('.maps').attr('id');
      
      //TODO add back in
      //$('#'+id+'_counties').show();
      self.visible = id;
      app.LoadPoints( id );
    });
    
    $('.maps').on('disappear', function() {
      var id = $(this).attr('id');
      $('#'+id+'_counties').hide();
      app.RemovePoints( id );
    }); 
  
  this.projection = d3.geo.albers()
    .scale(1700)
    .center([20, 33])
    .clipAngle(90)
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
     0: 3,
     1: 5,
     2: 7,
     3: 11,
     4: 14,
     5: 19
  }
  
  //this.createMap();
}

torApp.prototype.animate = function( m ) {
  
  var self = this;
  self.projection.rotate([ m, 8.999]);
  self.map_one.selectAll("circle")
    .attr("transform", function(d) {return "translate(" +  self.projection([d.longitude,d.latitude]) + ")";})
  self.map_one.selectAll("path").attr("d", self.path);
  
}


torApp.prototype.createMap = function () {
  var self = this;
  var maps = ["map_one", "map_two", "map_three", "map_four", "map_five", "map_six", "map_seven", "map_eight"];
  //var maps = [ "map_one" ];
  
  $.each(maps, function(i, map) {
    d3.json("data/world.json", function(error, world) {
      //console.log('world', world)
      self[ map ].insert("path")
        .datum(topojson.feature(world, world.objects.world))
        .attr('class', 'world')
        .attr("d", self.path);
      
      self[ map ].insert("path")
        .datum(topojson.feature(world, world.objects.states))
        .attr('class', 'states')
        .attr('id', map+'_states')
        .attr("d", self.path);
        
      self[ map ].insert("path")
        .datum(topojson.feature(world, world.objects.water))
        .attr('class', 'lakes')
        .attr("d", self.path);
        
      /* 
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
        .style('display', 'none')
        .attr("d", self.path);
      
      */  
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
    .row(function(d) { return { date: d.Date, scale: d.Fujita, county: d.County1,
      state: d.State1, latitude: d.TouchdownLat, longitude: d.TouchdownLon, damages: d.Damage, injuries: d.Injuries, fatalities: d.Fatalities}; })
    .get(function(error, rows) {
      var injured = 0;
      var cost = 0;
      var count = 0;
      
      var strongTors = self[ map ].append('g');

      $('#tornado-count .count').html(rows.length);

      strongTors.selectAll("circle")
        .data(rows)
      .enter().insert("circle")
        .attr("transform", function(d) { return "translate(" + self.projection([d.longitude,d.latitude]) + ")";})
        .attr("fill", "#FFFFFF")
        .attr('stroke', "#ff3322")
        .attr('stroke-width', 0.6)
        .attr('class', 'storm-reports-large')
        .attr('opacity', 0.5)
        .attr('id', map+'_graphic')
        .attr('d', function(d) {
          injured = injured + parseInt( d.injuries );
          
          //TODO calculate cost
          var c = parseInt( d.damages.split('-')[ 0 ].replace( /\$/, '') );
          cost = ( isNaN( c ) ) ? cost : cost + c;
          
          //number of tors
          count++;
          
        })
        .attr('r', function(d) {
          var size = ( d.scale == undefined ) ? 0 : self.scales[d.scale];
          return size;
        })
        .on('mouseover', function(d) { 
          d3.select(this)
            .attr('d', self.hover( d, map ))
            .transition()
            .duration(400)
              .attr('opacity', 0.1)
              .attr('r', function() { 
                var size = ( d.scale == undefined ) ? 1 : self.scales[d.scale] + 14;
                return size; 
              })
            .transition()
            .duration(400)
              .attr('opacity', 0.5)
              .attr('r', function() { 
                var size = ( d.scale == undefined ) ? 1 : self.scales[d.scale];
                return size; 
              })
        });
          
      //Stats
      $( '.'+map+' .injured-by-tors .number' ).html( injured );
      $( '.'+map+' .number-of-tors .number' ).html( count );
      
      var reports = self[ map ].append('g');

      $('#tornado-count .count').html(rows.length);

      reports.selectAll("circle")
        .data(rows)
      .enter().insert("circle")
        .attr("transform", function(d) { return "translate(" + self.projection([d.longitude,d.latitude]) + ")";})
        .attr("fill", "#ff3322") //#ff3322
        .attr('class', 'storm-reports')
        .attr('id', map+'_graphic')
        .attr('r', 0.5);
      
     });
}

torApp.prototype.RemovePoints = function( map ) {
  $('.storm-reports').remove(); 
}

torApp.prototype.hover = function( d, map ) {
  app.exit();
  
  var x2 = app.projection([d.longitude,d.latitude])[0] + Math.floor(Math.random()*80) + 60;
  var y2 = app.projection([d.longitude,d.latitude])[1] + Math.floor(Math.random()*160) + 20;
  
  var line = app[ map ].append("svg:line")
    .attr('class', 'tip-line')
    .style("stroke", '#FFF')
    .attr("x1", app.projection([d.longitude,d.latitude])[0])
    .attr("y1", app.projection([d.longitude,d.latitude])[1])
    .attr("x2", app.projection([d.longitude,d.latitude])[0])
    .attr("y2", app.projection([d.longitude,d.latitude])[1])
    .transition()
      .duration(900)
      .attr("x2", x2)
      .attr("y2", y2);
    
  var info = '<div id="info-window"></div>';
  $('#'+map).append( info );
  
  var damages = ( d.damages ) ? d.damages : 'n/a'
  var content = '\
    <span>Date: '+ d.date + '</span><br />\
    <span>'+ d.county + ', '+d.state+'</span><br />\
    <span>Damages: '+ damages + '</span><br />'
     
  $('#info-window').html( content ).css({'left' : (x2) + 'px', 'top' : (y2) + 'px'}).delay(500).fadeIn(1000);
  
  app[ map ].selectAll("path").attr("d", app.path);
  
}

  
torApp.prototype.exit = function() {
  d3.selectAll('.hover')
    .transition()
      .style("fill-opacity", 0)
      .duration(2000)
      .remove();
  d3.selectAll('.tip-line')
    .transition()
      .style("stroke-opacity", 0)
      .duration(900)
      .remove();
  $('#info-window').fadeOut(600);
  $('#info-window').remove();
}

torApp.prototype.ortho = function() {
  var self = this, 
    h = 1000,
    w = document.width;
  
  var options = [
    {name: "Orthographic", projection: d3.geo.orthographic()},
    {name: "Albers", projection: d3.geo.albers().scale(700).center([20, 33]).translate([w / 2, h / 2])}
  ];
  
  var p = options[0];
  var proj = options[1];
  
  d3.selectAll("path").transition()
      .duration(750)
      .attrTween("d", self.projectionTween(proj.projection, projection = p.projection ));
  /*
  d3.selectAll('.storm-reports-large')
    .transition()
    .duration(900)
    .attr("transform", function(d) { return "translate(" + self.projection([d.longitude,d.latitude]) + ")";})
    .attr('r', function(d) {
        var size = ( d.scale == undefined ) ? 0 : self.scales[d.scale] / 2;
        return size;
    });
    
    d3.selectAll('.storm-reports')
      .transition()
      .duration(900)
      .attr("transform", function(d) { return "translate(" + self.projection([d.longitude,d.latitude]) + ")";});
    */
  $('.world').css('fill', '#333');
}

torApp.prototype.projectionTween = function(projection0, projection1) {
  return function(d) {
    var t = 0;
    var height = 1000;
    var width = document.width;

    var projection = d3.geo.projection(project)
        .scale(1)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    function project(λ, φ) {
      λ *= 180 / Math.PI, φ *= 180 / Math.PI;
      var p0 = projection0([λ, φ]), p1 = projection1([λ, φ]);
      return [(1 - t) * p0[0] + t * p1[0], (1 - t) * -p0[1] + t * -p1[1]];
    }

    return function(_) {
      t = _;
      return path(d);
    };
  };
}

