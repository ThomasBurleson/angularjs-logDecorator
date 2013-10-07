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

    var dependencies = [    ];

    define( dependencies, function( )
    {
        var LoginController = function( authenticator, $scope, $log )
        {
            $log = $log.getInstance( "LoginController", "color:#c44550; font-size:1.2em; background-color:#d3ebaa;" );

            var onLogin = function()
                {
                    $log.debug( "login( `{userName}` )", $scope );

                    authenticator
                        .login( $scope.userName, $scope.password )
                        .then(
                            function (result)
                            {
                                $scope.hasError     = false;
                                $scope.errorMessage = '';
                                $scope.sessionID    = result.sessionID;

                                $log.debug( "login_onResult( `{sessionID}` )", result );

                            },
                            function (fault)
                            {
                                $log.debug( "login_onFault( `{0}` )", [fault] );

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
