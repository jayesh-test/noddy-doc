'use strict';
module.exports = function(grunt) {
  grunt.initConfig({

    cssmin: {
       minify: {        
         expand: true,
          src: 'portfolio-grunting/public/style/*.css',  // source files mask         
         dest: 'portfolio-grunting/public/style',
         flatten: true,   // remove all unnecessary nesting
         extDot:true,
            ext: '.css'   // replace .js to .min.js
       }
     },
      

    //   jshint: {
    //   files: ['gruntFile.js', 'app/public/script/*.js'],
    //   options: {
    //     // options here to override JSHint defaults
    //     globals: {
    //       jQuery: true,
    //       console: true,
    //       module: true,
    //       document: true
    //     }
    //   }
    // },

   htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'portfolio-grunting/views/jayesh.html': 'portfolio-grunting/views/jayesh.html'
        }
      }
    },

   uglify: {
      build: {


        files: [{
            src: 'portfolio-grunting/public/javascripts/*.js',  // source files mask
            dest: 'portfolio-grunting/public/javascripts/',    // destination folder
            expand: true,    // allow dynamic building
            flatten: true,   // remove all unnecessary nesting
            extDot:true,
            ext: '.js'   // replace .js to .min.js
        }]
      }
    }  
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.registerTask('default', ['htmlmin:dist']);
  grunt.registerTask('default', [
    'uglify'
    ]);

};
