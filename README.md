## AngularJS LogX 

LogX provides an extended version to AngularJS $log utilities to deliver logging output similar to:

![nglog-ouptut](https://f.cloud.github.com/assets/210413/2515299/4cdc1162-b442-11e3-80f0-3133890a355b.png)

<br/>
Originally published as a set of classes that must be manually cloned and intergrated into each project, this repository has evolved and now has multiple purposes:

1.  Configured as the GitHub source for the Bower component `angular-logX`
2.  Provides source code, build scripts for the `angluar-logX` library/component
3.  Provides examples of manually using the $log decorator classes: Demos #1 - #4
4.  Provides an example of using the Bower **angular-logX** component with its `mindspace.logX` angular module. See the custom SPA: **Demo #5**

---

<br/>
### Using/Installing the Bower Component 

Simple use the Bower command to install this component (angular-logX module/library) within your AMD SPA application

```txt
bower install angular-logX --save
```
Which will install the release library code as a Bower package. 

Afterwards, developers can use the following AngularJS plugins (for logging)  within their own AngularJS SPAs:

1. Concatenated : `/angular-logX/release/amd/angular-logX.js`
2. Minified : `/angular-logX/release/amd/angular-logX.min.js`

<br/>

> It is important to note that currently only an AMD library is available for use within AngularJS Browser SPA applications. <br/>This means that custom SPA(s) must use **RequireJS**. <br/><br/>Future releases will provide NodeJS and/or UMD versions of the library.

<br/>

Developers should be aware that when the component is installed with Bower (as shown above), the pre-build source is not available. Full source is available within the Git repository; so clone it and *play*.

--- 

<br/>
### Use the Source Code and build the AMD Library (locally)

The `angular-logX` library is deployed as a concatenated AMD library. To build the library (and its minified version), clone the repository locally and open a Terminal window to execute the following commands.

1. Install the **Grunt** libraries ```npm update```
2. Build the libraries using ```Grunt``` 

The new compiled libraries are deployed to:

1.  ```./release/amd/*.js```
2.  ```./demos/webroot/assets/vendor/angular-logX/release/amd``` 


> Future versions for deploying as CommonJS libraries will be available soon...


<br/>
### Repository and Demos

If you clone the repository, the demos/build directory has its own Bower scripts to install all Bower vendor libraries needed to run the demo SPAs.
These libraries will be installed within  `demos/webroot/assets/vendor/`.

If you run a webserver with its webroot set to `./demos/webroot` you can explore the Demos and their console output.

![Demo Snapshot](http://solutionoptimist.com/wp-content/uploads/2013/10/logEnhancer_large2.jpg "Demo Snapshot")

See the [Demo(s) ReadMe](https://github.com/ThomasBurleson/angularjs-logDecorator/tree/master/demos) for details.
<br/>


- - -


### Demo #5 - Using the AngularJS Enhanced Logging Plugin

Demo #5 (bootstrap.js) shows an example of how to use the Logging classes within your own SPA.

*  First we load the script using `head.js( )`. 
*  Then simply include the *Enhanced Logging* module dependency `mindspace.logX` when we configure the AngularJS SPA.

<br/>

```js
    var pluginURL = "/assets/vendor/angular-logX/release/amd/" ;
    head.js(

      { angular      : "/assets/vendor/angular/angular.js"  },
      { require      : "/assets/vendor/requirejs/require.js" },
      { logX :  pluginURL + "angular-logX.min.js"  }

    )
    .ready( "ALL", function() {

        // Dynamically load the application files...

        require.config (
        {
        	appDir  : '',
        	baseUrl : '/src/demo/5',
        	paths   :
        	{
                'utils'        : 'myApp/utils',
                 'mindspace.utils' : '/assets/vendor/angular-logX/release/amd/angular-logX.min'
        	},
            bundles: {
                'mindspace.utils': [
                    // List external AMDs that are known
                    'mindspace/logger/ExternalLogger',
                    'mindspace/utils/supplant',
                    'mindspace/utils/makeTryCatch'
                ]
            }
        });


        /**
         * Specify main application dependencies...
         * one of which is the Authentication module.
         */
        var dependencies = [
                'myApp/services/Authenticator',
                'myApp/controllers/LoginController'
            ],
            appName = 'myApp.Application';

        /**
         * Now let's start our AngularJS app...
         * which uses RequireJS to load the sxm packages and code
         */
        require( dependencies, function ( $log, Authenticator, LoginController )
        {
            /**
             * Start the main application; include dependency on the Enhanced Logging plugin
             * `mindspace.logX`
             */

            angular.module(     appName,           [ 'mindspace.logX' ]   )
                   .value(      "session",         { sessionID : null }    )
                   .factory(    "authenticator",   Authenticator           )
                   .controller( "LoginController", LoginController         );
        });

    });
```

<br/>
## Tutorial
### Enhance $log using AngularJS Decorators 

@see [The Solution Optimist](http://solutionoptimist.com/2013/10/07/enhance-log-using-angularjs-decorators/)



## License

Copyright (c) 2014 [Mindspace, LLC](http://www.solutionOptimist.com/)

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
