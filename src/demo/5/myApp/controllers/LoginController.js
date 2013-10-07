/**
 * Simple LoginController using Authenticator service
 *
 * @author Thomas Burleson
 * @date   Oct, 2013
 * @url    http://www.TheSolutionOptimist.com
 *
 */
(function()
{
    "use strict";

    var dependencies = [
        'myApp/utils/supplant'
    ];

    define( dependencies, function( supplant )
    {
        var LoginController = function( authenticator, $scope, $log )
        {
            $log = $log.getInstance( "LoginController", "color:#c44550; font-size:1.2em; background-color:#d3ebaa;" );

            var onLogin = function()
                {
                    $log.debug( supplant( "login( `{userName}` )", $scope ) );

                    authenticator
                        .login( $scope.userName, $scope.password )
                        .then(
                            function (result)
                            {
                                $log.debug( supplant( "login_onResult( `{sessionID}` )", result) );

                                $scope.hasError = false;
                                $scope.errorMessage = '';
                            },
                            function (fault)
                            {
                                $log.debug( supplant("login_onFault( `{0}` )", [fault]) );

                                $scope.hasError = true;
                                $scope.errorMessage = fault;
                            }
                        );
                };

                $scope.login    = onLogin;
                $scope.userName = '';
                $scope.password = '';

                $scope.hasError = false;
                $scope.errorMessage = '';
        };

        return [ "authenticator", "$scope", "$log", LoginController ];

    });

}());
