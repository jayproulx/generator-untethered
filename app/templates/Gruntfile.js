var module;

module.exports = function (grunt) {
	"use strict";

	var startupError = false,
		config = {
			www: {
				js: 'src/main/www/js/**/*.js',
				css: 'src/main/www/css/**/*.css',
				entry: 'src/main/www/dist/app.js',
				options: {
					aliasMappings: {
						cwd: 'src/main/www/js',
						src: ['**/*.js'],
						dest: 'js'
					}
				}
			},

			vendor: {
				files: [
					"src/main/www/components/jquery/jquery.min.js",
					"src/main/www/components/bootstrap/dist/js/bootstrap.min.js",
					"src/main/www/components/angular/angular.min.js",
					"src/main/www/components/angular-resource/angular-resource.min.js",
					"src/main/www/components/angular-ui-router/release/angular-ui-router.js"
				],
				entry: "src/main/www/dist/vendor.js"
			},

			node: {
				files: 'src/main/node/**/*.js',
				entry: 'src/main/node/server.js'
			}
		};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		watch: {
			express: {
				files: config.node.files,
				tasks: ['express:dev'],
				options: {
					nospawn: true
				}
			},

			browserify: {
				files: config.www.js,
				tasks: ['browserify:dist']
			},
			
			autoprefixer:
			{
				files: config.www.css,
				tasks: ['autoprefixer']
			}
		},

		browserify: {
			vendor: {
				src: config.vendor.files,
				dest: config.vendor.entry,
				options: {
					alias: [
						"src/main/www/components/jquery/jquery.min.js:jquery",
                        "src/main/www/components/angular/angular.min.js:angular"
                    ],
					shim: {
						jquery: {
							path: 'src/main/www/components/jquery/jquery.min.js',
							exports: '$'
						},
						angular: {
							path: 'src/main/www/components/angular/angular.min.js',
							exports: 'angular'
						}
					},
					transform: ['uglifyify']
				}
			},

			dev: {
				src: config.www.js,
				dest: config.www.entry,
				options: {
					aliasMappings: config.www.options.aliasMappings
				}
			},

			dist: {
				src: config.www.js,
				dest: config.www.entry,
				options: {
					transform: ['uglifyify'],
					aliasMappings: config.www.options.aliasMappings
				}
			}
		},
		
		autoprefixer: {
			options: {
				browsers: ["last 4 version"]
			},
			
			styles: 
			{
				expand: true,
				flatten: true,
				src: 'src/main/www/css/*.css',
				dest: 'src/main/www/dist/'
			},
			
			// skins have to remain separate as they'll be included separately
			skins:
			{
				expand: true,
				flatten: true,
				src: 'src/main/www/css/skins/*.css',
				dest: 'src/main/www/dist/skins/'
			},
			
			// skins have to remain separate as they'll be included separately
			fonts:
			{
				expand: true,
				flatten: true,
				src: 'src/main/www/css/fonts/*.css',
				dest: 'src/main/www/dist/fonts/'
			}
		},

		express: {
			server: {
				options: {
					script: config.node.entry,
					background: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-autoprefixer');

	grunt.registerTask('server', ['express', 'browserify:vendor', 'browserify:dev', 'autoprefixer', 'watch']);
	grunt.registerTask('server:dev', 'server');
	grunt.registerTask('server:dist', ['express', 'browserify:vendor', 'browserify:dist', 'autoprefixer', 'watch']);
	grunt.registerTask('ci', ['browserify', 'autoprefixer']);
};
