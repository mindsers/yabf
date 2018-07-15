import { Request } from '../http/request.class'
import { Response } from '../http/response.class'

export type IAction = (request?: Request) => any|Response
