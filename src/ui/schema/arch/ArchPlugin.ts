
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
   * based on the file name on the host system
   */
  static async GetSchemaDefault(url: string) {
    console.log(url);
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/javascript"
      }
    });
    
    const modtext = btoa(await resp.text())
    console.log(modtext);
    const module = await import('data:text/javascript;base64,' + modtext);
    return module;
    
  }

}
