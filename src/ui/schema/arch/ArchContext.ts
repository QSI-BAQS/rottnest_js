import { ArchitectureCallGraph, ArchitectureDesigner, ArchitectureObject, ArchitectureVisualiser } from "./ArchSchema";
import { NoArchObject } from "./noarch/NoArch";


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
 * The initial screen that the application will
 * use for your architecture
 */
export type ArchUIDefaults = {
  name: string,
  data: any,
}

/**
 *
 */
export const ArchUIDefaultData = {
  name: 'NoArch',
  data: {}
}

/**
 * Specifies some sensible defaults that are embedded in
 * the predefined class
 */
export const ArchUIContextDefaults: ArchUIContextMapping = {
  "default"    : (obj: ArchitectureObject, data: any) => (obj
    .getDesigner(data)),
  "designer"   : (obj: ArchitectureObject, data: any) => (obj
    .getDesigner(data)),
  "visualiser" : (obj: ArchitectureObject, data: any) => (obj
    .getVisualiser(data)),
  "callgraph"  : (obj: ArchitectureObject, data: any) => (obj
    .getCallGraph(data)),
}

/**
 * The purpose of this class is to ensure
 * that there is a mechanism in place for user to
 * navigate the different contexts
 * It will inform the outer 
 */
export class ArchitectureUIContext {

  defaults: ArchUIDefaults;
  switches: ArchUIContextMapping = ArchUIContextDefaults;
  archObject: ArchitectureObject;
  cursor: string = "designer";

  /**
   * Initialises the architecture object, defaults outlined to
   * ensure it knows what component to use
   */
  constructor(object: ArchitectureObject = new NoArchObject(),
    defaults: ArchUIDefaults = ArchUIDefaultData) {
    this.defaults = defaults;
    this.archObject = object;
  }

  /**
   * Used a compatibility method to move
   * between tabs
   */
	updateSelectedTab(idx: number) {

		/*
		const tabs = this.state.tabData.tabNames;
		this.state.tabData.selectedTabIndex 
			= idx % tabs.length;
		this.triggerUpdate();*/
	}

  /**
   * Goes to the default position/home
   */
  getDefault(): ArchContextReturnObj {
    this.cursor = "default";
    return this.switches['default'](this.archObject, {});
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
