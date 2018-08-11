import { IRoute } from '../router/route.interface'

import { IAction } from './action.interface'
import { IController } from './controller.interface'

export abstract class Controller implements IController {
  get routes(): IRoute[] {
    return []
  }
}
