import { AppServiceClient } from "../../../../net/AppService";
import { CommEventOps, CommOpQueue, CommsActions } from "../../global/ops/CommsOps";
import { ArchCapabilityQuery, ArchCapabilityResult } from "../ArchContext";
import { ArchitectureConnectionManager, ArchitectureObject } from "../ArchSchema";
import { RTCCommActions, RTCCommEvents, RTCOpenOperations } from "./net/NetOperations";



/**
 * SuperconductingNetworkManager, it will manage the connection it receives
 * from the application
 * It will also have an initial set of callbacks it uses
 */
export class SuperconductingNetManager implements ArchitectureConnectionManager {

  object: ArchitectureObject
  events: CommEventOps<any>
  actions: CommsActions<any>
  opqueue: CommOpQueue<any>
  
  apimap = new Map([
    	["subtype", "tscheduler.web.api.get_subtype"],
    	["get_router", "tscheduler.web.api.get_router"],
    	["use_arch", "tscheduler.web.api.use_arch"],
    	["run_result", "tscheduler.web.api.run_result"],
    	["get_args", "tscheduler.web.api.get_args"],
    	["get_status", "tscheduler.web.api.get_status"],
    	["err", "err"],
    ] as Array<[string, string]>);

  getNetworkMap(): Map<string, string> {
    return this.apimap;
  }

  constructor(object: ArchitectureObject) {
    this.events = RTCCommEvents;
    this.actions = RTCCommActions;
    this.opqueue = RTCOpenOperations;
    this.object = object; 
  }

	 /**
   * Queries the capabiliteies of the designer
   */
  queryCapability(_query: ArchCapabilityQuery): ArchCapabilityResult {
    return ArchCapabilityResult.Deny();
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
   * Gets onLoadEvents, as these events will be used as part of
   * construction and opening of the websocket
   */
  onLoadEvents(): CommOpQueue<ArchitectureObject> {
    return this.opqueue;
  }

  /**
   * Gets the application service client so the net manager can
   * send messages
   */
  getNetworkService(): AppServiceClient {
    return this.object.getServices().getNetworkService()
      .getNetworkService();
  }

  
}
