import { Controller } from '../controller/controller.class'
import { InjectionClass } from '../injector/injection-class.type'

export class ControllerInControllerError<C extends Controller, P extends Controller> extends Error {
  constructor(controller: InjectionClass<C>, parentController: InjectionClass<P>) {
    super(`Provide a controller to an other controller is forbidden. (${controller} into ${parentController})`)
  }
}
