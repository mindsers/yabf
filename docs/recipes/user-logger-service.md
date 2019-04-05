# How to use LoggerService?

`LoggerService` is used in *YABF* but you can also ise it.

## Import `LoggerService`

As `LoggerService` is a service provided by *YABF*, you don't have to register it with the `provide` method. You can use it as dependency of your service or controller.

**For a controller:**

```ts
const app = WebApplication.createInstance()
app.declare(YourController, [LoggerService])

...

class YourController extends Controller {
  constructor(private loggerService: LoggerService) {
    super()
  }
}
```

**For a service:**

```ts
const app = WebApplication.createInstance()
app.provide(YourService, [LoggerService])

...

class YourService {
  constructor(private loggerService: LoggerService) {}
}
```

Of course, this method works also for [the other children of `AbstractApplication`.]((./create-new-application-type.md))
