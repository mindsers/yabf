import { Route } from './route.interface';
import { IAction } from '../controller/action.interface';

export interface ConsolidatedRoute extends Route {
  action: IAction
}
