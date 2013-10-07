(function() {
    "use strict";

    var dependencies = [
        'myApp/utils/supplant',
        'myApp/utils/DateTime'
    ];

    define( dependencies, function( supplant, DateTime )
    {
        var LogDecorator = function( $provide )
            {
                // Register our $log decorator with AngularJS $provider

                $provide.decorator( '$log', [ "$delegate", function( $delegate )
                {
                    // Save the original $log.debug()
                    var debugFn = $delegate.debug;

                    $delegate.debug = function( )
                    {
                        var args    = [].slice.call(arguments),
                            now     = DateTime.formattedNow();

                        args[0] = supplant("{0} - {1}", [ now, args[0] ]);

                        // Call the original with the output prepended with formatted timestamp
                        debugFn.apply(null, args)
                    };

                    return $delegate;
                }]);
            };

        return [ "$provide", LogDecorator ];
    });

})();