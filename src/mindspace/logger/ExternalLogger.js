/**
 * @author      Thomas Burleson, Brian Riley
 * @date        September 20, 2013
 * @description
 *
 *      ExternalLogger
 *
 *      Uses LogEnhancer functionality to publish instance of a $log simulator.
 *      A simulator is needed if attempting to log BEFORE bootstrapping and AngularJS $log
 *      injection occurs; or if you want logging external where $log injection is not available.
 *
 */
(function()
{
    "use strict";

    var dependencies = [
        'mindspace/logger/LogEnhancer'
    ];

    define( dependencies, function( LogEnhancer )
    {
            /**
             * Determines if the requested console logging method is available, since it is not with IE.
             *
             * @param {Function} method The request console logging method.
             * @returns {Boolean} Indicates if the console logging method is available.
             * @private
             */
        var prepareLogToConsole = function( method )
            {
                var console = window.console,
                    isFunction = function( fn )
                    {
                        return (typeof(fn) == typeof(Function));
                    },
                    isAvailableConsoleFor = function(method)
                    {
                        return console && console[method] && isFunction(console[method]);
                    },
                    logFn = function( message )
                    {
                        if ( isAvailableConsoleFor(method) )
                        {
                            try
                            {
                                console[method](message);

                            } catch( e ) { }
                        }
                    };

                return logFn;
            },
            /**
             * Simulate the AngularJS $log, useful for pre-bootstrap logging functionality
             * @type {{log: Boolean, info: Boolean, warn: Boolean, debug: Boolean, error: Boolean}}
             */
            $log = {
                log   : prepareLogToConsole( "log"   ),
                info  : prepareLogToConsole( "info"  ),
                warn  : prepareLogToConsole( "warn"  ),
                debug : prepareLogToConsole( "debug" ),
                error : prepareLogToConsole( "error" )
            };

        // Publish instance of $log simulator; with enhanced functionality

        return new LogEnhancer( $log );
    });

})();