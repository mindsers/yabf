# Request (class)

```ts
export class Request {
  get pathname(): string | undefined
  get querystring(): ParsedUrlQuery
  get method(): HttpMethod
  get headers(): HttpHeaders
  get anchor(): string | undefined
  get body(): Promise<any>
  get isCORS(): boolean

  constructor(private httpRequest: HttpRequest)

  match(pattern: string): boolean
}
```

## Description

It's a wrapper for the `Request` objects from NodeJS API. The router will pass a `Request` to controllers' actions.

## Constructor

Create an instance of `Request`.

```ts
constructor(private httpRequest: HttpRequest)
```

### Parameters

- `httpRequest`: the request to be wrapped

## Properties

- `pathname`: Read only attribute to get the pathname
- `querystring`: Read only attribute to get the querystring as a `ParsedUrlQuery`
- `method`: Read only attribute to check the HTTP methods (or verbs)
- `headers`: Read only attribute to access to all headers entries in HTTP Request
- `anchor`: Readonly atribute to get the current anchor
- `body`: Readonly attribute to get the data used as body for the request
- `isCORS`: Readonly attribute to doade a anadvz

## Methods

## # match()

Tests the resquest URL vs pattern.

```ts
match(pattern: string): boolean
```

### Parameters

- `pattern`: a string pattern

### Returns

A boolean. `true` if `patern` matches the URL, else `false`.
