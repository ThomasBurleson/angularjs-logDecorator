## AngularJS LogDecorator

This repository has several purposes:

1.  Configured as the GitHub source for the Bower component `angular-logDecorator`
2.  Provides source code, build scripts for the `angluar-logDecorator` library/component
3.  Provides examples of using the LogDecorator: Demos #1 - #4
4.  Provides an example of using the Bower component `mindspace.logDecorator` module within custom SPA: **Demo #5**

<br/>
### Bower Component Installation

Simple use the Bower command to install this component (logDecorator module/library) within your AMD SPA application

```txt
bower install angular-logDecorator --save
```
Which will install the release library code as a Bower package. 

Afterwards, developers can use the following AngularJS plugins (for logging)  within their own AngularJS SPAs:

1. Concatenated : `/angular-logDecorator/release/amd/angular-logDecorator.js`
2. Minified : `/angular-logDecorator/release/amd/angular-logDecorator.min.js`

<br/>

> It is important to note that currently only an AMD library is available for use within AngularJS Browser SPA applications. <br/>This means that custom SPA(s) must use **RequireJS**. <br/><br/>Future releases will provide NodeJS and/or UMD versions of the library.

<br/>

Developers should be aware that when the component is installed with Bower (as shown above), the pre-build source is not available. Full source is available within the Git repository; so clone it and *play*.


<br/>
### Repository and Demos

If you clone the repository, the demos/build directory has its own Bower scripts to install all Bower vendor libraries needed to run the demo SPAs.
These libraries will be installed within  `demos/webroot/assets/vendor/`.

If you run a webserver with its webroot set to `./demos/webroot` you can explore the Demos and their console output.


<br/>

### Demo #5 - Using the AngularJS Enhanced Logging Plugin

Demo #5 (bootstrap.js) shows an example of how to use the Logging classes within your own SPA.

First we load the script:

`/<bower_components>/angular-logDecorator/release/amd/angular-logDecorator.min.js`

Then simply include the dependency within your own code. e.g.

```js
var spa = angular.module( MyCustomApp, [ 'mindspace.logDecorator' ] );
```

<br/>
## Tutorial
### Enhance $log using AngularJS Decorators 

@see [The Solution Optimist](http://solutionoptimist.com/2013/10/07/enhance-log-using-angularjs-decorators/)
