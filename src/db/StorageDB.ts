
import localforage from "localforage"; 


/*
 * We are outlining what is to be contained inside the database
 * * Plugin JS files (* Important)
 * * Cached results from computation of the grid and other things
 * 
 * ---- Name spaces
 *
 * * plugins/* - Any key prefixed with 'plugins/' is considered
 *      by the plugin system
 * 
 *
 */
type SchemaPrefixMap = {
  [key: string]: string
}
 
export const StorageDBSchemaPrefix: SchemaPrefixMap = {
  plugins: 'plugins/',
  
}


/**
 * StorageDB is used to interface with indexedDB that
 * will hold onto different elements
 * that are relevant for the frontend
 *
 * This will use localForage 
 */
export default class StorageDB {

  // Storage name for the data base
  static StorageDBName: string = "RottnestDB";
  static dbContext: StorageDB | null = null;

  static GetInstance(): StorageDB {
    let storage = new StorageDB();
    localforage.config({
      driver: [localforage.INDEXEDDB],
      name: StorageDB.StorageDBName
    });
    
    
    
    return storage;
  }

  /**
   * Formats the key based on a schema that has been defined
   */
  static FormatKey(schema: SchemaPrefixMap, kind: keyof SchemaPrefixMap,
    key: string) {
    const prefix = schema[kind];
    return `${prefix}${key}`;
  }

  /**
   * Sets the plugin to the stored and persisted
   */
  async setPlugin(plgkey: string, plugin: string) {
    const key = StorageDB.FormatKey(StorageDBSchemaPrefix, 'plugins', plgkey);
    return localforage.setItem(key, plugin);
  }

  /**
   * Gets the plugin based on the key
   */
  async getPlugin(plgkey: string) {
    const key = StorageDB.FormatKey(StorageDBSchemaPrefix, 'plugins', plgkey);
    return localforage.getItem(key);
  }
  
}
