# Response

```ts
export class Response {
  data?: any,
  errorCode: number,
  description: string|null

  get contentType(): string
  set contentType(contentType: string)

  constructor(data: any, errorCode = 200, description: string|null = null)

  setHeader(key: string, value: string): void
  getHeader(key: string): string

  send(httpResponse: HttpResponse): void
}
```

## Description

`Response` is a wrapper for the NodeJS `Reponse` object. It helps you build an HTTP response.

You can return `Response` objects in controllers' actions. This is useful when you have to customize the reponse (status code, description...)

## Constructor

Initialize `Response` instance with common params.

```ts
constructor(data: any, errorCode = 200, description: string|null = null)
```

### Parameters

- `data`: the data you want to return to the user
- `errorCode`: an HTTP error code for the response. The default value is [`200`](https://tools.ietf.org/html/rfc2616#section-10.2.1).
- `description`: the response explaination. Give context about the response. It is commonly related to `errorCode`.

## Properties

- `contentType`: indicate in what format is the request data (`JSON`, brut text...)
- `data`: the data you want to return to the user
- `errorCode`: an HTTP error code for the response. The default value is [`200`](https://tools.ietf.org/html/rfc2616#section-10.2.1).
- `description`: the response explaination. Give context about the response. It is commonly related to `errorCode`.

## Methods
## # setHeader()

Add/Update an entry in the header with a given key and value

```ts
setHeader(key: string, value: string): void
```

### Parameters

- `key`: the name of the header field. (for example, `Accept`)
- `value`: the value of the header field.

### Returns

nothing

## # getHeader()

Get an entry in the header with a given key

```ts
getHeader(key: string): string
```

### Parameters

- `key`: the name of the header field. (for example, `Accept`)

### Returns

The value corresponding to the key

## # send()

Apply modification on and execute an HTTP response

```ts
send(httpResponse: HttpResponse): void
```

### Parameters

- `httpResponse`: the HTTP response to update and execute

### Returns

nothing

