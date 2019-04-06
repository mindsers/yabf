# InjectionSelector (interface)

```ts
interface InjectionType<T> {
  identity: InjectionSelector<T>
  useValue?: any
  useClass?: InjectionClass<any>
}
```

## Description

Represents data passed to the injector.

## Properties

- `identity`: **(required)** A reference key (a class, a language symbol, or an `InjectionToken`).
- `useClass`: The class which will be instenciated by the injector.
- `useValue`: A data which will be provided without instenciation.
