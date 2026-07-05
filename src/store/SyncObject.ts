/**
  * Outlines the state of the layout
  */
export type SyncStateLayout = {
  data: any,
  hash: string,
  set: boolean
}

/**
  * Syncs the architecture
  * This is to ensure that the architecture module itself
  * is identified and synchronised
  */
export type SyncStateArchitecture = {
  data: any,
  hash: string,
  set: boolean,
};

/**
  * Executable to be saved
  * 
  */
export type SyncStateExecutable = {
  data: any,
  hash: string,
  set: boolean,
}

/**
  * Type for the runchart to
  * be synchronised between the backend
  */
export type SyncStateRunChart = {
  data: any,
  hash: string,
  set: boolean,
}

export const LAYOUT_KEY = 'layout';
export const ARCHITECTURE_KEY = 'architecture';
export const EXECUTABLE_KEY = 'executable';
export const RUNCHART_KEY = 'runchart';
export const APPENDSTATE_KEY = 'appendState';

/**
  * This object is used to maintain
  * hashes of the objects on the frontend
  *
  * With this type, we should have a way to emit a simple
  * scalar/simple entry form as to not pollute the backend with data
  * 
  */
export type RottnestSyncState = {
  timestamp: number,
  [LAYOUT_KEY]: SyncStateLayout,
  [ARCHITECTURE_KEY]: SyncStateArchitecture,
  [EXECUTABLE_KEY]: SyncStateExecutable,
  [RUNCHART_KEY]: SyncStateRunChart,
  [APPENDSTATE_KEY]: RottnestAppendSyncState,
}

/**
  * AppendSyncState
  */
export type RottnestAppendSyncState = {
  length: number,
  enabled: boolean
}

/**
  * This will hold the hash of the layout
  */
export type SyncStateLayoutDescriptor = {
  hash: string,
}

/**
  * This will hold the hash of the architecture
  */
export type SyncStateArchitectureDescriptor = {
  hash: string,
};

/**
  * Descriptor for the executable
  * Ensuring that the data is held - May be out of date
  */
export type SyncStateExecutableDescriptor = {
  hash: string,
}

/**
  * Descriptor for the runchart
  * Will be holding a hash of a runchart descriptor
  */
export type SyncStateRunChartDescriptor = {
  hash: string,
}

/**
  * This object is used to pass to the backend
  * and only contain descriptive information rather than
  * concrete information about frontend objects
  *
  * This means the layout and rundata information would be omitted
  * but their hashes will be contained
  *
  */
export type RottnestSyncStateDescriptor = {
  timestamp: number,
  layout: SyncStateLayoutDescriptor,
  architecture: SyncStateArchitectureDescriptor,
  executable: SyncStateExecutableDescriptor,
  runchart: SyncStateRunChartDescriptor
}

/**
  * Synchronisation Meta Object
  * This is used to maintain some description around
  * what kind of operations to perform
  */
export type SyncMetaObject = {
  namespaceKey: string,
  syncWriteEnabled: boolean,
  syncWriteSpaceKey: string,
  syncAppendEnabled: boolean,
  syncAppendKeyPrefix: string,
  syncAppendCount: number,
  timestamp: number
}

/**
  * Synchronisation Object
  * This is the complete or large writable objects
  */
export type SyncObject<T> = {
  timestamp: number,
  data: T
}

/**
  * Synchronisation Append Object
  * This is focused on append oriented operations
  */
export type SyncAppendObject<T> = {
  data: T
}

/**
  * Initialisation configuration type
  * That will be used to set up a storage solution
  * It isn't necessary but it is advisable
  */
export type SyncInitConfig = {
  writable: boolean,
  appendable: boolean,
  storageKey: string,
}

/**
  * SyncStateOperations
  * This will contain a set of operations that will
  * support the construction of the sync state objects
  */
export class SyncStateOperations {

  /**
    * Zeroes out the sync meta object
    * that will be used to create a simple initialisation
    * that then can be modified
    */
  static zeroSyncMetaObject() {
    return {
      namespaceKey: '',
      syncWriteEnabled: true,
      syncWriteSpaceKey: '',
      syncAppendEnabled: true,
      syncAppendKeyPrefix: '',
      syncAppendCount: 0,
      timestamp: 0,
    }
  }

  /**
    * Constructs a new meta object
    * that will be written to local storage and allow for resumable
    * states on refreshes and crashed
    */
  static newSyncMetaObject(config: SyncInitConfig) {
    const newMeta = this.zeroSyncMetaObject();

    newMeta.namespaceKey = config.storageKey;
    newMeta.syncAppendKeyPrefix = config.storageKey;
    newMeta.syncAppendEnabled = config.appendable;
    newMeta.syncWriteEnabled = config.writable;
    newMeta.syncWriteSpaceKey = config.storageKey;
    newMeta.syncAppendCount = 0;
    newMeta.timestamp = new Date().getTime();

    return newMeta;
  }

  /**
    * Creates a new synchronisation append object
    * that can be written to the append segment
    */
  static newSyncAppendObject<T>(obj: T) {
    return {
      data: obj
    }
  }

  /**
    * Creates a new synchronisation object
    * that can be written
    */
  static newSyncObject<T>(obj: T) {
    return {
      timestamp: new Date().getTime(),
      data: obj
    }
  }

  /**
    * ZeroState that can be constructed
    * This is to run the fields into 0, useful for initialisation
    */
  static zeroState(): RottnestSyncState {
    return {
      timestamp: new Date().getTime(),
      layout: this.zeroEntry(),
      architecture: this.zeroEntry(),
      executable: this.zeroEntry(),
      runchart: this.zeroEntry(),
      appendState: this.zeroAppendEntry(),
    }
  }

  /**
    * Append Entry
    * This is used for initialisation
    */
  static zeroAppendEntry() {
    return {
      prefix: '',
      length: 0,
      enabled: false
    };
  }

  /**
    * ZeroEntry that can be constructed
    * This is to run the fields into 0, useful for initialisation
    */
  static zeroEntry() {
    return {
      data: {},
      hash: '',
      set: false,
    }
  }

  /**
    * Creates a state that may be partial
    * or complete - Based on the information given
    */
  static newState(entrySet: Map<string, FieldStatePair>) {
    const state: RottnestSyncState = this.zeroState();

    for(const key of entrySet.keys()) {
      const [fkey, entry] = entrySet.get(key)!;
      state[fkey] = entry;
    }
    return state;
  }

}

/**
  * EntryKind
  * Used to specify the pairing that will be associated
  */
export type FieldStatePair = [typeof ARCHITECTURE_KEY,  SyncStateArchitecture]
  | [typeof EXECUTABLE_KEY, SyncStateExecutable]
  | [typeof LAYOUT_KEY, SyncStateLayout]
  | [typeof RUNCHART_KEY, SyncStateRunChart]
