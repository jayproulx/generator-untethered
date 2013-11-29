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
	try {
		// Query the entry
		stats = fs.lstatSync(path);

		// Is it a directory?
		if (stats.isDirectory() || stats.isFile()) {
			return true;
		}
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
	var async = this.async();
	var cb = function() { console.log("UNTETHERED: askFor async."); async(); }.bind(this);

	this.gitExists = exists(__dirname, "/.git");

	// have Yeoman greet the user.
	console.log(this.yeoman);

	var prompts = [
		{
			name: 'appName',
			default: 'My App',
			message: 'What do you want to name your application (hint: keep it short)?'
		},
		{
			name: 'appVersion',
			default: '0.0.1',
			message: 'What version do you want to start with?'
		}
	];

	this.prompt(prompts, function (props) {
		this.appName = props.appName;
		this.appVersion = props.appVersion;

		cb();
	}.bind(this));
};

UntetheredGenerator.prototype.app = function app() {
	this.copy('.bowerrc', '.bowerrc');
	this.copy('.gitignore', '.gitignore');
	this.template('bower.json', 'bower.json');
	this.template('Gruntfile.js', 'Gruntfile.js');
	this.copy('installhooks.sh', 'installhooks.sh');
	this.template('package.json', 'package.json');
	this.directory('.githooks', '.githooks');
	this.directory('src', 'src');
};

UntetheredGenerator.prototype.projectfiles = function () {
	var async = this.async();
	var cb = function() { console.log("UNTETHERED: projectfiles async."); async(); }.bind(this);

	cp.exec('which git', function (error, stdout, stderr) {
		if (/git/.test(stdout)) {
			this.initGit(cb);
		} else {
			// no git, so quit now
			cb();
		}
	}.bind(this));
};

UntetheredGenerator.prototype.initGit = function (cb) {
	var self = this;
	

	if (!this.gitExists) {
		console.log("No .git exists, ask if we should initialize");
		var prompts = [{
			type: 'confirm',
			name: 'gitinit',
			message: 'Should I initialize a git repository for you?',
			default: true
		}];

		this.prompt(prompts, function (props) {
			console.log("Prompted for initialize, user said " + props.gitinit);
			this.gitinit = props.gitinit;

			if (props.gitinit) {
				console.log("User said to initialize, exec git init");
				cp.exec('git init', function (error, stdout, stderr) {
					console.log("Git init complete");
					if (!error) {
						console.log("No error on git init, now call gitHooks");
						self.gitHooks(cb);
					} else {
						console.log("Error on git init, time to quit");
						// whoops, error, we're done here
						console.log(error, stderr);
						cb();
					}
				});
			} else {
				console.log("No .git folder and user doesn't want to initialize, time to quit");
				// no .git folder and user doesn't want it initialized, we're done
				cb();
			}

		}.bind(this));
	} else {
		console.log(".git alredy exists, ask if the user wants us to install the hooks");
		this.gitHooks(cb);
	}
	console.log("initGit complete");
};

UntetheredGenerator.prototype.gitHooks = function (cb) {
	console.log("GITHOOKS: ", cb);
	var prompts = [];

	prompts.push({
		type: 'confirm',
		name: 'installGitHooks',
		message: 'Do you want me to install the Git hooks?',
		default: true
	});

	this.prompt(prompts, function (props) {
		console.log("GITHOOKS PROMPT: ", cb);
		this.installGitHooks = props.installGitHooks;

		if (props.installGitHooks) {
			this.copy('.githooks/pre-commit', '.git/hooks/pre-commit');
		}

		// we're done whether or not the hooks are installed.
		console.log("GITHOOKS PROMPT: ", cb);
		cb();

	}.bind(this));
	
	console.log("gitHooks complete");

}