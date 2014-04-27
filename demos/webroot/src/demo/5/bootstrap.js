/**
 *  Use aysnc script loader, configure the application module (for AngularJS)
 *  and initialize the application ( which configures routing )
 *
 * @author Thomas Burleson
 * @date   Oct, 2013
 * @url    http://www.TheSolutionOptimist.com
 *
 */
 (function( window, head ) {
    "use strict";

    head.js(

      { angular      : "/assets/vendor/angular/angular.js"                          ,    size: "551057"  },
      { require      : "/assets/vendor/requirejs/require.js"                        ,    size: "80196"   },

      { logDecorator : "/assets/vendor/angular-logDecorator/release/amd/angular-logDecorator.min.js",    size: "22205"   }

    )
    .ready( "ALL", function() {

        require.config (
        {
        	appDir  : '',
        	baseUrl : '/src/demo/5',
            priority: 'angular',
        	paths   :
        	{
        		'angular'      : '/assets/vendor/angular/angular',
                'utils'        : 'myApp/utils'
        	},
        	shim    :
        	{
        		'angular':
        		{
        			exports : 'angular'
        		}
        	}
        });


        /**
         * Specify main application dependencies...
         * one of which is the Authentication module.
         */
        var dependencies = [
                'mindspace/logger/ExternalLogger',
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
            $log = $log.getInstance( "BOOTSTRAP" );
            $log.debug( "Starting main application: {0}", [appName] );

            /**
             * Start the main application
             * We manually start this bootstrap process; since ng:app is gone
             * ( necessary to allow Loader splash pre-AngularJS activity to finish properly )
             */

            angular.module(     appName,           [ 'ng.logDecorator' ]   )
                   .value(      "session",         { sessionID : null }    )
                   .factory(    "authenticator",   Authenticator           )
                   .controller( "LoginController", LoginController         );

            $log.debug( "Bootstrapping from DOM element: `body`" );
            angular.bootstrap( document.getElementsByTagName("body"), [ appName ]);

        });

    });



}( window, head ));
