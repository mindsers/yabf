import { Route } from '../router/route.interface';
import { IAction } from './action.interface';

export interface IController {
  routes: Route[]
  [action: string]: IAction|Route[]
}
