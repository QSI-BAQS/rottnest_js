import { ArchitectureExtensions, ArchitectureExtObj } from "../ArchSchema";


/**
 * Superconducting Extension map that will
 * allow the lattice architecture to exten beyond what has been
 * rigidly defined by the interface
 */
export class SuperconductingExtensionMap implements ArchitectureExtensions<any> {

  extensions: Map<string, any> = new Map(); 
  
  getExtension(name: string): ArchitectureExtObj<any> {
    const res = this.extensions.get(name);
    if(res === undefined || res === null) {
      return new ArchitectureExtObj(null);
    } else {
      return new ArchitectureExtObj(res);
    }
  }

  getAllExtensions(): Map<string, any> {
    return this.extensions;
  }
}
