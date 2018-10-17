# InjectionToken (class)

```ts
class InjectionToken<T> {}
```

## Description

Allows to create a reference key to provide value using the injector. In classic cases, the reference is also the value: a JavaScript class like `WebApplication`.

But in some cases you don't have this key. So, `InjectionToken` can be a key to provide your value.


```ts
const options = { value: 'A' }
const OPTION_TOKEN = new InjectionToken<any>()

app.provide({ provide: OPTION_TOKEN, useValue: options })

const opt = app.get(OPTION_TOKEN) // opt === options
```

You can use the generic type to let the compiler know what is the type returned by the injector.
