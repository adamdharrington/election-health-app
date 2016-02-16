

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dev: {
				files: {
					'css/style.css': 'sass/main.scss'
				}
			}
		},
		copy:{
			build: {
				expand: true,
				src: ['js/bundle.js', 'css/**', 'img/**'],
				dest: 'build'
			}
		},
		watch: {
			files: ['sass/**/*'],
			tasks: ['sass']
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: "./js/app",
					paths: {
						vendor: "./../vendor",
						jquery: "empty:",
						views: "./../../templates"
					},
					shim: {
						'jquery': {
							exports: '$'
						},
						'vendor/mustache.min': {
							exports: 'Mustache'
						}
					},
					include: '../require.js',
					name: "../health-app",
					findNestedDependencies: true,
					inlineText: true,
					out: "js/bundle.js",
					done: function(done, output) {
						var duplicates = require('rjs-build-analysis').duplicates(output);

						if (duplicates.length > 0) {
							grunt.log.subhead('Duplicates found in requirejs build:');
							grunt.log.warn(duplicates);
							done(new Error('r.js built duplicate modules, please check the excludes option.'));
						}

						done();
					}
				}
			}
		}

	});

  function spit(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  }

	grunt.event.on('watch', spit);

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');


	grunt.registerTask('default', ['sass', 'copy']);
	grunt.registerTask('build', ['sass', 'requirejs', 'copy']);

};