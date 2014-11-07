(function( require, angular ) {
    "use strict";

    /**
     * Build a `mindspace.logX` module that registers and configures the LogDecorator for $log
     *
     * If custom applications need decorated log entries, simply require `angular-logX`
     * and add `mod.name` to the application's module dependency list (where `mod = require('angular-logX')`).
     */

    define([

          "mindspace/logger/LogDecorator"

    ], function( LogDecorator )
    {
        var moduleName = 'mindspace.logX';

        return angular.module( moduleName , [ ] )
               .config( LogDecorator            );

    });


}( window.require, window.angular ));
