# WebApplication (class)

```ts
class WebApplication extends Application {
  constructor(injectorService: InjectorService, routerService: RouterService)

  static createInstance(): WebApplication

  provide<C>(className: InjectionType<C>): void
  provide<C>(className: InjectionClass<C>, dependencies?: InjectionSelector<any>[]): void
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

### Parameters

- `injectorService`: the service that have the responsibility to create and inject objects.
- `routerService`: the service that have the responsibility to resolve routes and call right controllers.

## Methods
## # provide()

Register a class `C` in the application to be used (created and injected) later.

```ts
provide<C>(className: InjectionType<C>): void
provide<C>(className: InjectionClass<C>, dependencies?: InjectionSelector<any>[]): void
```

### Parameters

- `className`: the class that will be registred. Typically a constructor (`Class`) or a configuration object (`{ identity: Class, useClass: Class }`).
- `dependencies`: An array of constructor that wil be injected in the future instance.

### Returns

`void`: This method return nothing.

## # declare()

Register a controller inside of the application. Work as provide method but registered classes are not in singleton pattern.

```ts
declare<C extends Controller>(className: InjectionClass<C>, dependencies: InjectionSelector<any>[] = [])
```

### Parameters

- `className`: the class that will be registred. Typically a constructor (`Class`) or a configuration object (`{ identity: Class, useClass: Class }`).
- `dependencies`: An array of constructor that wil be injected in the future instance.

### Returns

`void`: This method return nothing.

## # start()

Launch the application. This method acts like a classical `main` function.

### Paramters

No parameters.

### Returns

`void`: This method return nothing.

## # createInstance()
