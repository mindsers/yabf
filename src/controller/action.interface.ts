import { Response } from '../http/response.class';
import { Request } from '../http/request.class';

export interface IAction {
  (request?: Request): any|Response
}
