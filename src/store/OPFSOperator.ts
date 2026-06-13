

/**
  * OPFSOperatorFileHandle
  * Maintain the file handle
  */
export class OPFSOperatorFileHandle {

  fileHandle: FileSystemFileHandle;
  fileId: number;

  notAvailable: boolean = false;

  /**
    * OPFSOperatorFileHandle - Holds
    */
  constructor(fileId: number, fileHandle: FileSystemFileHandle) {
    this.fileHandle = fileHandle;
    this.fileId = fileId;
  }
  

  /**
    * Outlines if the file handler is currently inaccessible
    * 
    */
  inaccessible() {
    return this.notAvailable;
  }


  
  
}


/**
  * OPFS Operator
  * Used to write data to the files for caching purposes
  * but to also ensure we can treat this space as a filesystem
  * can be transferred to a proper operating system
  */
export class OPFSOperator {

  // File Handlers
  fileHandlers: Array<OPFSOperatorFileHandle> = [];

  /**
    * OPFS Operator
    * This is a facade for the operations on the opfs system
    */
  constructor() {
    
  }

  createFile(fileName: string) {
    
    const fileHandle = new FileSystemFileHandle();
    fileHandle.createWritable();
    
  }

  writeData() {
    
  }
  
}


/**
  * OPFSCacheOperator
  * Used to ensure that there is a standard interface
  * for all the caches that can be leveraged
  */
export class OPFSCacheOperator {

  rootDirectory: string;

  /**
    * Root Directory required to ensure that
    * it will load and write data to the appropriate spot
    */
  constructor(rootDirectory: string) {
    this.rootDirectory = rootDirectory;
  }

  /**
    * Gets the directory that has been specified
    */
  getDirectory() {
    return this.rootDirectory;
  }
  
}
