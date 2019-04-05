# LoggerService (class)

```ts
abstract class LoggerService {
  output: ILoggerOutput

  constructor()

  registerScope(namespace: string): LogFunction
  log(namespace: string, message: string): void
}
```

## Description

`LoggerService` is used by Yabf to show info/debug message into the standard error output. **It is also available for use in your own app.**

## Constructor

Initialize `LoggerService` instance.

```ts
constructor()
```

### Parameters

No parameters.

## Methods

## # registerScope()

`LoggerService` write messages within a scope. You can register a new scope using this method.

```ts
registerScope(namespace: string): LogFunction
```

### Paramaters

- `namespace`: the identifier of the scope. (e.g. `yabf:logger`)

### Returns

Return a simple log function which writes messages in the predefined scope. [See `LogFunction` for more details](./log-function.md).

## # log()

It is the regular log function of the service.

```ts
log(namespace: string, message: string): void
```

### Parameters

- `namespace`: the identifier of the scope. (e.g. `yabf:logger`)
- `message`: the text that will be displayed

### Returns

The result is pushed to `stderr`. This method returns nothing. `void`
