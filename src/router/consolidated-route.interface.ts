import { IAction } from '../controller/action.interface'
import { IRoute } from './route.interface'

export interface IConsolidatedRoute extends IRoute {
  action: IAction
}
