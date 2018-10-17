# Route (interface)

```ts
interface IRoute {
  path: string,
  action: string|IAction,
  methodes: HttpMethod[]
}
```
## Description

Represents a route: a single endpoint. A [`Controller`](../controller/controller.md) contains a list of routes.

### Exemple

```ts
export class AController extends Controller {
  get routes(): Route[] {
    return [{ path: 'home', action: 'homeAction', methods: [HttpMethod.GET] }]
  }
}
```

## Properties

- `path`: The path of the endpoint
- `actions`: The name or an instance of the linked route.
- `methods`: List of allowed methods.
