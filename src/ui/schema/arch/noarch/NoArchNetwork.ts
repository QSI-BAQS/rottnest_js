import { ArchitectureConnectionManager, ArchitectureObject } from "rottnest-plugin/schema/ArchSchema";
import { AppServiceClient } from "../../../../net/AppService";
import { UnimplReturn } from "../../util/unimpl";
import { ArchCapabilityQuery, ArchCapabilityResult } from "rottnest-plugin/schema/ArchContext";
import { CommEventOps, CommOpQueue } from "rottnest-plugin/schema/ArchDecls";

/**
 * LatticeNetworkManager, it will manage the connection it receives
 * from the application
 * It will also have an initial set of callbacks it uses
 */
export class NoArchNetManager implements ArchitectureConnectionManager {


  apimap = new Map([
    	["use_arch", "err"],
    ] as Array<[string, string]>);

  /**
   * Retrieves the network map
   */
  getNetworkMap(): Map<string, string> {
    return this.apimap;
  }
  
  constructor(_object: ArchitectureObject) {}

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
    return UnimplReturn<AppServiceClient>();
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
