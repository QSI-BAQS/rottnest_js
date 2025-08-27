
/**
 * Architecture Plugin Loader
 * This will be used to construct/load a plugin from disk
 *
 * Given a location, the arch plugin loader will attempt to import
 * the module dynamically.
 *
 */
export class ArchPluginLoader {

  /**
   * Formats the endpoint to be used
   */
  static FormatEndpointURL(archname: string, kind: string, filename: string) {
    return `/plugin/${archname}/${kind}/${filename}`;
  }

  /**
   * Gets the schema from the backend
   */
  static async GetSchema(archname: string) {
    return await import(ArchPluginLoader.FormatEndpointURL(archname,
      "schema", "schema.js"));
  }

  /**
   * The current version where we will retrieve it
   * based on the file name on teh host system
   */
  static async GetSchemaDefault(url: string) {
    return await import(url);
  }
  
  
}
