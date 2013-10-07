(function(){
    "use strict";

    var dependencies = [
        'myApp/utils/DateTime',
        'myApp/utils/supplant'
    ];

    define( dependencies, function( DateTime, supplant )
    {
        var enchanceLogger = function( $log )
            {
                // Save the original $log.debug()
                var debugFn = $log.debug;

                $log.debug = function( )
                {
                    var args    = [].slice.call(arguments),
                        now     = DateTime.formattedNow();

                    // prepend a timestamp to the original output message
                    args[0] = supplant("{0} - {1}", [ now, args[0] ]);

                    // Call the original with the output prepended with formatted timestamp
                    debugFn.apply(null, args)
                };

                return $log;
            };

        return enchanceLogger;
    });

})();