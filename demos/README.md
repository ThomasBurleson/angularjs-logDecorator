### Setup

*  Use Bower to update the vendor libraries
*  Start WebStorm webserver
*  Browse `http://localhost:8000/`
*  Select a demo to run
*  Open Dev tools to view the console log; when the Login button is selected!

To update your the dependent javascript libraries used by the demo applications:

```
cd ./demos/build; bower install
```

### About the Demos

* Demo 0 : Application with mock login; using `Authenticator`, `LoginController` and standard `$log`
* Demo 1 : Modifications to use AngularJS **Decorator** (without RequireJS `define()`)
* Demo 2 : Modifications to use **RequireJS**
* Demo 3 : Modifications to use `LogEnhancer` class with `LogDecorator`
* Demo 4 : Modifications to use `$log.getInstanc()` with classNames
* Demo 5 : Modifications to support color CSS in console log
