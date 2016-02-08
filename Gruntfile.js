

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
		watch: {
			files: ['sass/**/*'],
			tasks: ['sass']
		}

	});

  function spit(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  }

	grunt.event.on('watch', spit);

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['sass']);

};