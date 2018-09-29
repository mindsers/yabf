# Controller (class)

```ts
abstract class Controller {
  [key: string]: IAction | IRoute[] | any

  abstract get routes(): IRoute[]
}
```

## Description

A base controller. All controllers should inherit from this class.

## Properties

- `routes`: a readonly property which returns [the routes](../router/route.md) handle by the controller

## Methods

## # Your custom controller's actions

You can implement custom controller's actions to handle requests. This *actions* will accept a [request](../http/request.md) and return a [response](../http/response.md) or any other data.

If your custom action returns another data type, it'll be automatically wrapped in a [Response](../http/response.md) object with default values (`errorCode` set to 200).

### Examples

```ts
indexAction(request: Request): Response {
  return new Response({ text: 'I am a test' }, 201)
}
```

or

```ts
customAction(request: Request): string {
  return '2be || !2be'
}
```
