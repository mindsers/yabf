import { HttpMethod } from './http-method.enum';
import { IAction } from '../controller/action.interface';

export interface Route {
  path: string,
  action: string|IAction,
  methodes: HttpMethod[]
}
