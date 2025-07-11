import { ArchitectureProject } from "../ArchProject";
import { ArchitectureSerializer } from "../ArchSchema";


/**
 * LatticeSerializer, will serialise the project
 * and deserialize it from a string.
 */
export class LatticeSerializer implements ArchitectureSerializer<any> {
  serialize(obj: ArchitectureProject<any>): string {
      return JSON.stringify(obj);
  }

  deserialize(data: string): ArchitectureProject<any> {
      return JSON.parse(data)
  }
}
