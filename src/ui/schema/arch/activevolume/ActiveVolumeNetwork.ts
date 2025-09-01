import { UnimplReturn } from "../../util/unimpl";
import { ArchCapabilityQuery, ArchCapabilityResult } from "./sigs/ArchContext";
import { ArchitectureConnectionManager, ArchitectureObject } from "./sigs/ArchSchema";
import { AppServiceClient, CommEventOps, CommOpQueue } from "./sigs/exported";

/**
 * LatticeNetworkManager, it will manage the connection it receives
 * from the application
 * It will also have an initial set of callbacks it uses
 */
export class ActiveVolumeNetManager implements ArchitectureConnectionManager {

  object: ArchitectureObject;

  apimap = new Map([
      ['use_arch', 'activevolume.web.api.use_arch'],
      ['get_status', 'activevolume.web.api.get_status']
    ] as Array<[string, string]>);

  getNetworkMap(): Map<string, string> {
    return this.apimap;
  }
  
  constructor(object: ArchitectureObject) {
    this.object = object;
  }

  /**
   * Sets new communication events, useful when switching between contexts
   */
  setCommunicationEvents(_events: CommEventOps<ArchitectureObject>): void {
    UnimplReturn<void>();
  }

  /**
   * Gets the communication events as these are likely to be registered
   * for the websocket to respond to
   */
  getCommunicationEvents(): CommEventOps<ArchitectureObject> {
    return UnimplReturn<CommEventOps<ArchitectureObject>>();
  }

  /**
   * Gets onLoadEvents, as these events will be used as part of
   * construction and opening of the websocket
   */
  onLoadEvents(): CommOpQueue<ArchitectureObject> {
    return UnimplReturn<CommOpQueue<ArchitectureObject>>();
  }

  /**
   * Gets the application service client so the net manager can
   * send messages
   */
  getNetworkService(): AppServiceClient {
    return this.object.getServices().getNetworkService().getNetworkService();
  }  
  
  /**
   * Queries the capabiliteies of the designer
   */
  queryCapability(query: ArchCapabilityQuery): ArchCapabilityResult {
    if(query.capability === 'CanNetwork') {
      return ArchCapabilityResult.Confirm();
    }
    return ArchCapabilityResult.Deny();
  }
}
