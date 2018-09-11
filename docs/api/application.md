# Application (class)

```ts
abstract class Application {
  constructor(injectorService: InjectorService)

  provide<C>(className: InjectionType<C>): void
  provide<C>(className: InjectionClass<C>, dependencies?: InjectionSelector<any>[]): void

  abstract start(): void
}
```

## Subclasses

- [WebApplication](./web-application.md)

## Description

It provide some of the common behavior that all application have. Ensure that any type of application can use dependency injection.

> Due to TypeScript limitation, we can't add `createInstance` static method as an abstract in `Application`. However, children of `Application` should implement their own `static createInstance(): ChildApplication` to ensure consistency and compatibility. So, `Application` manually check if a child implements this method and throw a warning at runtime if not. For more informations, read [Application's children should implements createInstance method](../application-should-have-createinstance-method.md)

## Constructor

Initialize `Application` instance.

```ts
constructor(injectorService: InjectorService)
```

### Parameters

- `injectorService`: the service that have the responsibility to create and inject objects.

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

This method return nothing. `void`

## # start()

**Need to be implemented in child class**. Launch the application. Child class have to explain here how to start the program just like a classical `main` function.

### Paramters

No parameters.

### Returns

This method return nothing. `void`
