Untethered
==========

[![Build Status](https://secure.travis-ci.org/jayproulx/generator-untethered.png?branch=master)](https://travis-ci.org/jayproulx/generator-untethered)

Ahem.  The build is only failing because I haven't quite figured how to run the tests to run the generator and test the output.  It's fully functional though :)

A generator for [Yeoman](http://yeoman.io).

## Getting Started

### Installing Yeoman

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

### Yeoman Generators

To install generator-untethered from npm, run:

```
$ npm install -g generator-untethered
```

Finally, initiate the generator:

```
$ yo untethered
```

Developing an Untethered UI
===========================

Web UI for managing APIs.

**Table of Contents**

- [Running](#running)
- [Developing](#developing)
	- [Prerequisites](#prerequisites)
	- [Continuous Integration](#continuous-integration)
		- [TLDR;](#tldr;)
		- [Modifying Code](#modifying-code)
		- [Starting a Development webserver](#starting-a-development-webserver)
		- [Unit Tests](#unit-tests)
		- [Creating new page configurations](#creating-new-page-configurations)

Running
-------

Deploy src/main/www/* to a web server.  That's it.

Developing
----------

### Prerequisites ###

You should install Node, Grunt and Bower globally before proceeding, it'll make the process much easier.  You'll only need these prequisites if you're planning on doing development, otherwise everything should run directly out of the ```src/main/www``` folder anyway.

- <http://nodejs.org/download/>
- <http://gruntjs.com/getting-started>
- <http://bower.io/>
- <http://karma-runner.github.io>

Once you have the prerequisites (and any time they change), you'll have to update your Node and Bower modules.  This is very straight forward, the dependencies are already listed in ```package.json``` and ```bower.json```, all you need to do to install them is:

```
# npm install
```

_Note:_ The bower components are checked in when they're installed, you shouldn't need to ```bower install``` unless you're adding a new component.

### Continuous Integration ###

The Grunt.js task runner takes care of all of the automated tasks.

#### TLDR; ####

You can read all of the documentation here, and you should, but there's not much you need to know right out of the gate.  Just fire up the webserver with ```grunt --no-minify```, remember to run ```grunt ci``` each time before you commit, and write some code! :)

- ```grunt```: Starts a Node webserver providing performant optimized JS
- ```grunt --no-minify```: Starts a  Node webserver providing unminified JS, best for debugging
- ```grunt ci```: runs the continuous integration build
- ```grunt <taskname>```: Run a task directly, you won't need to do this often
  - ```browserify```: Concatenate and optimize JS
  - ```karma```: Run unit tests
  - ```autoprefixer```: Optimize CSS files, automatically adds vendor prefixes
  - ```jshint```: Lint the JS files for code consistency and safety.

#### Modifying Code ####

Each HTML file makes use of optimized JS and CSS in ```dist/``` folders found in ```src/main/www```.  Every time you make a change to CSS or JS, the code needs to be re-optimized, checked for consistency and tested.

Before you commit, it's important to run all of the tests. ```grunt ci``` runs the continuous integration build.

```
# grunt ci
```

_Note:_ This can be run automatically every time you commit by running the ```installhooks.sh``` script or copying the contents of ```.githooks``` into the ```.git/hooks``` directory.  This will also make sure that you can't commit if there are test errors, or linting errors.

```browserify``` doesn't guarantee that everything will be concatenated in exactly the same order every time, only that it is concatenated in a way such that dependencies are loaded first.  Always commit the files in the ```dist/``` folders.

#### Starting a Development webserver ####

Node.js and Express are used to serve up the web content over HTTP.  Some AJAX operations are not permitted when serving files over ```file:///```, so we should always develop on a running webserver.  

Installing, configuring and starting Apache can be a bit of a pain.  Since we're already using Node.js for the build process, it's a simple task to also start a running webserver.

```
# grunt [--no-minify]
```
Running the default Grunt.js task will start a webserver.  Optionally adding the ```--no-minify``` argument will prevent browserify from minifying the JS, leaving it readable and debuggable.

#### Unit Tests ####

Unit tests are run through Karma using Jasmine.  Unit tests are run every time the developer runs ```grunt ci```, however, sometimes we want the test runner to remain active while we modify code.

```
# cd src/test/www/profile
# karma start karma.conf.js
INFO [karma]: Karma v0.10.2 server started at http://localhost:9876/
INFO [launcher]: Starting browser Chrome
INFO [Chrome 31.0.1650 (Mac OS X 10.9.0)]: Connected on socket fXK9IzgO_e6FqO41Kmvn
Chrome 31.0.1650 (Mac OS X 10.9.0): Executed 12 of 12 SUCCESS (0.24 secs / 0.058 secs)
```

Any time one of the tests or test dependencies changes, Karma will re-run the tests for the current module.

** Creating unit tests **

So you're creating a new module, and you want to configure it.  Karma has a handy ```init``` command that allows you to configure your tests.  Or you can just copy one of the existing karma.conf.js files from another module.

```
# cd src/test/www
# mkdir mymodule
# karma init
```

Karma will ask you a few questions about which dependencies you want to provide, where your test files are, etc. and will generate a karma.conf.js file for you.

#### Creating new page configurations ####

The Grunt.js configuration for each HTML is built to be cookie-cutter.  To create a new page, just duplicate one of the existing ```grunt.<module>.js``` files in the root folder, and add a new line to the ```gruntModules(...)``` function call in ```Gruntfile.js```.  No other changes need to be made to ```Gruntfile.js```, the tasks defined in ```Gruntfile.js``` are built to run for all modules or common build steps.

## License

![Creative Commons Attribution-ShareAlike](http://i.creativecommons.org/l/by-sa/4.0/88x31.png "Creative Commons Attribution-ShareAlike")

Untethered Generator by [Jay Proulx](http://proulx.info) is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).

Based on a work at [http://github.com/jayproulx/generator-untethered](http://github.com/jayproulx/generator-untethered)
