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
  $('.maps').css( { 'width': $(window).width()+'px', 'height': height+40+'px'});
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
  
  $('#header').on('mouseout', function() {
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
  
  var scrollorama = $.scrollorama({
    blocks:'.scrollblock',
    enablePin:false
  });
  
  var height = $(window).height();
  var width = $(window).width();
  /*
   * Section one
   */
  //scrollorama.animate('#map_one',{ duration: 100, property:'display', start:"none",end: "block" });
  //scrollorama.animate('#content-one',{ duration: 800, property:'opacity', start:0,end:1 });
  
  /*
   * Section two
   */
  scrollorama.animate('#section-two',{ duration: 300, property:'opacity', start:0,end:1 });
  //scrollorama.animate('#blurb-two',{ duration: 500, property:'top', start: 0 - height,end: 0 });
  
  /*
   * Section three
   * 
   */
  //scrollorama.animate('#section-three',{ duration: height, property:'top', start:-height,end:0 });
  //scrollorama.animate('#joplin-image',{ duration: 600, property:'margin-left', start:345,end:0 });
  
  /*
   * 
   * Section four
   * 
   */
  scrollorama.animate('#section-four',{ duration: height, property:'top', start:0,end:0 });
  
  
  /*
   * Section SIX
   * 
   */
  //scrollorama.animate('#blurb-six',{ duration: 300, property:'padding-top', start:600,end:0, pin: true });
  
  /*
   * 
   * Section SEVEN
   * 
   */
  scrollorama.animate('#seven-image-1',{ delay: 100, duration: 500, property:'top', start:-height,end:190 });
  scrollorama.animate('#seven-image-1',{ delay: 100, duration: 500, property:'left', start:width,end:-50 });
  
  scrollorama.animate('#seven-image-2',{ delay: 100, duration: 500, property:'top', start:-500,end:200 });
  scrollorama.animate('#seven-image-2',{ delay: 100, duration: 500, property:'left', start:-800,end:120 });
  
  scrollorama.animate('#seven-image-3',{ delay: 150, duration: 500, property:'top', start:height,end:325 });
  scrollorama.animate('#seven-image-3',{ delay: 150, duration: 500, property:'left', start:-930,end:-135 });
  
  scrollorama.animate('#seven-image-4',{ delay: 150, duration: 500, property:'top', start:-800,end:390 });
  scrollorama.animate('#seven-image-4',{ delay: 150, duration: 500, property:'left', start:400,end:153 });
  
  /*
   * 
   * Section EIGHT
   * 
   */
  scrollorama.animate('#eight-info',{ delay: 250, duration: 500, property:'line-height', start:0,end:2.7 });
  
  /*
   * Footer
   * 
   */
  scrollorama.animate('#footer',{ duration: 100, property:'height', start:0,end:160 });
  
}
 
torApp.prototype.scrollControls = function() {
  var self = this,
    h = $(window).height() + 20, //1000
    w = document.width,
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
  
  $window = $(window);
    var $bg = $('#home');
    var $wbg = $('#intro-map-window .inner.wbg');
    
    $(window).scroll(function(e) {
      if ( $('body').hasClass('no-scroll') ) return;
      
      var pos = $(window).scrollTop(); //position of the scrollbar
      if ( !this.prev_pos ) this.prev_pos = pos;
      
      //fadeout introduction
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
      self.playVideo( id )  
      self.LoadPoints( id );
      $(this).addClass('viewed');
    });
    
    $('.about').on('disappear', function() {
      $(this).removeClass('viewed');
      var id = $(this).attr('id');
      self.stopVideo( id );
    });
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
    w = document.width,
    min = 40,
    max = 95,
    m = 0;
  
  //Map Obj
  this.maps = {
    "map_one" : { 
      "id": "map_one", 
      "projection" : d3.geo.albers().scale(1700).center([17, 33]).clipAngle(90).translate([w / 2, h / 2]), 
      "dataset" : 'data/may-24-26-2011.csv' 
    },
    "map_two" : {
      "id": "map_two", 
      "projection" : d3.geo.mercator().scale(2500).center([-95, 33]).translate([w / 2, h / 2]).precision(.1),
      "dataset" : 'data/feb-5-6-2008.csv'
    },
    "map_three" : {
      "id": "map_three", 
      "projection" : d3.geo.mercator().scale(2500).center([-90, 39]).translate([w / 2, h / 2]).precision(.1),
      "dataset" : 'data/may-22-2011.csv'
    },
    "map_four" : {
      "id": "map_four", 
      "projection" : d3.geo.albers().scale(3500).center([6, 36]).translate([w / 2, h / 2]), 
      "dataset" : 'data/may-3-1999.csv' 
    },
    "map_five" : {  
      "id": "map_five", 
      "projection" : d3.geo.albers().scale(1700).center([20, 33]).clipAngle(90).translate([w / 2, h / 2]), 
      "dataset" : 'data/nov-21-23-1992.csv'
    } ,
    "map_six" : { 
      "id": "map_six", 
      "projection" : d3.geo.albers().scale(2100).center([5, 33]).clipAngle(90).translate([w / 2, h / 2]), 
      "dataset" : 'data/apr-11-12-1965.csv'
    },
    "map_seven" : { 
      "id": "map_seven", 
      "projection" : d3.geo.albers().scale(1700).center([20, 33]).clipAngle(90).translate([w / 2, h / 2]), 
      "dataset" : "data/apr-3-4-1974.csv"   
    },
    "map_eight" : { 
      "id": "map_eight", 
      "projection" : d3.geo.albers().scale(1700).center([20, 33]).clipAngle(90).translate([w / 2, h / 2]),
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
    console.log('world', world)
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
    .attr("fill", "rgb(230, 85, 13)")
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
    w = document.width;
  
  if ( $('#'+map+'_graphic').length ) return;
  
  
  d3.csv( this.maps[ map ].dataset )
    .row(function(d) { return { date: d.Date, scale: d.Fujita, county: d.County1,
      state: d.State1, latitude: d.TouchdownLat, longitude: d.TouchdownLon, damages: d.Damage,
      endLat: d.LiftoffLat, endLon: d.LiftoffLon, injuries: d.Injuries, fatalities: d.Fatalities}; })
    .get(function(error, rows) {
      var injured = 0;
      var cost = 0;
      var count = 0;
      
      $('#tornado-count .count').html(rows.length);
      var projection = self.maps[ map ].projection;
      
      
      var reports = self[ map ].append('g');
      
      reports.selectAll("circle")
        .data(rows)
      .enter().insert("circle")
        .attr("transform", function(d) { return "translate(" + projection([d.longitude,d.latitude]) + ")";})
        .attr('fill', "rgb(230, 85, 13)")
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
        .delay(function( d, i ) { return Math.floor((Math.random()*1000)); })
        .duration(1100)
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
            count++;
          })
          .attr('r', function(d) {
            var size = ( d.scale == undefined ) ? 0 : self.scales[d.scale];
            return size - 2;
          });
        
        //Stats
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
  
  if (d.endLat != "-") {
    var lines = self[ map ].append('g');
    var projection = self.maps[ map ].projection;
    
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
