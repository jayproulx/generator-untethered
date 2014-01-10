/*global describe, beforeEach, it*/
'use strict';

var path = require( 'path' ),
	helpers = require( 'yeoman-generator' ).test,
	fs = require( 'fs-extra' ),
	cp = require( 'child_process' ),
	tempDir = function () {
		return path.join( __dirname, 'temp' + new Date().getTime() );
	};

function rmrf( dir, cb ) {
	cp.exec( 'set -x && rm -rf ' + dir, cb || function() {});
}

describe( 'untethered generator', function () {
	var td = tempDir();

	before( function ( done ) {
		console.log( "Using temp dir: " + td );
		// make sure that this temp folder is removed before executing the tests.
		// fs.removeSync( td );
		rmrf( td, function () {
			helpers.testDirectory( td, function ( err ) {
				if ( err ) {
					return done( err );
				}

				this.app = helpers.createGenerator( 'untethered:app', ['../../app'] );

				done();

			}.bind( this ) );
		}.bind( this ) );

	} );

	after( function () {
		rmrf( td );
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
				'src/main/www/partials/user-tile.html',
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

		it.skip( 'initializes git', function ( done ) {
			var expected = [
				'.git/HEAD'
			];

			helpers.mockPrompt( this.app, {
				'appName': "My Test App",
				'appVersion': "0.0.1",
				'gitInit': true,
				'installGitHooks': false
			} );

			this.app.options['skip-install'] = true;
			this.app.run( {}, function () {
				helpers.assertFiles( expected );
				done();
			} );
		} );

		it( 'installs git hooks', function ( done ) {
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
