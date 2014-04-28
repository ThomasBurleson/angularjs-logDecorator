## AngularJS Enhanced Logging Plugin 

This library provides an easily installed AngularJS module: **ng.logDecorator**.

### Installation

Simple use the Bower command to install this library within your application

```txt
bower install angular-logDecorator --save
```
Which will install the release library code as a Bower package. Developers can use the following versions within their own AngularJS SPAs:

1. Concatenated : `/angular-logDecorator/release/angular-logDecorator.js`
2. Minified : `/angular-logDecorator/release/angular-logDecorator.min.js`

<br/>

> It is important to note that this is an AMD library and can only be used within applications using RequireJS.

<br/>

To use the Logging classes within your own SPA, make sure the script 

`/bower_components/angular-logDecorator/release/angular-logDecorator.min.js`

is loaded and then include the dependeny with your own code. e.g.

```js
var spa = angular.module( MyCustomApp, [ 'mindspace.logDecorator' ] );
```


## Tutorial
### Enhance $log using AngularJS Decorators 

@see [The Solution Optimist](http://solutionoptimist.com/2013/10/07/enhance-log-using-angularjs-decorators/)

#### Introducing `$provide.decorator()`

AngularJS has a great hidden feature `$provider.decorator()` that allows developers to **intercept** services and **substitute**, **monitor**, or **modify** features of those *intercepted* services. This features is not deliberately hidden… rather it is masked by so many other great AngularJS features. 


AngularJS developers should **NEVER** directly use `console.log()` to log debugger messages. Use `$log` instead…


This interception process occurs when the service is constructed and can be used for:

*  AngularJS built-in services: $log, $animate, $http, etc.
*  Custom services: $twitter, $facebook, authenticator, etc.

In fact `angular-mocks.js` uses the `decorator()` to add

*  `flush()` behaviors to $timeout,
*  `respond()` behaviors to $httpBackend, and
*  `flushNext()` behaviors to $animate

Since we are adding or changing behaviors at service construction, I like to say that `decorator()` allows us to <strong>inject</strong> custom behaviors. So, let's explore how you can use `decorator()` to **enhance** the AngularJS <code>$log</code> service with extra functionality.


<strong>Before</strong> you continue reading this article, I highly recommend that you first read the <a href="http://solutionoptimist.com/2013/09/30/requirejs-angularjs-dependency-injection/">Dependency Injection using RequireJS and AngularJS</a> tutorial; since many of the examples use RequireJS `define()` and dependency injection.


#### Presenting the AngularJS `$log`

AngularJS has a built-in service **$log** that is very useful for logging debug and error messages to a console. Using this injected service, developers can easily monitor application workflows, confirm call sequences, etc. And since it is such a common useful mechanism, developers often complain about wanting more features. 

Before we talk about adding more features, let's first look at standard $log usages. Here is an example use of the normal (un-enhanced) **$log** service within a mock Authenticator service class:

```js
// *********************************************
// bootstrap.js
// *********************************************

(function()
{
	"use strict";

    /**
     * Mock Authenticator with promise-returning API
     */
    var Authenticator = function( session, $q, $log)
        {
                /**
                 * Mock login() service for authenticatator.
                 * @returns {Deferred.promise|*}
                 */
            var login = function(username, password)
                {
                    var dfd      = $q.defer(),
                        errorMsg = "Bad credentials. Please use a username of 'admin' for this mock login !";

                    $log.debug( "login( `{0}` )", [username] );

                    if( (username != "admin") && (password != "secretPassword") )
                    {
                        $log.debug(  "login_onFault( `{0}` )", [errorMsg] );
                        dfd.reject( errorMsg );
                    }
                    else
                    {
                        $log.debug( "login_onResult(username = {0}, password = {1})", [username, password] );

                        session.sessionID = "SESSION_83732";
                        session.username = username;

                        dfd.resolve(session);
                    }

                    return dfd.promise;
                },
                /**
                 * Mock service for logout.
                 * @returns {Deferred.promise|*}
                 */
                logout = function()
                {
                    var dfd = $q.defer();

                    $log.debug("logout()");

                    session.sessionID = null;
                    dfd.resolve();

                    return dfd.promise;
                };

            return {
                login : login,
                logout: logout
            };
        },
        /**
         * LoginController used with the login template
         */
        LoginController = function( authenticator, $scope, $log )
        {
            var onLogin = function()
            {
                $log.debug(  "login( `{userName}` )", $scope  );

                authenticator
                    .login( $scope.userName, $scope.password )
                    .then(
                    function (result)
                    {
                        $log.debug(  "login_onResult( `{sessionID}` )", result );

                        $scope.hasError = false;
                        $scope.errorMessage = '';
                    },
                    function (fault)
                    {
                        $log.debug( "login_onFault( `{0}` )", [fault] );

                        $scope.hasError = true;
                        $scope.errorMessage = fault;
                    }
                );
            };

            $scope.login    = onLogin;
            $scope.userName = '';
            $scope.password = '';

            $scope.hasError = false;
            $scope.errorMessage = '';
        },
        appName = "myApp.Application";

    /**
     * Start the main application
     * We manually start this bootstrap process; since ng:app is gone
     * ( necessary to allow Loader splash pre-AngularJS activity to finish properly )
     */

    angular.module(     appName,             [ ]             )
           .value(      "session",           { sessionID : null })
           .factory(    "authenticator",     ["session", "$q", "$log", Authenticator]   )
           .controller( "LoginController",   [ "authenticator", "$scope", "$log", LoginController ] );

    angular.bootstrap( document.getElementsByTagName("body"), [ appName ]);
            
}());

```

When the Login form submits and <code>LoginController::login('Thomas Burleson', 'unknown')</code> is invoked, the $log output to the browser console will show:

```txt
login( `Thomas Burleson` )
login( `Thomas Burleson` )
login_onFault( `Bad credentials. Please use a username of 'admin' for mock logins !` )
login_onFault( `Bad credentials. Please use a username of 'admin' for mock logins !` )

```

Both the `LoginController` and the `Authenticator` are logging correctly to the console. 

*  But the console output is confusing! 
*  Which instance made which `$log.debug()` call? 

To resolve this we *could* modify each $log.debug() to manually prepend the classname and even add a time stamp to each; since timestamps would also allow us to casually check our code performance. 

But do NOT do this… that is a beginner's solution and is fuUgly.

Here is a sample output that we would *like* to see:

```txt
10:22:15:143 - LoginController::login( `Thomas Burleson` )
10:22:15:167 - Authenticator::login( `Thomas Burleson` )
10:22:15:250 - Authenticator::login_onFault( `Bad credentials. Please use a username of 'admin' for mock logins !` )
10:22:15:274 - LoginController::login_onFault( `Bad credentials. Please use a username of 'admin' for mock logins !` )

```

Before we start modifying *ALL* of our classes (like a beginning developer), let's pause and realize the the `$provide.decorator()` will allow us to centralize and hide all of the additional behavior and functionaltiy we want.

#### Using `$provider.decorator()` 

Let's use `$provider.decorator()` to intercept `$log.debug()` calls and dynamically prepend timestamp information.

```js
(function() {  
  "use strict";

    angular
      .module( appName, [ ] )
      .config([ "$provide", function( $provide )
      {
            // Use the `decorator` solution to substitute or attach behaviors to
            // original service instance; @see angular-mocks for more examples....

            $provide.decorator( '$log', [ "$delegate", function( $delegate )
            {
                // Save the original $log.debug()
                var debugFn = $delegate.debug;

                $delegate.debug = function( ) 
                {
                  var args    = [].slice.call(arguments),
                      now     = DateTime.formattedNow();
                  
                  // Prepend timestamp    
                  args[0] = supplant("{0} - {1}", [ now, args[0] ]); 

                  // Call the original with the output prepended with formatted timestamp
                  debugFn.apply(null, args)
                };
                
                return $delegate;
            }]);
      }]);

})();
```


In this case, we used a **head-hook** interceptor to build a prepend string and **then** call the original function. Other decorators could use **tail-hook** interceptors or replace interceptors. The versatility of choices is really powerful.


With the above enhancements, the console output would show something like this:

```
10:22:15:143 - login( `Thomas Burleson` )
10:22:15:167 - login( `Thomas Burleson` )
10:22:15:250 - login_onFault( `Bad credentials. Please use a username of 'admin' for mock logins !` )
10:22:15:274 - login_onFault( `Bad credentials. Please use a username of 'admin' for mock logins !` )

```

But we also wanted to easily include the classname for each method invoked! 

*  And did you notice that only `$log.debug()` was decorated? 
*  What about decorating the other functions such as `.error()`, `.warning()`, etc?

To achieve those additional feature is a little more complicated… but not as difficulat as you might think!

#### Refactoring our code for reuse 

Before we extned the `LogEnhancer` with more functionality, let's first refactor our current code. We will refactor for easy reuse across multiple applications.

```js
// **********************************
// Module: bootstrap.js 
// **********************************

(function() {
  "use strict";

  var dependencies = [ 
    'angular',
    'myApp/logger/LogDecorator',
    'myApp/services/Authenticator',
    'myApp/controllers/LoginController'
  ];

  define( dependencies, function( angular, LogDecorator, Authenticator, LoginController )
  {
    // Configure the AngularJS HTML5 application `myApp`
    
    angular
      .module(     "myApp",           [ ]              )
      .config(     LogDecorator                        )
      .service(    "authenticator",   Authenticator    )
      .controller( "LoginController", LoginController  );
      
  });

})();
```

```js
// *****************************************
// Module: myApp/logger/LogDecorator.js
// *****************************************

(function() 
{  
  "use strict";

  var dependencies = [ 
    'myApp/logger/LogEnhancer'
  ];

  define( dependencies, function( enchanceLoggerFn )
  {
      var LogDecorator = function( $provide )
          {
              // Register our $log decorator with AngularJS $provider

              $provide.decorator( '$log', [ "$delegate", function( $delegate )
              {
                  // NOTE: the LogEnchancer module returns a FUNCTION that we named `enchanceLoggerFn`
                  //       All the details of how the `enchancement` works is encapsulated in LogEnhancer!
                  
                  enchanceLoggerFn( $delegate );

                  return $delegate;
              }]);
          };

      return [ "$provide", LogDecorator ];
  });

})();
```

```js
// ****************************************
// Module: myApp/logger/LogEnhancer.js
// ****************************************

(function() 
{  
  "use strict";

  var dependencies = [ 
    'myApp/utils/DateTime',
    'myApp/utils/supplant'
  ];

  define( dependencies, function( DateTime, supplant )
  {
    var enchanceLogger = function( $log )
        {
          // Save the original $log.debug()
          var debugFn = $log.debug;

          $log.debug = function( ) 
          {
            var args    = [].slice.call(arguments),
                now     = DateTime.formattedNow();
                
                // prepend a timestamp to the original output message                
                args[0] = supplant("{0} - {1}", [ now, args[0] ]); 

            // Call the original with the output prepended with formatted timestamp
            debugFn.apply(null, args)
          };
          
          return $log;
        };

    return enchanceLogger;
  });

})();
```

This package structuring (above) conforms to the <a href="http://en.wikipedia.org/wiki/Law_of_Demeter">Principle of Least Knowledge</a>. This approach encapsulates all the actual details of how `$log` is enhanced in the the LogEnhancer module.

Now we are ready to continue adding functionality to the `LogEnhancer`… functionality that *inject* classNames prepended into the output messages.

<!--nextpage-->

#### Extending `LogEnhancer`

To easily support the `$log` functionality which prepends classNames to output messages, we need to allow `$log` to generate unique instances of itself; where each instance is registered with a specific classname.

Perhaps a code snippet will explain:

```js
// ****************************************
// Module: myApp/controllers/LoginController.js
// ****************************************

define( dependencies, function( supplant )
{
  var LoginController = function( authenticator, $scope, $log ) 
    {
        $log = $log.getInstance( "LoginController" );
        
        // ...
    };

  return [ "authenticator", "$scope", "$log", LoginController ];
  
});

```

We used the `$log.getInstance()` method to return an object that looks like a $log but is NOT an actual AngularJS $log. How did we do this… our LogEnhancer decorated the AngularJS $log service and ADDED a `getInstance()` method to that service.

The elegance to the above solution is that $log still passes the <a href="http://en.wikipedia.org/wiki/Duck_test">Duck test</a> but internally knows how to prepend "LoginController" for any $log calls performed in the LoginController class.  

One line of code to support this feature within any class… that is pretty cool!

Let's itemize the set of features that we still need in order to fully-enable our LogEnhancer module:

*  Intercept all the `$log` methods:  log, info, warn, debug, error
*  Ability to build output with tokenized messages and complex parameters ( this will not be discussed in this article ) 
*  Add `getInstance()` function with ability to generate custom instances with specific classNames 

#### Using Partial Application within our `LogEnhancer`

We can use the partial application (sometimes known as Function Currying) technique to capture the specific log function that we want to intercept.
This techinque allows us to use a generic handler that is partially applied to each `$log` function. 

Personally I love elegant tricks like these!

```js
// **********************************
// Module: myApp/logger/LogEnhancer.js
// **********************************

(function() 
{  
  "use strict";

  var dependencies = [ 
    'myApp/utils/DateTime'
    'myApp/utils/supplant'
  ];

  define( dependencies, function( DateTime, supplant )
  {
    var enchanceLogger = function( $log )
        {
            var debugFn = $log.debug,
                /**
                 * Partial application to pre-capture a logger function
                 */
                prepareLogFn = function( logFn )
                {
                    /**
                     * Invoke the specified `logFn` with the supplant functionality...
                     */
                    var enhancedLogFn = function ( )
                    {
                        var args = Array.prototype.slice.call(arguments),
                            now  = DateTime.formattedNow(),
                                        
                            // prepend a timestamp to the original output message
                            args[0] = supplant("{0} - {1}", [ now, args[0] ]); 

                        debugFn.call( null,  supplant.apply( null, args ) );
                    };

                    return enhancedLogFn;
                };

            $log.log   = prepareLogFn( $log.log );
            $log.info  = prepareLogFn( $log.info );
            $log.warn  = prepareLogFn( $log.warn );
            $log.debug = prepareLogFn( $log.debug );
            $log.error = prepareLogFn( $log.error );
            
            return $log;
        };

    return enchanceLogger;
  });

})();
```


Notice that the `debugFn.call( … )` method also uses a `supplant()` method to transform any tokenized content into a final output string.
e.g.

```js
    var user = { who:"Thomas Burleson"", email="ThomasBurleson@gmail.com"" };
    
    // This should output:
    // A warning message for `Thomas Burleson` will be sent to `ThomasBurleson@gmail.com` !
    
    $log.warn( "A warning message for `{who}` will be sent to `{email}` !", user );
    
    
```

So not only have we intercepted the $log functions to prepend a timestamp, we also **supercharged** those functions to support tokenized strings.

#### Adding `$log.getInstance()`

Finally we need to implement the `getInstance()` method and publish it as part of the AngularJS `$log` service.

```js
// **********************************
// Module: myApp/logger/LogEnhancer.js
// **********************************

(function() 
{  
  "use strict";

  var INVALID_CONFIGURATION = "Logger::register( $log ) must be called before any getInstance() calls are supported!",
      dependencies          = [  
            'myApp/utils/DateTime', 
            'myApp/utils/supplant' 
      ];
      

  define( dependencies, function( DateTime, supplant )
  {
    var enchanceLogger = function( $log )
        {
            var debugFn = $log.debug,
                /**
                 * Partial application to pre-capture a logger function
                 */
                prepareLogFn = function( logFn, className )
                {
                    /**
                     * Invoke the specified `logFn` with the supplant functionality...
                     */
                    var enhancedLogFn = function ( )
                    {
                        var args = Array.prototype.slice.call(arguments),
                            now  = DateTime.formattedNow();
                                        
                            // prepend a timestamp and optional classname to the original output message
                            args[0] = supplant("{0} - {1}{2}", [ now, className, args[0] ]); 

                        debugFn.call( null,  supplant.apply( null, args ) );
                    };

                    return enhancedLogFn;
                },
                /**
                 * Support to generate class-specific logger instance with classname only
                 *
                 * @param name
                 * @returns {*} Logger instance
                 */
                getInstance = function( className )
                {
                    className = ( className !== undefined ) ? className + "::" : "";
                    
                    if ( $log === undefined ) {
                        throw Error( INVALID_CONFIGURATION );
                    }

                    return {
                        log   : prepareLogFn( $log.log,    className ),
                        info  : prepareLogFn( $log.info,   className ),
                        warn  : prepareLogFn( $log.warn,   className ),
                        debug : prepareLogFn( $log.debug,  className ),
                        error : prepareLogFn( $log.error,  className )
                    };
                };


            $log.log   = prepareLogFn( $log.log );
            $log.info  = prepareLogFn( $log.info );
            $log.warn  = prepareLogFn( $log.warn );
            $log.debug = prepareLogFn( $log.debug );
            $log.error = prepareLogFn( $log.error );

            // Add special method to AngularJS $log
            $log.getInstance = getInstance;
            
            return $log;
        };

    return enchanceLogger;
  });

})();
```

We modified our partial application function `prepareLogFn()` to accept an optional `className` argument. And we implemented a `getInstance()` method that builds a special object with the same API as the original `$log` service.

Now if we modify our original example code:

```js
(function()
{
	"use strict";

	var dependencies = [ 
		'myApp/utils/supplant'
	];

	define( dependencies, function( supplant )
	{
		var Authenticator = function( session, $q, $log)
		{
		    $log = $log.getInstance( "Authenticator" );
		    
		    // … other code here
		};

        return ["session", "$q", "$log", Authenticator];

	});
	
	define( dependencies, function( supplant )
	{
		var LoginController = function( authenticator, $scope, $log ) 
			{
				$log = $log.getInstance( "LoginController" );
				
				// … other code here
			};

		return [ "authenticator", "$scope", "$log", LoginController ];
		
	});

}());
```

Then our browser console output would be:

```
10:22:15:143 - LoginController::login( `Thomas Burleson` )
10:22:15:167 - Authenticator::login( `Thomas Burleson` )
10:22:15:250 - Authenticator::login_onFault( `Bad credentials. Please use a username of 'admin' for mock logins !` )
10:22:15:274 - LoginController::login_onFault( `Bad credentials. Please use a username of 'admin' for mock logins !` )

```

#### Summary


This is just one example of how Decorators can be used to add or modify behavior in AngularJS applications. And the LogEnhancer could be further extended with features to:

* Output to a custom application console... for remote, customer reporting
* Color coding and grouping of log messages by category; @see [Chrome Dev Tools](https://developers.google.com/chrome-developer-tools/docs/console)
* Logging client-side errors to the remote server

I am sure there are many more elegant applications of this technique. Don't foreget to share with the AngularJS community if you have a cool decorator!

I have created a GitHub repository with the source and examples used within this tutorial.
[Source Code](https://github.com/ThomasBurleson/angularjs-logDecorator) [Demos](https://github.com/ThomasBurleson/angularjs-logDecorator)

### Extra Credit

As a ending-show teaser, I extended the `$log` decorator to support logging with colors. Do YOU know how to achieve the results shown below?

![demo_with_console](https://cloud.githubusercontent.com/assets/210413/2812333/34eb8596-ce51-11e3-8252-95ae2f338e14.jpg)

Check out Demo #5 to see how Chrome Dev tools supports [console logging with color](https://developers.google.com/chrome-developer-tools/docs/console#styling_console_output_with_css).

