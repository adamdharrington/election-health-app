module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	  	sass: {                                // Task
		  dev: {                            
			files: {                         					 
			  'css/style.css': 'sass/main.scss'
			}
		  }
		}
	});
    grunt.loadNpmTasks('grunt-contrib-sass');
	
	grunt.registerTask('default', ['sass']);
};