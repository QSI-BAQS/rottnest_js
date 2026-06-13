import { MessageType } from "../net/Protocol";
import { StateStorage } from "../store/StateStorage";
import { RottnestSyncState, RottnestSyncStateDescriptor } from "../store/SyncObject";
import { RottnestApplicationState } from "../ui/context/global/ApplicationState";
import { NetworkService } from "./NetworkService";
import { Services } from "./Services";

/** Is used to refer to the opfs and localstorage part */
export const RottnestSynchroniseKey = "RottnestSync.sync";

/** Specifies the digest kind */
export const SyncHashDigestKind = "SHA-256";

/**
  * HashedResult
  * 
  */
export type HashedResult = {
  hash: string,
  flattened: string,
}

/**
  * Synchronises objects 
  * It will use the localstorage to hold the data
  * necessary and will need to accept an object to save it
  */
export class SynchroniseService {

  storage: StateStorage;

  lastState: RottnestSyncState | null = null;

  constructor() {
    this.storage = StateStorage.GetInstance();
  }

  
  /**
    * Will hash an object with a predefined hash digest specified
    * This will be used to store and keep checks
    */
  async hashObject(objectData: any): Promise<HashedResult> {

    const digest = window.crypto.subtle.digest;
    const stringifiedData = JSON.stringify(objectData);
    const encoder = new TextEncoder();
    const data = encoder.encode(stringifiedData);

    const hash = await digest(SyncHashDigestKind, data);

    const hashHex = new Uint8Array(hash).toHex();

    return {
      hash: hashHex,
      flattened: stringifiedData
    }
    
  }

  /**
    * From the application state
    * This will extract each object required
    */
  fromApplicationState(applicationState: RottnestApplicationState):
    { [key: string ]: any } {
    const services = applicationState
      .getArchitectureObject()
      .getServices() as Services;
      
    const layout = applicationState
      .getArchitectureObject()
      .getProject();

    const executable = services
      .getProgramPluginService()
      .getCurrentName();

    const architecture = services
      .getArchPluginService()
      .getCurrentArch().identifier;

    const runchart = services
      .getRunResultService()
      .getVolumeSet();

    const runchartIdent = services
      .getRunResultService().identifierOnEnd;

    return {
      layout,
      executable,
      architecture,
      runchart: {
        runIdentifier: runchartIdent,
        runData: runchart
      }
    };
  }

  /**
    * Changes the state to a hash descriptor
    * that will be stored on the server
    */
  toDescriptor(state: RottnestSyncState): RottnestSyncStateDescriptor {
    return {
      timestamp: state.timestamp,
      layout: { hash: state.layout.hash },
      runchart: { hash: state.runchart.hash },
      architecture: { hash: state.architecture.hash },
      executable: { hash: state.executable.hash }
    }
  }

  /**
    * Will pull from both server and local
    * It will reconcile and figure out if local is valid or out of sync
    * It will then reset the server if it is out of sync or set the UI
    * to be in sync
    */
  async pull() {
    /// Not implemented yet
  }

  /**
    * Pushes the state to the server and to local storage
    * This is used as a single operation to push it all
    */
  async push(applicationState: RottnestApplicationState) {
    const networkService = (applicationState.getArchitectureObject()
      .getServices() as Services)
      .getNetworkService();
      
    const state = await this.pushToStorage(applicationState);
    const stateDescriptor = this.toDescriptor(state);
    this.pushToServer(networkService, stateDescriptor)
  }  

  /**
    * Will push the current data of the application
    * to the storage system of the browser.
    * Will return the state it had composed for other pipelined operations
    */
  async pushToStorage(applicationState: RottnestApplicationState) {
    //Get applicationState
    // - Gets project (layout)
    // - Gets service for executable (executable info)
    // - Gets service for architecture (architecture info)
    // - Gets service for runchart (current buffer information)

    const storage = this.storage;
    const objects = this.fromApplicationState(applicationState);
    const flattened = {} as {[key: string]: any};

    for(const key in objects) {
      const data = objects[key];
      const objWithHash = this.hashObject(data);
      flattened[key] = objWithHash;
    }

    const state: RottnestSyncState = {
      timestamp: Date.now(),
      layout: {
        data: flattened.layout.flattened,
        hash: flattened.layout.hash,
        set: true,
      },
      architecture: {
        data: flattened.architecture.flattened,
        hash: flattened.architecture.hash,
        set: true,
      },
      executable: {
        data: flattened.executable.flattened,
        hash:flattened.executable.hash,
        set: true,
      },
      runchart: {
        data: flattened.runchart.flattened,
        hash: flattened.runchart.hash,
        set: true,
      }
    }
    storage.write(RottnestSynchroniseKey, state);

    return state;
  }

  pushToServer(networkService: NetworkService,
    descriptor: RottnestSyncStateDescriptor) {
    const client = networkService.getNetworkService();
    client.sendObj(MessageType.Sync.Set, descriptor);
  }

  /**
    * Will pull from localstorage or indexdb or opfs storage
    * locations to 
    */
  async pullFromStorage() {
    
  }

  pullFromServer() {
    
  }

  

  
}
