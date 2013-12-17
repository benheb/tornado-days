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
  
  //setup UI
  $('.maps').css( { 'width': $(window).width()+'px', 'height': height+100+'px'});
  $('.about').css('height', height+40+'px');
  $('.map-blurb').css('height', height+ 40 + 'px');
  $('#home').css('height', height+'px');
  $('#intro-map').css( { 'width': $(window).width()+'px', 'height': $(window).height() + 100+'px' } );
  
  //show hide header 
  $('#header').on('mouseover', function() {
    $('#header-inner').slideDown('fast', function() {
      $('#credit').show();
    });
  });
  
  $('.scrollblock').on('mouseover', function() {
    $('#credit').hide();
    $('#header-inner').slideUp('fast');
  });
  
  app = new torApp();
}); 

var torApp = function() {
  this.intro();
  this.createMap();
  this.addLand();
  this.scrollControls();
  this.updateLegend();
  this.scrollSetup();
}
 
torApp.prototype.scrollControls = function() {
  var self = this,
    h = $(window).height() + 20, //1000
    w = $(document).width(),
    min = 40,
    max = 95,
    m = 0;
  
  //window resize 
  $(window).on('resize', function() {
    var h = $(window).height();
    var w = $(window).width();
    
    $('.about').css('height', h + 100 +'px');
    $('#home').css('height', h+'px');
    $('#intro-map').css( { 'width': w+'px', 'height': h + 100+'px' } );
    self.intro_svg.attr('width', w ).attr('height', h + 100);
  });
  
  //map controls
  $('#map-controls').css('top', h-55+'px');
  $('#toggle-paths').on('click', function() {
    self.drawLines( null, self.active );
  });
  $('#next-section').on('click', function() {
    var height = $(window).height() + 51;
    var top = $(window).scrollTop();
    var active = self.active;
    var sections = { "map_one": 2, "map_two": 3, "map_three": 4, "map_four": 5, "map_five": 6, "map_six": 7, "map_seven": 8, "map_eight": 8 }
    $('body,html').animate({scrollTop: ( height ) * sections[ active ] }, 2000); 
  });
  
  
  $window = $(window);
    var $bg = $('#home');
    var $wbg = $('#intro-map-window .inner.wbg');
    
    $(window).scroll(function(e) {
      if ( $('body').hasClass('no-scroll') ) return;
      
      var pos = $(window).scrollTop(); //position of the scrollbar
      if ( !this.prev_pos ) this.prev_pos = pos;
      
      //fadeout introduction
      if ( pos > 10 ) {
        setTimeout( function() { $('#map-controls').fadeIn(); },300);
        $('#intro-map').fadeOut();
        $('#intro-map-window-one').fadeOut();
        $('#intro-map-window-two').show();
        $('#scroll-tip-container').hide();
      } else {
        $('#map-controls').hide();
        $('#intro-map-window-two').hide();
        $('#intro-map').fadeIn();
        $('#intro-map-window-one').show();
        $('#scroll-tip-container').show();
      }
      
      //Scroll to top - bounce the intro tors!
      if ( pos < 3 && this.prev_pos > 3 ) {
        self.intro_svg.selectAll(".intro-tors")
          .transition()
          .duration(1000)
          .attr("transform", function(d) {
            var random = Math.floor((Math.random()*20)+1);
            var lat = (parseFloat(d.latitude) + random);
            return "translate(" + self.intro_projection([d.longitude,lat]) + ")";
          })
          .transition()
          .duration(1000)
          .delay(function( d, i ) { return Math.floor((Math.random()*700)+50); })
          .ease('bounce') //elastic // bounce
          .attr("transform", function(d) {
            return "translate(" + self.intro_projection([d.longitude,d.latitude]) + ")";
          });
          
          $('.about').removeClass('viewed');
          self.RemovePoints();
      }
      
      //HUGE FIX FOR CHROME FIXED POSITION BG IMAGES
      if ( pos < 10 ) {
        $('.intro-diddy').css('position','absolute');
      } else if ( pos > h ) {
        $('.intro-diddy').css('position','relative');
      } else {
        $('.intro-diddy').css('position','fixed');
      }
      
      this.prev_pos = pos;
      
      clearTimeout($.data(this, "scrollTimer"));
      $.data(this, "scrollTimer", setTimeout(function() {
          // do something
         $('.maps').css( {'pointer-events': 'auto' });
      }, 1200));
      
      var yPos = -($window.scrollTop() / $bg.data('speed'));
      var coords = '50% '+ yPos + 'px';
      
      
      if ( $($bg).hasClass('map_two') ) {
      } else {
        $bg.css({ backgroundPosition: coords });
      }
      
    });
    
    //Detect when sections appear 
    $('.about').appear();
    $('.about').on('appear', function() {
      var id = $(this).children('.maps').attr('id');
      
      //set current visible section
      self.active = id;
      self.playVideo( id );  
      self.LoadPoints( id );
      $(this).addClass('viewed');
    });
    
    $('.about').on('disappear', function() {
      $(this).removeClass('viewed');
      var id = $(this).attr('id');
      self.stopVideo( id );
    });
    
    //scroll helper 
    $('.pendulum').on('mouseover', function() {
      $('#scroll-helper').fadeIn('slow');
    }).on('mouseout', function() {
      $('#scroll-helper').fadeOut('slow');
    });
    
    //outro height
    $('#outro').css('height', h - 150 + 'px');
    
}

