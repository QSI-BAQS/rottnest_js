import { ArchitectureObject } from "../arch/ArchSchema";
import { NoArchObject, NoArchSchema } from "../arch/noarch/NoArch";


/**
 * Uses the NoArchSchema but can be replaced later on
 * with something more useful
 */
export class DefaultArchitectureScheme extends NoArchSchema {

  /**
   * Constructs an architecture when none is available
   */
  static MakeDefaultArch(): ArchitectureObject<any, any> {
    return new NoArchObject();
  }
}

