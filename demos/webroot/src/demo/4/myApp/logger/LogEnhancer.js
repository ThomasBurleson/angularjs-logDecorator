(function(){
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