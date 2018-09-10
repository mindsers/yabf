# WebApplication (class)

```ts
class WebApplication extends Application {
  constructor(injectorService: InjectorService, routerService: RouterService)

  static createInstance(): WebApplication

  declare<C extends Controller>(className: InjectionClass<C>, dependencies: InjectionSelector<any>[] = [])
  start(): void
}
```

The `WebApplication` class extends [`Application` abstract class](application).

## Description

An implementation of `Application` designed for the web. Add support for `Controller`s, routing...

## Constructor

Initialize `ferpection` instance.

```ts
constructor(injectorService: InjectorService, routerService: RouterService)
```
