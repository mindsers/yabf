# How to use LoggerService?

`LoggerService` is used in *YABF* but you can also ise it.

## Import `LoggerService`

As `LoggerService` is a service provided by *YABF*, you don't have to register it with the `provide` method. You can use it as dependency of your service or controller.

**For a controller:**

```ts
const app = WebApplication.createInstance()
app.declare(YourController, [LoggerService])

// ...

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

// ...

class YourService {
  constructor(private loggerService: LoggerService) {}
}
```

Of course, this method works also for [the other children of `AbstractApplication`.](./create-new-application-type.md)

## What's a scope?

`LoggerService` use scope to display messages. A scope regroup all the information about a group of messages.

A scope is identified thank to its unique namespace. `LoggerService` display the namespace in front of each message it writes.

A namespace should respect the following exemples' format:

- `yabf`
- `yabf:router`
- `http:v2`
- `js:local-storage`

The `:` separator works like an ancestor/child delimitator.

`LoggerService` may work with other namespace formats but we build and test it with this one and we can't guarantee the other will work too.

## Filtering messages

Namespaces are filterable.

### How to show debug messages?

`LoggerService` is compatible with the *debug npm package* used by other project like *ExpressJs*. You have to use the same environment variable to activate log messages.

By default this variable doesn't exist, so no messages are shown. Set it to '*' to show all message.

```bash
export $DEBUG=*
```

### How to filter debug messages?

Sometimes you don't want to overwelmed yourself with all the log messages of your application. Namespaces are filterable.

To display messages from a specific part of your application, use its specific namespace as a filter:

```bash
export $DEBUG=yabf:router
```

To display messages from a specific part of your application *and its children*, use a wildcard (`*`) in the filter:

```bash
export $DEBUG=yabf:router:*
```

To display messages from *several* specific parts of your application, use several namespace filters separated by a coma (`,`):

```bash
export $DEBUG=yabf:router:*,yabf:controller
```

To *hide* messages from a specific part of your application, use the negative indicator (`-`) in filter:

```bash
export $DEBUG=*,-yabf:controller
```

Be aware that the negative filters will always considered as priority filters. The following example work the exact same way than the one above.

```bash
export $DEBUG=-yabf:controller,*
```

## Full example

*In JS:*

```ts
const app = WebApplication.createInstance()
app.declare(YourController, [YourService, LoggerService])
app.provide(YourService, [LoggerService])

// ...

class YourController extends Controller {
  constructor(private yourService: YourService, private loggerService: LoggerService) {
    super()

    const log = this.loggerService.registerScope('your-app:your-controller')

    log('Controller successfully started')
  }
}

// ...

class YourService {
  constructor(private loggerService: LoggerService) {
    this.loggerService.registerScope('your-app:your-service')
  }

  action(path: string) {
    // ...
    this.loggerService.log('your-app:your-service', `New path ("${path}") processed in action`)
  }
}
```

*In Bash:*

```bash
$ DEBUG=* node ./your-app.js
yabf:router GET / +0ms
your-app:your-service New path ("/") processed in action +0ms
your-app:your-controller Controller successfully started +0ms
your-app:your-service New path ("/") processed in action +10ms
```

or

```bash
$ DEBUG=*,-your-app:your-service:* node ./your-app.js
yabf:router GET / +0ms
your-app:your-controller Controller successfully started +0ms
```
