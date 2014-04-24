/**
 * LogDecorator
 *
 * Used within AngularJS to decorate/enhance the AngularJS $log service.
 *
 * @author  Thomas Burleson
 * @website http://www.theSolutionOptimist.com
 *
 */
(function() {
    "use strict";

    var dependencies = [
        'mindspace/logger/LogEnhancer'
    ];

    define( dependencies, function( enhanceLoggerFn )
    {
        var LogDecorator = function( $provide )
            {
                // Register our $log decorator with AngularJS $provider

                $provide.decorator( '$log', [ "$delegate", function( $delegate )
                {
                    // NOTE: the LogEnhancer module returns a FUNCTION that we named `enhanceLoggerFn`
                    //       All the details of how the `enhancement` works is encapsulated in LogEnhancer!

                    enhanceLoggerFn( $delegate );

                    return $delegate;
                }]);
            };

        return [ "$provide", LogDecorator ];
    });

})();
