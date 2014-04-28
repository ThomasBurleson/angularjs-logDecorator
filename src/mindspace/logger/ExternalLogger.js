/**
 * @author      Thomas Burleson
 * @date        November, 2013
 *
 * @description
 *
 *      ExternalLogger
 *
 *      Uses LogEnhancer functionality to publish instance of a $log simulator.
 *      A simulator is needed if attempting to log BEFORE bootstrapping and AngularJS $log
 *      injection occurs; or if you want logging external where $log injection is not available.
 *
 */
(function ()
{
    "use strict";

    define([
            "mindspace/logger/LogEnhancer",
            "mindspace/utils/BrowserDetect"
        ],
        function ExternalLogger(LogEnhancer, BrowserDetect)
        {
            /**
             * Determines if the requested console logging method is available, since it is not with IE.
             *
             * @param {Function} method The request console logging method.
             * @returns {object} Indicates if the console logging method is available.
             * @private
             */
            var prepareLogToConsole = function (method)
            {
                var console = window.console,
                    isFunction = function (fn)
                    {
                        return(typeof (fn) == typeof (Function));
                    },
                    isAvailableConsoleFor = function (method)
                    {
                        return console && console[method] && isFunction(console[method]);
                    },
                    logFn = function (message)
                    {
                        if(isAvailableConsoleFor(method))
                        {
                            try
                            {
                                console[method](message);
                            }
                            catch(e)
                            {}
                        }
                    };

                return logFn;
            },
                $log = {
                    log  : prepareLogToConsole("log"),
                    info : prepareLogToConsole("info"),
                    warn : prepareLogToConsole("warn"),
                    debug: prepareLogToConsole("debug"),
                    error: prepareLogToConsole("error")
                };

            // Publish instance of $log simulator; with enhanced functionality
            return new LogEnhancer($log);
        });

})();