/*
 * Setup all the maps
 *    Define map properties ( projections, scale, dataset )
 *    Append SVG for each map to related element
 * 
 */

torApp.prototype.createMap = function() {
  var self = this,
    h = 1000,
    w = $(document).width(),
    min = 40,
    max = 95,
    m = 0;
  
  var scale = w / 4;
  //Map Obj
  this.maps = {
    "map_one" : { 
      "id": "map_one", 
      "projection" : d3.geo.albers().scale( w * 1.4 ).center([17, 33]).clipAngle(90).translate([w / 2, h / 2]), 
      "dataset" : 'data/may-24-26-2011.csv' 
    },
    "map_two" : {
      "id": "map_two", 
      "projection" : d3.geo.mercator().scale( w * 2.2 ).center([-95, 33]).translate([w / 2, h / 2]).precision(.1),
      "dataset" : 'data/feb-5-6-2008.csv'
    },
    "map_three" : {
      "id": "map_three", 
      "projection" : d3.geo.mercator().scale( w * 2.2 ).center([-90, 39]).translate([w / 2, h / 2]).precision(.1),
      "dataset" : 'data/may-22-2011.csv'
    },
    "map_four" : {
      "id": "map_four", 
      "projection" : d3.geo.albers().scale( w * 2.9 ).center([6, 34]).translate([w / 2, h / 2]), 
      "dataset" : 'data/may-3-1999.csv' 
    },
    "map_five" : {  
      "id": "map_five", 
      "projection" : d3.geo.albers().scale( w * 1.4 ).center([20, 33]).translate([w / 2, h / 2]), 
      "dataset" : 'data/nov-21-23-1992.csv'
    } ,
    "map_six" : { 
      "id": "map_six", 
      "projection" : d3.geo.orthographic().scale( w * 1.5 ).translate([w / 2, h / 2]).clipAngle(90).rotate([96, -33]).precision(.1), 
      "dataset" : 'data/apr-11-12-1965.csv'
    },
    "map_seven" : { 
      "id": "map_seven", 
      "projection" : d3.geo.albers().scale( w * 1.5 ).center([20, 32]).translate([w / 2, h / 2]), 
      "dataset" : "data/apr-3-4-1974.csv"   
    },
    "map_eight" : { 
      "id": "map_eight", 
      "projection" : d3.geo.albers().scale( w * 1.4 ).center([20, 31]).translate([w / 2, h / 2]),
      "dataset" : "data/apr-26-27-28-2011.csv"
    }
      
  }
  
  this.projection = d3.geo.albers().scale(1700).center([20, 33]).clipAngle(90).translate([w / 2, h / 2]);

  this.path = d3.geo.path()
    .projection( this.projection );
    
  //Create Map SVGs
  var maps = [ "map_one", "map_two", "map_three", "map_four", "map_five", "map_six", "map_seven", "map_eight" ];
  $.each( this.maps, function( i, map) {
    var id = map.id;
    self[ id ] = d3.select("#"+ id).append("svg");
  });
  
  //Master Legend
  this.legend = d3.select('#legend').append( "svg" );
  
  //For sizing of tornado points by Fujita scale
  this.scales = {
     0: 3,
     1: 5,
     2: 7,
     3: 11,
     4: 14,
     5: 19
  }
  
}

/*
 * 
 * Add state boundaries for each map
 *    Set unique styling by map id
 * 
 * 
 */
