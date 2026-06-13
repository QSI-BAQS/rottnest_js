import { RottnestSyncState } from "./SyncObject";
import { SyncStoreOperations, LocalStorageOperations } from "./SyncStoreInterface";

export type StateStorageKind = "localstorage" | "opfs";

/**
  * Options that can be selected
  * for the storage configuration
  */
export const StateStorageOption = {
  StorageKind: {
    LocalStorage: "localstorage" as StateStorageKind,
    OPFS: "opfs" as StateStorageKind,
  },
  Operations: {
    LocalStorage: LocalStorageOperations,
  }
  
};

/**
  * StateStorageConfig
  * Used to outline what storage device and additional
  * information needed for use
  */
export type StateStorageConfig = {
  kind: StateStorageKind,
  operations: SyncStoreOperations,
}

/** Specifies the storage default config */
export const StateStorageDefaultConfig: StateStorageConfig = {
  kind: StateStorageOption.StorageKind.LocalStorage,
  operations: StateStorageOption.Operations.LocalStorage,
  
}

/** Object should be a singleton, not something to be duplicated */
const DuplicateInstanceErrorMessage =
  "Attempting to duplicate the instance of StateStorage";

/**
  *
  * StateStorage
  * Is used to write to the a storage medium for the application
  */
export class StateStorage {

  config: StateStorageConfig = StateStorage.DefaultConfig();
  static #instance: StateStorage | null = null;

  /**
    * constructor for state storage
    * Used to setup the configuration and what operations to use
    */
  constructor(config: StateStorageConfig | null = null) {
    if(StateStorage.#instance !== null) {
      throw new Error(DuplicateInstanceErrorMessage)
    } else {
      if(config !== null) {
        this.config = config;
      }
    }
  }

  /**
    * Gets the instance of the state storage
    */
  static GetInstance(config: StateStorageConfig | null = null): StateStorage {
    if(StateStorage.#instance === null) {
      StateStorage.#instance = new StateStorage(config);
    }
    return StateStorage.#instance;
  }

  /**
    * Gets the default config
    * This is used internally for GetInstance when a config is not
    * specified
    */
  static DefaultConfig(): StateStorageConfig {
    return StateStorageDefaultConfig;
  }

  /**
    * Sets the configuration object
    * That can be used to dictate the write and read operations
    */
  setConfig(config: StateStorageConfig) {
    this.config = config;
  }

  /**
    * Gets the configuration object
    * This can be used to know what it is operating on
    */
  getConfig(): StateStorageConfig {
    return this.config;
  }

  /**
    * Writes to the target
    * May need to be re-evaluated later on
    */
  write(target: string, data: RottnestSyncState) {
    this.config.operations.write(target, data);
  }

  /**
    * Reads from the target
    * If the data exists, it will return the results
    */
  async read(target: string): Promise<RottnestSyncState> {
    return await (this.config.operations.read(target));
  }

  
}
