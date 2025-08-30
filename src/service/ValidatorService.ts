import { ArchitectureObject } from "../ui/schema/arch/ArchSchema";
import { ValidationExecutor } from "../vald/Validation";



/**
 * Validator/Error checker that is used for a project
 * Currently it is in-operable but we will need to
 * ensure we have the framework to add this in the future
 */
export class ValidationService {

  valexec: ValidationExecutor;

  /**
   * Construction of the service may require
   * the executor be overloaded to tailor for particular
   * use-cases
   */
  constructor(valexec: ValidationExecutor = new ValidationExecutor()) {
    this.valexec = valexec;
  }

  /**
   * Runs validation through 
   */
  validate(_obj: ArchitectureObject) {
    //NO-OP right now
  }

  /**
   * Gets the buffer from execution the validation executor 
   */
  getBuffers() {
    return this.valexec.getBuffers();
  }
}
