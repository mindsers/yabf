# AppConfig (interface)

Represents the configuration options for a [WebApplication](./web-application.md).

```ts
interface IAppConfig {
  server: {
    port: number;
  }
  cors?: {
    activated?: boolean;
    headers?: string[];
    origins: string[];
  }
  assets?: {
    location: string;
  }
  locales?: {
    list?: string[];
    default?: string;
  }
}
```

## Description

You can inject a configuration object in your web application using the key `APP_CONFIG`. This object must follow this interfaces.

### Exemple

```ts
const app = WebApplication.createInstance()
const config: AppConfig = {
  server: {
    port: 3000
  },
  locales: {
    default: 'de',
    list: ['en', 'de', 'fr']
  }
}

app.provide({ provide: APP_CONFIG, useValue: config })

app.start()
```

## Properties

- `server.port`: **(required)** The port number listen by the server. Set to `8080` by default.
- `assests.location`: The path where are stored your assets.
- `locales.list`: Locale list supported by your application. Set to `['en']` by default.
- `locale.default`: Primary locale of your application. Set to the first element of `locales.list` by default.
- `cors.activated`: Set or unset the CORS support for your application. Set to `true` by default.
- `cors.headers`: List of allowed headers.
- `cors.origins`: List of allowed origins.
