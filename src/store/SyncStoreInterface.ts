import { RottnestSyncState } from './SyncObject';

/**
  * SyncStoreOperations
  * This is used to ensure that the implementer outlines the usage
  * and returns relevant results
  */
export interface SyncStoreOperations {
  read: (target: string) => Promise<RottnestSyncState>;
  write: (target: string, data: RottnestSyncState) => Promise<void>;
}

/**
  * Local storage operations vtable
  * Used to create a simple interface for the state sync object
  */
export const LocalStorageOperations = {

  /**
    * Reads from local storage
    * Simple vtable implementation
    */
  read: (target: string) => {
    const strData = localStorage[target];
    const data = JSON.parse(strData);
    return Promise.resolve(data);
  },

  /**
    * Writes to local storage
    * Simple vtable implementation
    */
  write: (target: string, data: RottnestSyncState) => {
    const strData = JSON.stringify(data);
    localStorage[target] = strData;
    return Promise.resolve();
  } 
}
