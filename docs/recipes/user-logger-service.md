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

## What's a scope?

`LoggerService` use scope to display messages. A scope regroup all the information about a group of messages.

A scope is identified thank to its unique namespace. `LoggerService` display the namespace in front of each message it writes.

A namespace should respect the following exemples' format:

- `yabf`
- `yabf:router`
- `http:v2`
- `js:local-storage`

`LoggerService` may work with other namespace formats but we build and test it with this one and we can't guarantee the other will work too.

