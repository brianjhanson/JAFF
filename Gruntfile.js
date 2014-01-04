/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: [
          'src/scripts/vendor/lib/jquery-1.10.2.min.js',
          'src/scripts/vendor/plugins/*.js',
          'src/scripts/compiled/*.js'
        ],
        dest: 'dist/scripts/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/scripts/<%= pkg.name %>.min.js'
      },
      modernizr: {
        src: 'src/scripts/vendor/lib/modernizr-2.6.2.min.js',
        dest: 'dist/scripts/modernizr.min.js'
      }
    },
    sass: {
      dist:{
        options: {
          trace: true,
          style: 'compressed',
        },
        files: {
          'dist/styles/<%= pkg.name %>.min.css':'src/styles/app.scss'
        },
      },
    },
    autoprefixer: {
      options:{
        browsers: ['last 2 version', 'ie 8', 'ie 7']
      },
      dist: {
        src: 'dist/styles/<%= pkg.name %>.min.css',
        dest: 'dist/styles/<%= pkg.name %>.min.css'
      },
    },
    coffee: {
      dist: {
        expand: true,
        flatten: true,
        cwd: 'src/scripts/',
        src: ['*.coffee'],
        dest: 'src/scripts/compiled',
        ext: '.js'
      }
    },
    coffee_jshint: {
      source: {
        src: ['src/scripts/**/*.coffee']
      },
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    imagemin: {
      dist:{
        files: [{
          expand: true,
          cwd: 'src/img',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/img/'
        }]
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile', 'buildscripts', 'buildstyles','optimizeimages']
      },
      scripts:{
        files: ['src/scripts/**/*.js', 'src/scripts/**/*.coffee'],
        tasks: ['buildscripts']
      },
      styles:{
        files: ['src/styles/**/*.scss'],
        tasks: ['buildstyles']
      },
      images:{
        files: ['src/img/**/*.{png, jpg, gif}'],
        tasks: ['optimizeimages']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-coffee-jshint');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task.
  grunt.registerTask('default', []);
  grunt.registerTask('buildscripts', ['coffee_jshint', 'coffee', 'concat', 'uglify']);
  grunt.registerTask('buildstyles', ['sass', 'autoprefixer']);
  grunt.registerTask('optimizeimages', ['imagemin']);
};
