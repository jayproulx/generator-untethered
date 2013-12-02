/**
 * app()
 * + What's your application name?
 * + What's your application version?
 * cb();
 *
 * projectfiles()
 * If git is installed:
 * + Yes: Is there a .git folder already?
 * + + No: Do you want me to init git for you?
 * + + + No: cb()
 * + + + Yes: Install hooks.
 * + + Yes: Install hooks.
 * + +
 * + No: cb()
 */

'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var cp = require('child_process');
var fs = require('fs');

function exists(path) {
	var stats;

	try {
		// Query the entry
		stats = fs.lstatSync(path);

		// Is it a directory?
		return stats.isDirectory() || stats.isFile();
	} catch (e) {
		return false;
	}

	return false;
}


var UntetheredGenerator = module.exports = function UntetheredGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function () {
		this.installDependencies({
			skipInstall: options['skip-install']
		});
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(UntetheredGenerator, yeoman.generators.Base);

UntetheredGenerator.prototype.askFor = function askFor() {
	var async = this.async(),
		prompts;

	this.gitExists = exists(process.cwd() + "/.git");

	prompts = [
		{
			name: 'appName',
			'default': 'My App',
			message: 'What do you want to name your application (hint: keep it short)?'
		},
		{
			name: 'appVersion',
			'default': '0.0.1',
			message: 'What version do you want to start with?'
		}
	];

	this.prompt(prompts, function (props) {
		this.appName = props.appName;
		this.appVersion = props.appVersion;

		async();
	}.bind(this));
};

UntetheredGenerator.prototype.app = function app() {
	this.copy('.bowerrc', '.bowerrc');
	this.copy('_gitignore', '.gitignore');
	this.template('bower.json', 'bower.json');
	this.template('Gruntfile.js', 'Gruntfile.js');
	this.copy('installhooks.sh', 'installhooks.sh');
	this.template('package.json', 'package.json');
	this.directory('.githooks', '.githooks');
	this.directory('src', 'src');
};

UntetheredGenerator.prototype.projectfiles = function () {
	var self = this,
		async = this.async(),
		prompts = [{
			type: 'confirm',
			name: 'gitInit',
			message: 'Should I initialize a git repository for you?',
			'default': true
		}, {
			type: 'confirm',
			name: 'installGitHooks',
			message: 'Do you want me to install the Git hooks?',
			'default': true,
			when: function (props) {
				console.log("Prompt: installGitHooks when", props.gitInit, this.gitExists, arguments);

				return props.gitInit || this.gitExists;
			}.bind(this)
		}];

	this.prompt(prompts, function (props) {
		console.log(props);
		this.gitInit = props.gitInit;
		this.installGitHooks = props.installGitHooks;

		if (props.gitInit) {
			initGit.call(this, function () {
				if (props.installGitHooks) {
					installGitHooks.call(this);
				}
			}.bind(this));
		}

		async();
	}.bind(this));
};

/*
----- Private Functions -----
*/

var initGit = function (cb) {
	console.log("UntetheredGenerator: initGit");
	
	if(this.gitExists) 
	{
		console.log(".git already exists for this project, no need to initialize.");
	}

	if (this.gitInit && !this.gitExists) {
		var async = this.async();

		cp.exec('git init', function (error, stdout, stderr) {
			if (error) {
				console.log(error, stderr);
			}

			console.log("git init async");
			async(error);
		});
	}
	
	if(cb)
	{
		cb();
	}
};

var installGitHooks = function () {
	console.log("UntetheredGenerator: installGitHooks");
	this.copy('.githooks/pre-commit', '.git/hooks/pre-commit');
};