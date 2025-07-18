import { AppServiceClient } from "../../../net/AppService";
import { Services } from "../../../service/Services";
import { CommEventOps, CommOpQueue } from "../global/ops/CommsOps";
import { ArchActionTracker } from "./ArchActionTracker";
import { ArchCapabilitiesObject } from "./ArchContext";
import { ArchWorkspaceGroup } from "./ArchWorkspace";


/**
 * Strictly the data interface for the ArchitectureProject
 */
export interface ArchitectureProjectData<T> {
  header: {
    name: string,
    version: string,
    architecture: string,
    author: string
    description: string
  },
  body: {
    object: T
  }
}


/**
 * When moving the architecture to a saved file or
 * over a network, the formatter will provide the required operations
 * needed
 */
export interface ArchitectureFormatter {

  // Will translate the project for network usage
  toNetwork(project: ArchitectureProject<any>): any;

  // Will translate the project for file usage
  toFile(project: ArchitectureProject<any>): any; 
}

/**
 * Architecture Project that is used by
 * the serialiser
 */
export interface ArchitectureProject<T> extends ArchitectureProjectData<T> {

  //Used when needing to modify the project
  getProject(): ArchitectureProject<T>;

  // Converts the project to be usuable when sent to the backend
  forNetwork(fmt?: ArchitectureFormatter): any;

  // Converts the project to be usuable when saved
  forFile(fmt?: ArchitectureFormatter): any
}

/**
 * Architecture Schema, used to construct architecture object
 * that will provide interfaces for sub components
 */
export interface ArchitectureSchema {
  createArchitecture<T=any, E=any>(services: Services, args?: Map<string, string | number>): ArchitectureObject<T, E>; 
}

/**
 * Constructs a component module, requires props and state
 * types to be defined here
 * 
 */
export interface ArchitectureComponentModule<P, S> {

  // Return 
  makeComponent(component: React.Component<P, S>): React.ReactElement;
  
}

/**
 * Metadata type that contains information
 * related to the kind of modules and availability
 * along with the count
 */
export type ArchitectureModulesMeta = {
  modules: Array<string>
  available: Array<string>
  availability: Array<boolean>
  count: number
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

  // Creates a default project
  makeProject(): ArchitectureProject<T>;

  // Sets the project information
  setProject(project: ArchitectureProject<T>): boolean

  // Get available modules
  getModulesMeta(): ArchitectureModulesMeta;
  
  // Designer module
  getDesigner(data?: any): ArchitectureDesigner;

  // Visualiser module
  getVisualiser(data?: any): ArchitectureVisualiser;

  // Callgraph module
  getCallGraph(data?: any): ArchitectureCallGraph;

  // Serializer module
  getSerializer(): ArchitectureSerializer<T>;

  // Formatter module
  getFormatter(): ArchitectureFormatter;

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
export interface ArchitectureConnectionManager extends ArchCapabilitiesObject {

  // Gets the communication events relevant to the architecture object
  getCommunicationEvents(): CommEventOps<ArchitectureObject>;

  // Sets the communication events for the architecture object
  setCommunicationEvents(evemts: CommEventOps<ArchitectureObject>): void;

  // Gets the initial operations when loading
  onLoadEvents(): CommOpQueue<ArchitectureObject>;

  // Gets the network service
  // TODO: Remove this as this will be extracted
  //       from the services
  getNetworkService(): AppServiceClient;
}


/**
 * Extension object, used to retrieve additional data
 * that is needed in other places
 */
export interface ArchitectureExtensions<E> {

  // Gets an extension based on its name
  getExtension(name: string): ArchitectureExtObj<E>;

  // Gets all extensions as part of a map
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
export interface ArchitectureSerializer<T> extends ArchCapabilitiesObject {

  // Serializes and object to a string
  serialize(obj: ArchitectureProject<T>): string;

  // Deserializes the object back into an architecture project
  deserialize(data: string): ArchitectureProject<T>
  
}

/**
 * Architecture designer will represent operations that the designer
 * will need to do and update related state operations
 */
export interface ArchitectureDesigner extends ArchitectureWorkspaceFactory,
  ArchCapabilitiesObject {

  // Returns the action tracker for the designer
  getActionTracker<T=any>(): ArchActionTracker<T>;
    
}

/**
 * Visualisation Player State, will have a specific
 * interface that is required to be implemented
 */
export interface ArchitecturePlayerState {

  // Gets the current frame for the player state
  currentFrame(): number;

  // Sets the frame number
  setFrame(frame: number): void;

  // Gets the last frame number
  lastFrame(): number;

  // Gets the framerate
  getFramerate(): number;

  // Sets the framerate
  setFramerate(hz: number): boolean;
}

/**
 * Player component of the visualiser that will need specific
 * hooks to be implemented
 */
export interface ArchitectureVisualiserPlayer {

  // Changes the frame index
  changeFrame(frameNo: number, state: ArchitecturePlayerState): void;

  // Toggles the play state
  togglePlay(state: ArchitecturePlayerState): boolean;

  // Next frame from the current one
  nextFrame(state: ArchitecturePlayerState): void;

  // Resets the player state
  resetPlayer(state: ArchitecturePlayerState): void;

  // Prev frame from the current one
  prevFrame(state: ArchitecturePlayerState): void;

  // Set the player state to play
  play(state: ArchitecturePlayerState): void;

  // Sets the player state to stop
  stop(state: ArchitecturePlayerState): void;
}

/**
 * ArchitectureVisualiser will implement relevant operations
 * that are needed for the visualiser playback and management
 */
export interface ArchitectureVisualiser extends ArchitectureWorkspaceFactory,
  ArchCapabilitiesObject {

  // Constructs a player
  makePlayer(data: Map<string, any>): ArchitectureVisualiserPlayer;
  
}

/**
 * ArchitectureCallGraph class that will allow the developer
 * to output a callgraph variation for their architecture
 */
export interface ArchitectureCallGraph extends ArchitectureWorkspaceFactory,
  ArchCapabilitiesObject {

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

