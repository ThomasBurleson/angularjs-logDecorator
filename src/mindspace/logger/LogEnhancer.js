/**
 * LogEnhancer
 *
 * Used within AngularJS to enhance functionality within the AngularJS $log service.
 *
 * @author  Thomas Burleson
 * @website http://www.theSolutionOptimist.com
 *
 */
(function(define){
    "use strict";

    var dependencies          = [
            'mindspace/utils/supplant',
            'mindspace/utils/DateTime',
            'mindspace/utils/BrowserDetect'
        ];

    define( dependencies, function( supplant, DateTime, BrowserDetect )
    {
        var enhanceLogger = function( $log )
        {
            var separator = "::",
                /**
                 * Capture the original $log functions; for use in enhancedLogFn()
                 */
                _$log = (function( $log )
                {
                    return {
                        log   : $log.log,
                        info  : $log.info,
                        warn  : $log.warn,
                        debug : $log.debug,
                        error : $log.error
                    };
                })( $log),
                /**
                 * Chrome Dev tools supports color logging
                 * @see https://developers.google.com/chrome-developer-tools/docs/console#styling_console_output_with_css
                 */
                    colorify  = function( message, colorCSS )
                {
                    var isChrome    = ( BrowserDetect.browser == "Chrome"),
                        canColorize = isChrome && (colorCSS !== undefined );

                    return canColorize ? [ "%c" + message, colorCSS ] : [ message ];
                },
                /**
                 * Partial application to pre-capture a logger function
                 */
                    prepareLogFn = function( logFn, className, colorCSS )
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
                        args    = colorify( supplant.apply( null, args ), colorCSS );

                        logFn.apply( null, args );
                    };

                    // Only needed to support angular-mocks expectations
                    enhancedLogFn.logs = [ ];

                    return enhancedLogFn;
                },
                /**
                 * Support to generate class-specific logger instance with classname only
                 *
                 * @param className Name of object in which $log.<function> calls is invoked.
                 * @param colorCSS Object with CSS style color information for Chrome Dev Tools console log colorizing
                 *
                 * @returns {*} Logger instance
                 */
                    getInstance = function( className, colorCSS, customSeparator )
                {

                    className = ( className !== undefined ) ? className + (customSeparator || separator)  : "";

                    return {
                        log   : prepareLogFn( _$log.log,    className, colorCSS ),
                        info  : prepareLogFn( _$log.info,   className, colorCSS ),
                        warn  : prepareLogFn( _$log.warn,   className, colorCSS ),
                        debug : prepareLogFn( _$log.debug,  className, colorCSS ),
                        error : prepareLogFn( _$log.error,  className )  // NO styling of ERROR messages
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

        return enhanceLogger;
    });

})(define);