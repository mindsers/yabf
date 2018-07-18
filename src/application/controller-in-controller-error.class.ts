import { Controller } from '../controller/controller.class'

export class ControllerInControllerError extends Error {
  constructor(controller: Controller, parentController: Controller) {
    super(`Provide a controller to an other controller is forbidden. (${controller} into ${parentController})`)
  }
}