torApp.prototype.addLand = function () {
  var self = this;
  
  d3.json("data/usa-detail.json", function(error, world) {
    //console.log('world', world)
    $.each( self.maps, function(i, map) {
      
      var projection = map[ "projection"];
      var path = d3.geo.path().projection( map[ "projection"] );
      var id = map.id;
    
      /*
       * A mess of logic to draw maps differently... 
       * 
       */
     
      if ( id !== 'map_two' && id !== 'map_three' && id !== "map_four" ) {
        self[ id ].append("g")
          .attr("class", "states")
          .selectAll("path")
            .data(topojson.feature(world, world.objects[ "usa-states" ]).features)
          .enter().append("path")
            .attr('class', 'states')
            .attr('id', map+'_states')
            .attr("d", function( d ) {
              self.addLabel( d, id );
            })
            .attr("d", path);
            
            
        self[ id ].insert("path")
          .datum(topojson.feature(world, world.objects.ne_50m_lakes))
          .attr('class', 'lakes')
          .attr("d", path);
      
      } else if ( id === "map_two" ) {
        self[ id ].append("g")
          .attr("class", "states")
        .selectAll("path")
          .data(topojson.feature(world, world.objects[ "usa-states" ]).features)
        .enter().append("path")
          .attr('id', function(d) { return d.id })
          .attr("class", function(d) {
            if ( d.properties.NAME === "Texas" || d.properties.NAME === "Kentucky" || d.properties.NAME === "Louisiana" || d.properties.NAME === "Arkansas"
              || d.properties.NAME === "Tennessee" || d.properties.NAME === "Alabama" || d.properties.NAME === "Mississippi" || d.properties.NAME === "Missouri" || d.properties.NAME === "Indiana" 
              || d.properties.NAME === "Illinois") {
              self.addLabel( d, id );
              return "states-partial";
            } else {
              return "states-hidden";
            }
          })
          .attr("d", path);
      } else if ( id === "map_three" ) {
        self[ id ].append("g")
          .attr("class", "states")
        .selectAll("path")
          .data(topojson.feature(world, world.objects[ "usa-states" ]).features)
        .enter().append("path")
          .attr('id', function(d) { return d.id })
          .attr("class", function(d) {
            if ( d.properties.NAME  === "Oklahoma" || d.properties.NAME === "Kansas" || d.properties.NAME === "Iowa"
              || d.properties.NAME === "Wisconsin" || d.properties.NAME === "Minnesota" || d.properties.NAME === "Missouri" || d.properties.NAME === "Indiana" 
              || d.properties.NAME === "Illinois") {
              self.addLabel( d, id );
              return "states-partial";
            } else {
              return "states-hidden";
            }
          })
          .attr("d", path);
      } else if ( id === "map_four" ) {
        self[ id ].append("g")
          .attr("class", "states")
        .selectAll("path")
          .data(topojson.feature(world, world.objects[ "usa-states" ]).features)
        .enter().append("path")
          .attr('id', function(d) { return d.id })
          .attr("class", function(d) {
            //31 21 40
            if ( d.properties.NAME === "Texas" || d.properties.NAME  === "Oklahoma" || d.properties.NAME === "Kansas" || d.properties.NAME === "Nebraska" ) {
              self.addLabel( d, id );
              return "states-partial";
            } else {
              return "states-faded";
            }
          })
          .attr("d", path);
      }
    });
  });
}



/*
 * Adds state label to visible states 
 * 
 */
torApp.prototype.addLabel = function( d, id ) {
  
  var projection = this.maps[ id ][ "projection"];
  var path = d3.geo.path().projection( this.maps[ id ][ "projection"] );
  
  this[ id ].append("text")
    .attr("class", "subunit-label")
    .attr("transform", function() {
      return "translate(" + path.centroid(d) + ")"; 
    })
    .attr("dy", ".35em")
    .text(function() { return d.properties.NAME; });
    
  this[ id ].selectAll(".place-label")
    .attr("x", function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
    .style("text-anchor", function(d) { return d.geometry.coordinates[0] > -1 ? "start" : "end"; });
}



/*
 * Sets legend in app header
 * 
 */
torApp.prototype.updateLegend = function() {
  var self = this;
  var dots = this.legend.append('g');
  var legend = [ 
    { radius: 3, x: 5, y: 20 }, 
    { radius: 5, x: 50, y: 20 }, 
    { radius: 7, x: 100, y: 20 }, 
    { radius: 10, x: 160, y: 20 }, 
    { radius: 14, x: 230, y: 20 },
    { radius: 19, x: 300, y: 20 } 
  ];
  
  dots.selectAll("circle")
    .data( legend )
  .enter().insert("circle")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")";})
    .attr("fill", "rgb(39, 127, 238)")
    .attr('stroke', "rgb(254, 230, 206)")
    .attr('stroke-width', 0.8)
    .attr('opacity', 0.8)
    .attr('class', 'legend-dots')
    .attr('r', function(d) { return d.radius });
  
}



/*
 *  Add tornadoes to map - requires map ID 
 * 
 */
