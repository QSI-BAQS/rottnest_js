import { ArchitectureObject, ArchitectureSchema } from "../arch/ArchSchema";
import { NoArchSchema } from "../arch/noarch/NoArch";


/**
 * RottnestApplicationState that will hold onto
 * the schema and object currently selected
 * It will also have access to the globals required as part of construction
 */
export class RottnestArchitectureState {
	architectureSchema: ArchitectureSchema = new NoArchSchema()
	architectureObject: ArchitectureObject | null = null;
}

/**
 * RottnestApplicationState, holds onto all the data
 * that the container will need to use to do its job
 */
export class RottnestApplicationState {
  architectureState: RottnestArchitectureState;

  constructor() {
    this.architectureState = new RottnestArchitectureState();
  }
}
