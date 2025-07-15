import { ArchitectureCallGraph, ArchitectureDesigner, ArchitectureObject, ArchitectureVisualiser } from "./ArchSchema";


/**
 * Return object that is expected from the mapping
 */
export type ArchContextReturnObj =
  ArchitectureDesigner | ArchitectureCallGraph | ArchitectureVisualiser;


/**
 * An object map from string to function with expected return type
 */
export type ArchUIContextMapping = {
  [key: string]: (o: ArchitectureObject,d: any) => ArchContextReturnObj
}

/**
 * Specifies some sensible defaults that are embedded in
 * the predefined class
 */
export const ArchUIContextDefaults: ArchUIContextMapping = {
  "designer" : (obj: ArchitectureObject, data: any) => (obj
    .getDesigner(data)),
  "visualiser" : (obj: ArchitectureObject, data: any) => (obj
    .getVisualiser(data)),
  "callgraph" : (obj: ArchitectureObject, data: any) => (obj
    .getCallGraph(data)),
}

/**
 * The purpose of this class is to ensure
 * that there is a mechanism in place for user to
 * navigate the different contexts
 * It will inform the outer 
 */
export class ArchitectureUIContext {

  switches: ArchUIContextMapping = ArchUIContextDefaults;
  archObject: ArchitectureObject;
  cursor: string = "designer";

  /**
   * Initialises the architecture object
   */
  constructor(object: ArchitectureObject) {
    this.archObject = object;
  }

  /**
   * This is the current location that the user is in
   */
  getCurrent(): string {
    return this.cursor;
  }

  /**
   * Will move to the group and accept any data
   * that the module could use
   */
  move(name: string, data: any): ArchContextReturnObj | null {

    const ret = this.switches[name](this.archObject, data);
    if(ret) {
      return ret;
    } else {
    
      console.error("Unable to change to location");
      console.error("Are you sure the name is correct?");
      return null;
    }
  }
  
}