torApp.prototype.LoadPoints = function( map ) {
  var self = this, 
    h = 1000,
    w = $(document).width();
  
  if ( $('#'+map+'_graphic').length ) return;
  
  
  d3.csv( this.maps[ map ].dataset )
    .row(function(d) { return { date: d.Date, scale: d.Fujita, county: d.County1,
      state: d.State1, latitude: d.TouchdownLat, longitude: d.TouchdownLon, damages: d.Damage,
      endLat: d.LiftoffLat, endLon: d.LiftoffLon, injuries: d.Injuries, fatalities: d.Fatalities}; })
    .get(function(error, rows) {
      var injured = 0;
      var fatalities = 0;
      var cost = 0;
      var count = 0;
      
      $('#tornado-count .count').html(rows.length);
      var projection = self.maps[ map ].projection;
      
      
      var reports = self[ map ].append('g');
      
      reports.selectAll("circle")
        .data(rows)
      .enter().insert("circle")
        .attr("transform", function(d) {
          var random;
          if ( map === "map_eight" ) {
            random = Math.floor(Math.random()*200) + 1;
            random *= Math.floor(Math.random()*2) == 1 ? 1 : -1; 
          } else {
            random = 0;
          }
          var lat = (parseFloat(d.latitude) + random);
          var lon = (parseFloat(d.longitude) + random);
          return "translate(" + projection([ lon ,lat ]) + ")";
        })
        //.attr('fill', "rgb(230, 85, 13)")
        .attr('fill', 'rgb(39, 127, 238)')
        .attr('stroke', 'rgb(254, 230, 206)')
        .attr('radius', 0)
        .attr('opacity', 0)
        .attr('class', 'storm-reports')
        .attr('id', map+'_graphic')
        .on('mouseover', function(d) { 
          window.clearTimeout(self.infoTimeout);
          
          d3.select(this)
            .attr('d', self.hover( d, map ))
            .transition()
            .duration(400)
              .attr('opacity', 0.1)
              .attr('r', function() { 
                var size = ( d.scale == undefined ) ? 0 : self.scales[d.scale] + 14;
                return size - 2; 
              })
            .transition()
            .duration(400)
              .attr('opacity', 0.8)
              .attr('r', function() { 
                var size = ( d.scale == undefined ) ? 0 : self.scales[d.scale];
                return size - 2; 
              });
              
        })
        .on('mouseout', function() {
          
          self.infoTimeout = window.setTimeout(function() {
            $('#info-window').fadeOut();
            d3.selectAll('.tor-path').remove(); 
          },1500);
          
        })
        .transition()
        .delay(function( d, i ) { return Math.floor((Math.random()*1200)); })
        .duration(1000)
          .attr('stroke-width', function(d) {
            if ( ( d.county === "Newton" && parseFloat(d.scale) === 5 ) || ( 
                    d.county === "Grady" && parseFloat(d.scale) === 5 ) ) {
              return 3
            } else {
              return 0.9;
            }
          })
          .attr('opacity', 0.8)
          .attr('d', function(d) {
            injured = injured + parseInt( d.injuries );
            //fatalities = fatalities + parseInt( d.fatalities );
            count++;
          })
          .attr('r', function(d) {
            var size = ( d.scale == undefined ) ? 0 : self.scales[d.scale];
            return size - 2;
          })
        .transition()
        .duration(4100)
          .attr("transform", function(d) {
            return "translate(" + projection([d.longitude,d.latitude]) + ")";
          });
        
        //Stats
        //var i = 0;
        //var injint = setInterval(function() {
        //  i++;
        //  $( '.'+map+' .injured-by-tors .number' ).html( i );
        //  if ( i >= injured ) clearInterval( injint );
        //}, 0.1);
        
        //var j = 0;
        //var countint = setInterval(function() {
        //  j++;
        //  $( '.'+map+' .number-of-tors .number' ).html( j );
        //  if ( j >= count ) clearInterval( countint );
        //}, 0.1);
        //console.log('injured', injured)
        //console.log('killed', fatalities)
        
        $( '.'+map+' .injured-by-tors .number' ).html( injured );
        $( '.'+map+' .number-of-tors .number' ).html( count );
        
      });
}



/*
 * Draws tornado paths if they exist
 * 
 */
