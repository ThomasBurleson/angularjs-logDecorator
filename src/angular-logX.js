(function( require, angular ) {
    "use strict";

    /**
     * Build a `mindspace.logX` module that registers and configures the LogDecorator for $log
     * Also load the ExternalLogger for subsequent require(["mindspace/logger/ExternalLogger"])
     *
     * If custom applications, simply add `mindspace.logX` namespace to the application's module
     * dependency list
     *
     * This module also exposes (via require( <xxx> ) calls the following:
     *
     *   - supplant()
     *   - makeTryCatch()
     *   - ExternalLogger.getInstance()
     *
     */

    require([

          "mindspace/logger/LogDecorator"
        , "mindspace/logger/ExternalLogger"

    ], function( LogDecorator, ExternalLogger )
    {
        var moduleName = 'mindspace.logX';

        angular.module( moduleName , [ ] )
               .config( LogDecorator            );

    });


}( window.require, window.angular ));
