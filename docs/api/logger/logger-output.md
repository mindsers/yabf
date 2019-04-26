# ILoggerOutput (interface)

```ts
interface ILoggerOutput {
  write(message: string): void
}
```

## Description

This interface represents an object that can actually be used to catch log messages. `LoggerService` send its formatted message to an intance of `ILoggerOutput`.

It is a "contract" to work w/ `LoggerService`.

## Methods

## # write()

The method used to display text (debug messages, etc.)

```ts
write(message: string): void
```

### Paramaters

- `message`: the text that will be displayed

### Returns

No return value.
