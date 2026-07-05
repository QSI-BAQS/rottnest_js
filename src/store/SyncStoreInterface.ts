import { SyncAppendObject,
  SyncMetaObject,
  SyncObject,
  SyncStateOperations } from './SyncObject';

/**
  * SyncStoreOperations
  * This is used to ensure that the implementer outlines the usage
  * and returns relevant results
  */
export interface SyncStoreOperations {
  init: (target: string) => boolean,
  metaWrite: (target: string, meta: SyncMetaObject) => void;
  metaRead: (target: string) => Promise<SyncObject<SyncMetaObject>>;
  read: <T>(target: string) => Promise<SyncObject<T>>;
  write: <T>(target: string, data: SyncObject<T>) => Promise<void>;
  append: <T>(target: string, data: SyncAppendObject<T>) => Promise<void>;
}

/**
  * Local storage operations vtable
  * Used to create a simple interface for the state sync object
  */
export const LocalStorageOperations: SyncStoreOperations = {

  /**
    * Initialises the space
    * This is used to maintain metadata information itself or just be a noop
    */
  init: (target: string) => {
    LocalStorageOperations.metaWrite(target,
      SyncStateOperations.newSyncMetaObject({
        writable: true,
        appendable: true,
        storageKey: target
      }));
    return true;
  },

  /**
    * MetaRead
    * Reads the metadata of the persistent storage
    * data to maintain a reasonableset of information for management
    */
  metaRead: (target: string): Promise<SyncObject<SyncMetaObject>> => {
    const metakey = `${target}_META`;
    return LocalStorageOperations.read<SyncMetaObject>(metakey);
  },

  /**
    * MetaWrite
    * Writes data to the meta key segment as specified by target
    */
  metaWrite: (target: string, meta: SyncMetaObject) => {
    const metakey = `${target}_META`;
    return LocalStorageOperations.write(
      metakey,
      SyncStateOperations.newSyncObject(meta)
    );
  },

  /**
    * Reads from local storage
    * Simple vtable implementation
    */
  read: <T>(target: string) => {
    const strData = localStorage[target];
    const data: T = JSON.parse(strData);
    return Promise.resolve(data);
  },

  /**
    * Writes to local storage
    * Simple vtable implementation
    */
  write: <T>(target: string, data: SyncObject<T>) => {
    const strData = JSON.stringify(data);
    localStorage[target] = strData;
    return Promise.resolve();
  },

  /**
    * Appends data to a relevant key
    * It will use the base level operations to of read and write to append
    * and use a key increment scheme
    * This is not flawless and can cause issues
    */
  append: async <T>(target: string, data: SyncAppendObject<T>) => {
    return await LocalStorageOperations.metaRead(target)
      .then(async (syncobj: SyncObject<SyncMetaObject>) => {

        const metadata = syncobj.data;
        const appendPrefix = metadata.syncAppendKeyPrefix;
        const appendCount = metadata.syncAppendCount++;
        const appendKey = `${appendPrefix}_${appendCount}`

        
        const strData = JSON.stringify(data);
        localStorage[appendKey] = strData;

        LocalStorageOperations.metaWrite(target, metadata);
        
        return Promise.resolve();
    });    
  }
}
