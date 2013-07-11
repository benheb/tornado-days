module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
          'js/tornadoes.min.js': ['js/app.js', 'js/intro.js']
        }
      }
    },
    imagemin: {                          // Task
      dist: {                            // Target
        options: {                       // Target options
          //optimizationLevel: 3
          progressive: true
        },
        files: {                         // Dictionary of files
          'images/intro-tornado.jpg': 'dev/images/intro-tornado.jpg',
          'images/supercell-co-bw.jpg': 'dev/images/supercell-co-bw.jpg',
          'images/blurb-tor.png': 'dev/images/blurb-tor.png',
          'images/supercell-co.jpg': 'dev/images/supercell-co.jpg',
          'images/supercell05.png': 'dev/images/supercell05.png',
          'images/down-arrow.png': 'dev/images/down-arrow.png',
          'images/1999-okc.jpg': 'dev/images/1999-okc.jpg',
          'images/1992-1.jpg': 'dev/images/1992-1.jpg',
          'images/joplin.png': 'dev/images/joplin.png'
        }
      }
    }
  });
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  //image optimization
  grunt.loadNpmTasks('grunt-contrib-imagemin');
 
  // Default task(s).
  grunt.registerTask('default', ['uglify', 'imagemin']);
  //grunt.registerTask('default', ['imagemin']);

};
