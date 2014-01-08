/*global describe, beforeEach, it*/
'use strict';

var path = require( 'path' ),
	helpers = require( 'yeoman-generator' ).test,
	fs = require( 'fs.extra' ),
	tempDir = function () {
		return path.join( __dirname, 'temp' + new Date().getTime() );
	};

describe( 'untethered generator', function () {
	beforeEach( function ( done ) {
		var td = tempDir();

		console.log( "Using temp dir: " + td );
		fs.rmrfSync( td );

		helpers.testDirectory( td, function ( err ) {
			if ( err ) {
				return done( err );
			}

			this.app = helpers.createGenerator( 'untethered:app', ['../../app'] );

			done();

		}.bind( this ) );
	} );

	describe( 'basic configuration', function () {

		it( 'creates default files', function ( done ) {
			var expected = [
				'.bowerrc',
				'.gitignore',
				'Gruntfile.js',
				'grunt.index.js',
				'grunt.vendor.js',
				'installhooks.sh',
				'package.json',
				'.githooks/pre-commit',
				'src/main/node/server.js',
				'src/main/www/index.html',
				'src/main/www/css/index.css',
				'src/test/www/js/index.js',
				'src/test/www/js/karma.conf.js',
				'src/main/www/js/index.js',
				'src/main/www/partials/nav.html',
				'src/main/www/partials/welcome.html'
			];

			helpers.mockPrompt( this.app, {
				'appName': "My Test App",
				'appVersion': "0.0.1",
				'gitInit': false,
				'installGitHooks': false
			} );

			this.app.options['skip-install'] = true;
			this.app.run( {}, function () {
				helpers.assertFiles( expected );
				done();
			} );
		} );
	} );

	describe( 'git features', function () {

		it( 'creates initializes git', function ( done ) {
			var expected = [
				'.git'
			];

			helpers.mockPrompt( this.app, {
				'appName': "My Test App",
				'appVersion': "0.0.1",
				'gitInit': true,
				'installGitHooks': false
			} );

			this.app.options['skip-install'] = true;
			this.app.run( {}, function () {
				setTimeout( function () {
					helpers.assertFiles( expected );
				}, 1000 );
				done();
			} );
		} );

		it( 'creates installs git hooks', function ( done ) {
			var expected = [
				'.git',
				'.git/hooks/pre-commit'
			];

			helpers.mockPrompt( this.app, {
				'appName': "My Test App",
				'appVersion': "0.0.1",
				'gitInit': true,
				'installGitHooks': true
			} );

			this.app.options['skip-install'] = true;
			this.app.run( {}, function () {
				helpers.assertFiles( expected );
				done();
			} );

		} );

	} );


} );
