(function( require, angular ) {
    "use strict";

    /**
     * Build a `mindspace.logX` module that registers and configures the LogDecorator for $log
     *
     * If custom applications, simply add `mindspace.logX` namespace to the application's module
     * dependency list
     */

    require([

          "mindspace/logger/LogDecorator"

    ], function( LogDecorator )
    {
        var moduleName = 'mindspace.logX';

        angular.module( moduleName , [ ] )
               .config( LogDecorator            );

    });


}( window.require, window.angular ));
