# Application's children should implements createInstance method

According to the API documentation `Applcation` haven't `createInstance` method. So, why can we get a "The static factory method "createInstance" haven't been created in class *C*. This behavior will be depracated and removed in future version." ?

The truth is that every child of `Application` should have one. We want to ensure that all application work mostly the same way and provide stability in Yabf API. Due to TypeScript limitation, we can't add `createInstance` static method as an abstract in `Application`.

So to reach our goal (Ensure that all application work mostly the same way), we manually check if a child implements the `createInstance` method. Due to its manual characteristic, this check have specific aspects:

- The warning is throwned only at runtime
- The check occurs only if you implements the Application's child class

## How to implements `creacteInstance`

To help you implements this static method and shut down the warning, here is a sample from `WebApplication` implementation :

```ts
static createInstance(): WebApplication {
  const injector = InjectorService.getMainInstance()
  const app = injector.get(WebApplication)

  if (app != null) {
    return app
  }

  injector.provide(WebApplication, [InjectorService, RouterService])
  injector.provide(RouterService, [InjectorService])

  return injector.get(WebApplication) as WebApplication
}
```
