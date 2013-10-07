/**
 * Mock Authenticator with promise-return API
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
        /**
         * Mock Authenticator with promise-returning API
         */
        var Authenticator = function( session, $q, $log)
        {
            $log = $log.getInstance( "Authenticator" );

            /**
             * Mock login() service for authenticatator.
             * @returns {Deferred.promise|*}
             */
            var login = function(username, password)
                {
                    var dfd      = $q.defer(),
                        errorMsg = "Bad credentials. Please use a username of 'admin' for this mock logins !";

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
                };

            /**
             * Mock service for logout.
             * @returns {Deferred.promise|*}
             */
            var logout = function()
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
        };

        /**
         * Publish constructor array
         * @see http://solutionoptimist.com/2013/09/30/requirejs-angularjs-dependency-injection/
         */
        return ["session", "$q", "$log", Authenticator];

    });

}());
