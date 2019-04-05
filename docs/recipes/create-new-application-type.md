# Create a new Application type

For some project you may want to use your own Application type because any of the existing in *YABF* match your requirements. However if you want to use some generic tools provided by *YABF* you can [inherit from `AbstractApplication`](../api/application/abstract-application.md).

Here is a recipe about "How to create a new Application type".

## Import `AbstractApplication`

Create a new file on which you'll create your application class.

```ts
import { AbstractApplication } from 'yabf'

export class CLIApplication extends AbstractApplication {}
```

## Implement `buildInstructions()` method

This method will describe to the generic `createInstance()` method how to create the new application (`CLIApplication` in our case).

`buildInstructions()` returns an array of `IBuildInstruction` (`{ provide: InjectionClass<any>, dependencies: InjectionSelector<any>[] }`). The first element of this array have to be the instruction for your class itself.

```ts
import { AbstractApplication } from 'yabf'

export class CLIApplication extends AbstractApplication {
  protected buildInstructions() {
    return [
      { provide: CLIApplication, dependencies: [] }
    ]
  }
}
```

If you don't provide instruction to build your app, it will throw a `MissingBuildInstruction` error.

## Implement `start()` method

The `start()` method acts like an entrypoint for your application. It is used to "start" the application.


```ts
import { AbstractApplication } from 'yabf'

export class CLIApplication extends AbstractApplication {
  // ...

  start(): void {
    while (true) {
      // ...
    }
  }
}
```

## Inject new dependency

To inject new dependencies, you have to owerwrite the `constructor` and add the instructions in `buildInstructions()` method.

```ts
export class CLIApplication extends AbstractApplication {
  constructor(injector: IDependencyInjectionProvider, private parser: CLIParser) {
    super(injector)
  }

  // ...

  private buildInstructions() {
    return [
      { provide: CLIApplication, dependencies: [CLIParser] },
      { provide: CLIParser, dependency: []}
    ]
  }
}
```

We don't specify `injector` in `buildInstructions` because *YABF* will automatically inject it. You shoud use `buildInstructions()` only for custom dependencies.

To avoid this behavior, you should overwrite `createInstance()` static method.
