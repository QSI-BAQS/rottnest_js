import { Services } from "../../../service/Services";
import { ArchitectureCallGraph, ArchitectureDesigner,
  ArchitectureObject, ArchitectureVisualiser } from "./ArchSchema";
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
 * Default data that can be used by the context
 * Is currently selected on NoArch as it will be the first
 * one typically loaded
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
  "runchart"  : (obj: ArchitectureObject, data: any) => (obj
    .getRunChart(data)),
}

/**
 * Standard set of capabilities as outlined
 * by the application
 */
export type ArchStandardCapabilities = "CanZoom"
  | "CanNetwork" | "CanJSON"


/**
 * Concrete answer from the capability query
 */
export enum ArchCapabilityAnswer {
  Yes,
  No,
  Unknown
}

/**
 * Query object that is sent to the capabilities object
 */
export class ArchCapabilityQuery {
  capability: string = '';
  extra?: any = {};

  constructor(capability: string, extra?: any) {
    this.capability = capability;
    this.extra = extra;
  }

  /**
   * Static method for the sake of readability
   */
  static MakeQuery(capability: string, extra?: any) {
    return new ArchCapabilityQuery(capability, extra);
  }

}

/**
 * Result from querying the capability of
 * a capabilities object
 */
export class ArchCapabilityResult {
  result: ArchCapabilityAnswer = ArchCapabilityAnswer.Unknown;
  extra?: any = {};

  constructor(result: ArchCapabilityAnswer, extra?: any) {
    this.result = result;
    this.extra = extra;
  }

  /**
   * Confirms and allows the usage
   */
  static Confirm(extra?: any): ArchCapabilityResult {
    return new ArchCapabilityResult(ArchCapabilityAnswer.Yes, extra);
  }

  /**
   * Denies the usage of it
   */
  static Deny(extra?: any): ArchCapabilityResult {

    return new ArchCapabilityResult(ArchCapabilityAnswer.No, extra);
  }

  /**
   * Unknown status
   */
  static NotKnown(extra?: any): ArchCapabilityResult {
    return new ArchCapabilityResult(ArchCapabilityAnswer.Unknown, extra);
  }
  

  /**
   * Used in if statements and loops to check for confirmation
   */  
  Yes(): boolean {
    return this.result === ArchCapabilityAnswer.Yes;
  }


  /**
   * Used in if statements and loops to check for confirmation
   */  
  No(): boolean {
    return this.result === ArchCapabilityAnswer.No;
  }

  /**
   * Used in if statements and loops to check for confirmation
   */  
  Unknown(): boolean {
    return this.result === ArchCapabilityAnswer.Unknown;
  }
}


/**
 * Object that contains capabilities and may
 * require the frontend (or other components)
 * to negotiate with it
 */
export interface ArchCapabilitiesObject {

  // Capabilitie object will
  queryCapability(query: ArchCapabilityQuery): ArchCapabilityResult;
}

/**
 * UI Meta that will outline the weak refs (strings)
 * and a count of the number of keys outside of default
 */
export type ArchUIMeta = {
  keys: Array<string>
  count: number
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
  helddata: any = {};

  /**
   * Initialises the architecture object, defaults outlined to
   * ensure it knows what component to use
   * WARN: Default object uses quite unsafe instantiation
   */
  constructor(object: ArchitectureObject = new NoArchObject({} as Services),
    
    defaults: ArchUIDefaults = ArchUIDefaultData) {
    this.defaults = defaults;
    this.archObject = object;
  }
  
  /**
   * Gets the tabs that are accessible to the UI
   * Gets the count and tabs
   */
  getTabs(): ArchUIMeta  {
    let count = 0;
    let keys = [];
    for(const s in this.switches) {
      if(s !== 'default') {
        count += 1;
        keys.push(s);
      }
    }
    return { count, keys };
  }

  /**
   * Simple stash where when moving to different
   * view we can provide an object that can describe what
   * actions it can do/any
   */
  setData(data: any) {
    this.helddata = data;
  }

  /**
   * Gets the data from the context
   * Typically given as part of a move or set before a move
   */
  getData(): any {
    return this.helddata;
  }

  /**
   * Used a compatibility method to move
   * between tabs
   * TODO: Need to fix this method
   */
	updateSelectedTab(_idx: number) {
    
		/*
		const tabs = this.state.tabData.tabNames;
		this.state.tabData.selectedTabIndex 
			= idx % tabs.length;
		this.triggerUpdate();*/
	}


  /**
   * Returns the list of the switches
   */
	getSwitches() {
	  return this.switches;
	}


  /**
   * Goes to the default position/home
   */
  getDefault(): ArchContextReturnObj {
    this.cursor = "default";
    return this.switches['default'](this.archObject, {});
  }

  /**
   * Gets the current context that is being access
   */
  getCurrentContext(): ArchContextReturnObj {
    return this.getSwitches()[this.getCurrent()](this.archObject,
      this.helddata);
  }

  /**
   * Sets the current cursor to the elected key
   */
	setCurrent(key: string) {
	  this.cursor = key;
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
  move(name: string, data: any) {
    //const ret = this.switches[name](this.archObject, data);
    this.setData(data);
    if(name) {
      this.setCurrent(name)
    } else {
    
      console.error("Unable to change to location");
      console.error("Are you sure the name is correct?");
    }
  }
  
}
