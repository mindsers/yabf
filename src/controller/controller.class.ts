import { IRoute } from '../router/route.interface'

import { IAction } from './action.interface'

export abstract class Controller {
  [action: string]: IAction | IRoute[] | any

  abstract get routes(): IRoute[]
}
