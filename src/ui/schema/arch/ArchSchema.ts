import { AppServiceClient } from "../../../net/AppService";
import { Services } from "../../../service/Services";
import { CommEventOps, CommOpQueue } from "../global/ops/CommsOps";
import { ArchActionTracker } from "./ArchActionTracker";
import { ArchWorkspaceGroup } from "./ArchWorkspace";


/**
 * Architecture Project that is used by
 * the serialiser
 */
export type ArchitectureProject<T> = {
  name: string,
  version: string,
  arch: string,
  object: T
}

/**
 * Architecture Schema, used to construct architecture object
 * that will provide interfaces for sub components
 */
export interface ArchitectureSchema {
  createArchitecture<T=any, E=any>(services: Services, args: Map<string, string | number>): ArchitectureObject<T, E>; 
}

/**
 * Facade object that represents an architecture project instance
 * This is to make it flexible to design with multiple projects alive
 *
 * Type parameter is used to leverage strictness, however it has been
 * given an any for cases where it is very loose in what it is
 */
export interface ArchitectureObject<T=any, E=any> {

  // Holds the project information
  getProject(): ArchitectureProject<T>;

  // Sets the project information
  setProject(project: ArchitectureProject<T>): boolean

  // Designer module
  getDesigner(data?: any): ArchitectureDesigner;

  // Visualiser module
  getVisualiser(data?: any): ArchitectureVisualiser;

  // Callgraph module
  getCallGraph(data?: any): ArchitectureCallGraph;

  // Serializer module
  getSerializer(): ArchitectureSerializer<T>;

  // ConnectionManager
  getConnectionManager(): ArchitectureConnectionManager;

  // Extensions 
  getExtensions(): ArchitectureExtensions<E>;

  // Services
  getServices(): Services;
}

/**
 * Connection Manager will have some ability to manage the websocket
 * connection as it receives messages from the application
 *
 * getNetworkService will return an AppService client that will
 * grant the architecture the ability to send messages
 *
 */
export interface ArchitectureConnectionManager {
  getCommunicationEvents(): CommEventOps<ArchitectureObject>;

  setCommunicationEvents(evemts: CommEventOps<ArchitectureObject>): void;

  getOnOpenOperations(): CommOpQueue<ArchitectureObject>;

  getNetworkService(): AppServiceClient;
}


/**
 * Extension object, used to retrieve additional data
 * that is needed in other places
 */
export interface ArchitectureExtensions<E> {

  getExtension(name: string): ArchitectureExtObj<E>;

  getAllExtensions(): Map<string, E>;
  
}

/**
 * For Designer, Visualiser and CallGraph, these are respective
 * workspace groups, this needs to be enforced as part of implementation
 */
export interface ArchitectureWorkspaceFactory {
  makeWorkspaceGroup(): ArchWorkspaceGroup;
}

/**
 * ArchitectureSerializer allows the developer to implement saving
 * and loading operations within this object
 */
export interface ArchitectureSerializer<T> {

  serialize(obj: ArchitectureProject<T>): string;

  deserialize(data: string): ArchitectureProject<T>
  
}

/**
 * Architecture designer will represent operations that the designer
 * will need to do and update related state operations
 */
export interface ArchitectureDesigner extends ArchitectureWorkspaceFactory {

  // Returns the action tracker for the designer
  getActionTracker<T=any>(): ArchActionTracker<T>;
    
}

/**
 * Visualisation Player State, will have a specific
 * interface that is required to be implemented
 */
export interface ArchitecturePlayerState {
  currentFrame(): number;

  setFrame(frame: number): void;

  lastFrame(): number;

  getFramerate(): number;

  setFramerate(hz: number): boolean;
}

/**
 * Player component of the visualiser that will need specific
 * hooks to be implemented
 */
export interface ArchitectureVisualiserPlayer {
  changeFrame(frameNo: number, state: ArchitecturePlayerState): void;

  togglePlay(state: ArchitecturePlayerState): boolean;

  nextFrame(state: ArchitecturePlayerState): void;

  resetPlayer(state: ArchitecturePlayerState): void;

  prevFrame(state: ArchitecturePlayerState): void;

  play(state: ArchitecturePlayerState): void;
  
  stop(state: ArchitecturePlayerState): void;
}

/**
 * ArchitectureVisualiser will implement relevant operations
 * that are needed for the visualiser playback and management
 */
export interface ArchitectureVisualiser extends ArchitectureWorkspaceFactory {

  makePlayer(data: Map<string, any>): ArchitectureVisualiserPlayer;
  
}

/**
 * ArchitectureCallGraph class that will allow the developer
 * to output a callgraph variation for their architecture
 */
export interface ArchitectureCallGraph extends ArchitectureWorkspaceFactory {
  
}

/**
 * Extension Return Object, to ensure
 * that the object is not immediately used without ensuring the data
 */
export class ArchitectureExtObj<E> {
  obj: E | null = null;

  constructor(obj: E | null) {
    this.obj = obj;
  }

  /**
   * Checks to see if it is null
   */
  isNull() {
    return this.obj === null;
  }

  /**
   * Checks to see if the object exists
   */
  isObj() {
    return this.obj !== null;
  }

  /**
   * Retrieves the object if it is not null
   * Throws exception if it is
   */
  getObj(): E {
    if(this.obj) {
      return this.obj
    } else {
      throw new Error("You tried to retrieve an object that is null");
    }
  }
}

