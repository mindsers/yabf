import { IRoute } from '../router/route.interface'
import { IAction } from './action.interface'

export interface IController {
  routes: IRoute[]
  [action: string]: IAction | IRoute[] | any
}
