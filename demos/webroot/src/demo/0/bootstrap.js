/**
 *  Use aysnc script loader, configure the application module (for AngularJS)
 *  and initialize the application ( which configures routing )
 *
 * @author Thomas Burleson
 * @date   Oct, 2013
 * @url    http://www.TheSolutionOptimist.com
 *
 */
 (function( window, head ) {
    "use strict";

    head.js(

      { angular   : "/assets/vendor/angular/angular.js" },
      { supplant  : "/src/demo/0/utils/supplant.js" }

    )
    .ready( "ALL", function() {

    /**
     * Mock Authenticator with promise-returning API
     */
    var Authenticator = function( session, $q, $log)
        {
                /**
                 * Mock login() service for authenticatator.
                 * @returns {Deferred.promise|*}
                 */
            var login = function(username, password)
                {
                    var dfd      = $q.defer(),
                        errorMsg = "Bad credentials. Please use a username of 'admin' for this mock login !";

                    $log.debug( supplant("login( `{0}` )", [username]) );

                    if( (username != "admin") && (password != "secretPassword") )
                    {
                        $log.debug( supplant( "login_onFault( `{0}` )", [errorMsg]) );
                        dfd.reject( errorMsg );
                    }
                    else
                    {
                        $log.debug( supplant("login_onResult(username = {0}, password = {1})", [username, password]) );

                        session.sessionID = "SESSION_83732";
                        session.username = username;

                        dfd.resolve(session);
                    }

                    return dfd.promise;
                },
                /**
                 * Mock service for logout.
                 * @returns {Deferred.promise|*}
                 */
                logout = function()
                {
                    var dfd = $q.defer();

                    $log.debug("logout()");

                    session.sessionID = null;
                    dfd.resolve();

                    return dfd.promise;
                };

            return {
                login : login,
                logout: logout
            };
        },
        /**
         * LoginController used with the login template
         */
        LoginController = function( authenticator, $scope, $log )
        {
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
        },
        appName = "myApp.Application";

        /**
     * Start the main application
     * We manually start this bootstrap process; since ng:app is gone
     * ( necessary to allow Loader splash pre-AngularJS activity to finish properly )
     */

    angular.module(     appName,             [ ]             )
           .value(      "session",           { sessionID : null })
           .factory(    "authenticator",     ["session", "$q", "$log", Authenticator]   )
           .controller( "LoginController",   [ "authenticator", "$scope", "$log", LoginController ] );

    angular.bootstrap( document.getElementsByTagName("body"), [ appName ]);

    });



}( window, head ));
