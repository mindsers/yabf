# AbstractApplication (class)

```ts
abstract class AbstractApplication {
  static createInstance<T extends AbstractApplication>(): T

  constructor(injectorService: InjectorService)

  provide<C>(className: InjectionType<C>): void
  provide<C>(className: InjectionClass<C>, dependencies?: InjectionSelector<any>[]): void

  abstract start(): void
  protected abstract buildInstructions(): IBuildInstruction[]
}
```

## Subclasses

- [WebApplication](./web-application.md)

## Description

It provide some of the common behavior that all application have. Ensure that any type of application can use dependency injection.

## Constructor

Initialize `AbstractApplication` instance.

```ts
constructor(injectorService: InjectorService)
```

### Parameters

- `injectorService`: the service that have the responsibility to create and inject objects.

## Methods

## # createInstance()

Create an instance of the application. Automatically inject the YABF dependency injector in the application. If you don't want to use the default injector, you have to overwrite this method.

To correctly use this method you have to implement `buildInstructions()` method below.

```ts
static createInstance<T extends AbstractApplication>(): T
```

### Paramaters

No parameters.

### Returns

An instance of an application. For `WebApplication.createInstance()` you'll get an instance of `WebApplication`.

Maybe TypeScript will type the return value as `AbstractApplication` which is true but not as efficient as we want. To correct this you have to use the generic version like that `WebApplication.createInstance<WebApplication>()`.

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

## # buildInstructions()

Allow you to specify how to build a custom application.

```ts
protected abstract buildInstructions(): IBuildInstruction[]
```

### Parameters

No pramaeters.

### Returns

Return an array of build instructions.

The first instruction must be about the application. Yabf inject the dependencies injector before injecting others of yours.
