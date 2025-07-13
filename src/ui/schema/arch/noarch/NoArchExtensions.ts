import { ArchitectureExtensions, ArchitectureExtObj } from "../ArchSchema";

/**
 * No ArchDesigner, it is used as a placeholder for when
 * no architecture has been selected
 * May as well make this a general extensions object
 */
export class NoArchExtensions implements ArchitectureExtensions<any> {
 
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
