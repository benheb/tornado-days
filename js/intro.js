torApp.prototype.intro = function() {
  var self = this;
  
  this.can_scroll = false;
  
  var width = $(window).width(),
      height = $(window).height();
  
  $('#intro-map').css( { 'width': width+'px', 'height': height+'px' } );
  
  var projection = interpolatedProjection(
      d3.geo.orthographic()
          .rotate([10, -10])
          .center([-10, 10])
          .scale(300)
          //.clipAngle(90)
          .translate([width / 2, height / 2]),
      d3.geo.equirectangular()
          .scale(245)
          .translate([width / 2, height / 2]));
  
  var path = d3.geo.path()
      .projection(projection);
  
  var graticule = d3.geo.graticule();
  
  var svg = d3.select("#intro-map").append("svg")
      .attr("width", width)
      .attr("height", height);
  
  svg.append("path")
      .datum({type: "Sphere"})
      .attr("class", "sphere")
      .attr("d", path);
  
  svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);
  
  d3.json("data/world.json", function(error, world) {
    console.log('ob', world)
    svg.insert("path", ".graticule")
        .datum(topojson.feature(world, world.objects.world))
        .attr("class", "intro-land")
        .attr("d", path);
  });
  
  animation();
  
  function animation() {
    svg.transition()
        .duration(7500)
        .tween("projection", function() {
          return function(_) {
            projection.alpha(_);
            svg.selectAll('path').attr('d', path)
          };
        })
        .each("end", addPoints);
  }
  
  function interpolatedProjection(a, b) {
    var projection = d3.geo.projection(raw).scale(1),
        center = projection.center,
        translate = projection.translate,
        //clip = projection.clipAngle,
        α;
  
    function raw(λ, φ) {
      var pa = a([λ *= 180 / Math.PI, φ *= 180 / Math.PI]), pb = b([λ, φ]);
      return [(1 - α) * pa[0] + α * pb[0], (α - 1) * pa[1] - α * pb[1]];
    }
  
    projection.alpha = function(_) {
      if (!arguments.length) return α;
      α = +_;
      var ca = a.center(), cb = b.center(),
          ta = a.translate(), tb = b.translate();
      center([(1 - α) * ca[0] + α * cb[0], (1 - α) * ca[1] + α * cb[1]]);
      translate([(1 - α) * ta[0] + α * tb[0], (1 - α) * ta[1] + α * tb[1]]);
      //clip(90)
      return projection;
    };
  
    delete projection.scale;
    delete projection.translate;
    delete projection.center;
    return projection.alpha(0);
  }
  
  function addPoints() {
    self.createMap();
    var scales = {
       0: 1,
       1: 1,
       2: 1.5,
       3: 2,
       4: 3,
       5: 4
    }
    d3.csv( 'data/apr-26-27-28-2011.csv' )
    .row(function(d) { return { date: d.Date, scale: d.Fujita, county: d.County1,
      state: d.State1, latitude: d.TouchdownLat, longitude: d.TouchdownLon, damages: d.Damage, injuries: d.Injuries, fatalities: d.Fatalities}; })
    .get(function(error, rows) {
      var injured = 0;
      var cost = 0;
      var count = 0;
      
      var introTors = svg.append('g');

      var dur;
      introTors.selectAll("circle")
        .data(rows)
      .enter().insert("circle")
        .attr("transform", function(d) {
          var random = Math.floor((Math.random()*100)+1);
          dur = Math.floor((Math.random()*6000)+1);
          
          var lat = (parseFloat(d.latitude) + random);
          return "translate(" + projection([d.longitude,lat]) + ")";
        })
        .attr("fill", "#FFFFFF")
        .attr('stroke', "#ff3322")
        .attr('stroke-width', 0.5)
        .attr('opacity', 0)
        .attr('r', function(d) { 
          var size = ( d.scale == undefined ) ? 1 : scales[d.scale] + 2;
          return size; 
        })
        .transition()
          //.delay(function( d, i ) { return dur })
          //.duration( dur )
          .duration(3000)
          .attr("transform", function(d) {
            return "translate(" + projection([d.longitude,d.latitude]) + ")";
          })
          .attr('opacity', 0.5)
       
        drawLines();
        
                 
     });
     
   }
   
   function drawLines( cnt ) {
     if (!cnt) var cnt = 0;
     
     var lines = [
          [
            { x1: document.width / 2, y1: 0},
            { x2: document.width / 2, y2: 291}
          ],
          [
            { x1: document.width / 2, y1: 291},
            { x2: (document.width / 2) + 436, y2: 291}
          ],
          [
            { x1: (document.width / 2) + 436, y1: 291},
            { x2: (document.width / 2) + 436, y2: 481}
          ],
          [
            { x1: (document.width / 2) + 436, y1: 481},
            { x2: (document.width / 2) - 435, y2: 481}
          ],
          [
            { x1: (document.width / 2) - 435, y1: 481},
            { x2: (document.width / 2) - 435, y2: 291}
          ],
          [
            { x1: (document.width / 2) - 435, y1: 291},
            { x2: (document.width / 2), y2: 291}
          ]
          
           
        ];
        
        if ( cnt >= lines.length ) {
          showWindow();
          return;
        };
        
        var line = svg.append("line")
          .attr("stroke", '#444')
          .attr('stroke-width', 2)
          .attr("x1", lines[ cnt ][ 0 ].x1)
          .attr("y1", lines[ cnt ][ 0 ].y1)
          .attr("x2", lines[ cnt ][ 0 ].x1)
          .attr("y2", lines[ cnt ][ 0 ].y1)
          .transition()
          .duration(500)
            .attr("x2", lines[ cnt ][ 1 ].x2)
            .attr("y2", lines[ cnt ][ 1 ].y2)
            .each('end', function() {
              cnt++;
              drawLines( cnt )
            });
   }
   
   function showWindow() {
     self.can_scroll = true;
     $('#intro-map-window').fadeIn();
      setTimeout(function() {
        //$('#intro-map').fadeOut('slow', function() {
        //  $('#intro-map-window .inner').css('background', 'none');  
        //});
          
      }, 2000);
   }
}