import { IAction } from '../controller/action.interface'
import { HttpMethod } from '../http/http-method.enum'

export interface IRoute {
  path: string,
  action: string|IAction,
  methodes: HttpMethod[]
}
