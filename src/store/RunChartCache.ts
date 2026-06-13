import { OPFSCacheOperator } from "./OPFSOperator";


const FileNameFormatPrefix = "runchart_cache_id_";
const FileNameFormatSuffix = "_.cache";
const RunChartCacheDirectory = "runchart";


/**
  * RunChart cache to hold the results
  * We will need to be mindful of the maximum
  * capacity of the opfs file itself when caching the results
  */
export class RunChartCache extends OPFSCacheOperator {

  // File References
  fileReferences: Array<string> = [];
  
  constructor() {
    super(RunChartCacheDirectory);
  }
  
  /**
    * Gets the instance of the cache
    * itself and ensures that the 
    */
  static GetInstance() {
    const cache = new RunChartCache()
    return cache;
  }

  /**
    * Convention we will use to
    * hold the data and ensure we are able to display it
    * appropriately and maintain memory requirements
    */
  static FormatNameForFile(filename: string) {
    const finalname =
      FileNameFormatPrefix +
        filename +
      FileNameFormatSuffix;

    return finalname;
  }

  /**
    * FileReferences
    * Get file references
    */
  getFileReferences() {
    return this.fileReferences;
  }


  
  
  
}
