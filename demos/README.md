### Setup

*  Use Bower to update the vendor libraries
*  Start WebStorm webserver (see webserver configuration illustration for setup)
*  Browse `http://localhost:8000/`
*  Select a demo to run
*  Open Dev tools to view the console log; when the Login button is selected!

To update your dependent javascript libraries used by the demo applications:

```
cd ./demos/build; bower install
```

### About the Demos

![Demo Snapshot](http://solutionoptimist.com/wp-content/uploads/2013/10/logEnhancer_large2.jpg "Demo Snapshot")

* Demo 0 : Application with mock login; using `Authenticator`, `LoginController` and standard `$log`
* Demo 1 : Modifications to use AngularJS **Decorator** (without RequireJS `define()`)
* Demo 2 : Modifications to use **RequireJS**
* Demo 3 : Modifications to use `LogEnhancer` class with `LogDecorator`
* Demo 4 : Modifications to use `$log.getInstance()` with classNames
* Demo 5 : Use of `angular-logDecorator` plugin (installed with Bower)