torApp.prototype.drawLines = function( d, map ) {
  var self = this;
  
  d3.selectAll('.tor-path').remove();
  var lines = self[ map ].append('g');
  var projection = self.maps[ map ].projection;
  
  if ( d ) {
    if (d.endLat != "-") {
      
      lines.selectAll("line")
        .data([d])
      .enter().append('line')
        .style("stroke", 'rgb(254, 230, 206)')
        .style('stroke-width', 1.3)
        .attr('class', 'tor-path tornado-paths-'+map)
        .attr("x1", projection([d.longitude,d.latitude])[0])
        .attr("y1", projection([d.longitude,d.latitude])[1])
        .attr("x2", projection([d.longitude,d.latitude])[0])
        .attr("y2", projection([d.longitude,d.latitude])[1])
        .transition()
          .duration(2000)
          .attr("x2", projection([d.endLon,d.endLat])[0])
          .attr("y2", projection([d.endLon,d.endLat])[1]);
          
    }
  } else {
    d3.csv( this.maps[ map ].dataset )
    .row(function(d) { return { date: d.Date, scale: d.Fujita, county: d.County1,
      state: d.State1, latitude: d.TouchdownLat, longitude: d.TouchdownLon, damages: d.Damage,
      endLat: d.LiftoffLat, endLon: d.LiftoffLon, injuries: d.Injuries, fatalities: d.Fatalities}; })
    .get(function(error, rows) {
      
    lines.selectAll("line")
      .data( rows )
    .enter().insert("line")
      .style("stroke", 'rgb(254, 230, 206)')
      .style('stroke-width', 1.3)
      .attr('class', 'tor-path tornado-paths-'+map)
      .attr("x1", function(d) { if (d.endLat != "-") return projection([d.longitude,d.latitude])[0] })
      .attr("y1", function(d) { if (d.endLat != "-") return projection([d.longitude,d.latitude])[1] })
      .attr("x2", function(d) { if (d.endLat != "-") return projection([d.longitude,d.latitude])[0] })
      .attr("y2", function(d) { if (d.endLat != "-") return projection([d.longitude,d.latitude])[1] })
      .transition()
        .duration(2000)
        .attr("x2", function(d) { if (d.endLat != "-") return projection([d.endLon,d.endLat])[0] })
        .attr("y2", function(d) { if (d.endLat != "-") return projection([d.endLon,d.endLat])[1] });
        
    });
  }    
}


torApp.prototype.RemovePoints = function( map ) {
  $('.storm-reports').remove(); 
}


/*
 * Map hover and exit 
 * 
 */
torApp.prototype.hover = function( d, map ) {
  this.exit();
  this.drawLines(d, map);
  
  var x2 = this.maps[ map ].projection([d.longitude,d.latitude])[0] - 84;
  var y2 = this.maps[ map ].projection([d.longitude,d.latitude])[1] - 145;
    
  var info = '<div id="info-window"></div>';
  $('#'+map).append( info );
  
  var damages = ( d.damages ) ? d.damages : 'n/a'
  var content = '\
    <span>Rating: '+ d.scale + '</span><br />\
    <span>Injuries: '+ d.injuries + '</span><br />\
    <span>Fatalities: '+ d.fatalities + '</span><br />\
    <span>Date: '+ d.date + '</span><br />\
    <span>'+ d.county + ', '+d.state+'</span><br />\
    <span>Damages: '+ damages + '</span><br />'
     
  $('#info-window').html( content ).css({'left' : (x2) + 'px', 'top' : (y2) + 'px'}).delay(500).fadeIn(1000);
  
  
  var m = this.maps[ map ];
  var path = d3.geo.path().projection( m[ "projection"] );
  app[ m.id ].selectAll("path").attr("d", path);
  
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


/*
 * HTML5 Video Controls
 * 
 * 
 */
torApp.prototype.playVideo = function( id ) {
  var self = this;
  var val = id.replace(/map_/g, '');

  //$('.content-container.'+id).fadeIn('slow');
  
  var canvas = document.getElementById('video-'+val+'-canvas');
  if ( !canvas ) return; 
  var ctx    = canvas.getContext('2d');
  var video  = document.getElementById('video-'+val);
  
  video.addEventListener('play', function () {
    var $this = this; //cache
    var ratio = video.videoWidth / video.videoHeight;
    var w = video.videoWidth - 50;
    var h = parseInt(w / ratio, 10);
    canvas.width = w;
    canvas.height = h;
    ctx.width = w;
    ctx.height = h;
    
    (function loop() {
        if (!$this.paused && !$this.ended) {
            ctx.drawImage($this, 10, 10);
            setTimeout(loop, 1000 / 60); // drawing at 30fps
        }
    })();
  }, 0);
    
  video.play();
  video.volume = 0.2  
}

torApp.prototype.stopVideo = function( id ) {
  if (!id) return;
  var val = id.replace(/section-/g, '');
  var video  = document.getElementById('video-'+val);
  
  if ( !video ) return;
  video.pause();
  
}
