import { AppServiceClient } from "../../../../net/AppService";
import { CommEventOps, CommOpQueue, CommsActions } from "../../global/ops/CommsOps";
import { ArchitectureConnectionManager, ArchitectureObject } from "../ArchSchema";
import { RTCCommActions, RTCCommEvents, RTCOpenOperations } from "./net/NetOperations";



/**
 * LatticeNetworkManager, it will manage the connection it receives
 * from the application
 * It will also have an initial set of callbacks it uses
 */
export class LatticeNetManager implements ArchitectureConnectionManager {

  object: ArchitectureObject
  events: CommEventOps<ArchitectureObject>
  actions: CommsActions<ArchitectureObject>
  opqueue: CommOpQueue<ArchitectureObject>
  
  constructor(object: ArchitectureObject) {
    this.events = RTCCommEvents;
    this.actions = RTCCommActions;
    this.opqueue = RTCOpenOperations;
    this.object = object;
    
  }

  /**
   * Sets new communication events, useful when switching between contexts
   */
  setCommunicationEvents(events: CommEventOps<ArchitectureObject>): void {
    this.events = events;
  }

  /**
   * Gets the communication events as these are likely to be registered
   * for the websocket to respond to
   */
  getCommunicationEvents(): CommEventOps<ArchitectureObject> {
    return this.events;
  }

  /**
   * Gets OnOpenOperations, as these events will be used as part of
   * construction and opening of the websocket
   */
  getOnOpenOperations(): CommOpQueue<ArchitectureObject> {
    return this.opqueue;
  }

  /**
   * Gets the application service client so the net manager can
   * send messages
   */
  getNetworkService(): AppServiceClient {
    return this.object.getServices().getNetworkService();
  }

  
}
