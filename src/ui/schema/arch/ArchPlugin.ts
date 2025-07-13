import { ArchitectureSchema } from "./ArchSchema";


/**
 * ArchPlugin object, will represent
 * the 
 */
export class ArchPlugin {

  name: string;
  schema: ArchitectureSchema | null;

  /**
   * Constructs an ArchPlugin object that will
   * also have a name that refers to what kind of
   * plugin it is.
   * Name will be used to match it up to the backend identifiers
   */
  constructor(name: string, schema: ArchitectureSchema | null) {
    this.name = name;
    this.schema = schema;
  }

  /**
   * Checks to see if the plugin contains a schema
   * that can then construct object
   */
  didLoad(): boolean {
    return this.schema !== null;
  }

  /**
   * Gets the name of the plugin
   */
  getName(): string {
    return this.name;
  }

  /**
   * Will retrieve the schema that the main
   * application can use
   * null if it did not load correctly
   */
  getSchema(): ArchitectureSchema | null {
    return this.schema;
  }
}


/**
 * Architecture Plugin Loader
 * This will be used to construct/load a plugin from disk
 *
 * Given a location, the arch plugin loader will attempt to import
 * the module dynamically.
 *
 */
export class ArchPluginLoader {

  path: string;
 
  constructor(path: string) {
    this.path = path;
  }

  /**
   * Attempts to load the architecture plugin
   */
  loadPlugin(): ArchPlugin {

    return null;
  }

  
  
}
