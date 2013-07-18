/*
 * Loads of CSS magic for app
 * 
 */

torApp.prototype.scrollSetup = function() {
  var scrollorama = $.scrollorama({
    blocks:'.scrollblock',
    enablePin:false
  });
  
  var height = $(window).height();
  var width = $(window).width();
  /*
   * Section one
   */
  scrollorama.animate('#map_one_title',{ delay: 100, duration: 500, property:'left', start:-600,end:-4 });
  //scrollorama.animate('#content-one',{ duration: 800, property:'opacity', start:0,end:1 });
  
  /*
   * Section two
   */
  scrollorama.animate('#section-two',{ duration: 300, property:'opacity', start:0,end:1 });
  scrollorama.animate('#map_two_title',{ delay: 150, duration: 500, property:'right', start:-600,end:-2 });
  
  /*
   * Section three
   * 
   */
  scrollorama.animate('#map_three_title',{ delay: 150, duration: 500, property:'left', start:-500,end:-2 });
  //scrollorama.animate('#section-three',{ duration: height, property:'top', start:-height,end:0 });
  scrollorama.animate('#joplin-about',{ delay: 650, duration: 100, property:'height', start:0,end:385 });
  
  /*
   * 
   * Section four
   * 
   */
  scrollorama.animate('#section-four',{ duration: height, property:'top', start:0,end:0 });
  scrollorama.animate('#map_four_title',{ delay: 150, duration: 500, property:'left', start:-500,end:-2 });
  
  /*
   * 
   * Section FIVE
   * 
   * 
   */
  scrollorama.animate('#map_five_title',{ delay: 100, duration: 500, property:'left', start:-600,end:-4 });
  
  /*
   * Section SIX
   * 
   */
  scrollorama.animate('#blurb-six',{ delay: 180, duration: 550, property:'opacity', start:0,end:0.8 });
  scrollorama.animate('#map_six_title',{ delay: 350, duration: 500, property:'right', start:-500,end:-2 });
  
  /*
   * 
   * Section SEVEN
   * 
   */
  scrollorama.animate('#map_seven_title',{ duration: 400, property:'top', start:-100,end:0 });
  
  scrollorama.animate('#seven-image-1',{ delay: 100, duration: 600, property:'top', start:-height,end:190 });
  scrollorama.animate('#seven-image-1',{ delay: 100, duration: 600, property:'left', start:width,end:-50 });
  
  scrollorama.animate('#seven-image-2',{ delay: 100, duration: 700, property:'top', start:-500,end:200 });
  scrollorama.animate('#seven-image-2',{ delay: 100, duration: 600, property:'left', start:-1200,end:120 });
  
  scrollorama.animate('#seven-image-3',{ delay: 150, duration: 600, property:'top', start:height,end:325 });
  scrollorama.animate('#seven-image-3',{ delay: 150, duration: 600, property:'left', start:-930,end:-135 });
  
  scrollorama.animate('#seven-image-4',{ delay: 150, duration: 600, property:'top', start:-1000,end:390 });
  scrollorama.animate('#seven-image-4',{ delay: 150, duration: 600, property:'left', start:400,end:153 });
  
  scrollorama.animate('#seven-image-6',{ delay: 250, duration: 500, property:'top', start:-900,end:526 });
  scrollorama.animate('#seven-image-6',{ delay: 250, duration: 500, property:'left', start:400,end:-20 });
  
  /*
   * 
   * Section EIGHT
   * 
   */
  scrollorama.animate('#eight-info',{ delay: 250, duration: 500, property:'line-height', start:0,end:2.7 });
  scrollorama.animate('#map_eight_title',{ delay: 100, duration: 500, property:'left', start:-600,end:-4 });
  
  /*
   * 
   * Outro
   * 
   */
  scrollorama.animate('#footer',{ delay:height - 250, duration:120, property:'bottom', start:-300,end:0 });
    

}