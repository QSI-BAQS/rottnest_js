import RottnestApplication from "../ui/container/RottnestApplication";
import { ArchitectureObject } from "../ui/schema/arch/ArchSchema";
import { GlobalProtocolSet } from "./GlobalMessageMap";
import { AppProtocolSet, ProtocolOperation } from "./ProtocolTypes";


/**
 * ProtocolSet that correspond to no architecture
 */
export const NoArchProtocolSet: AppProtocolSet<ArchitectureObject> = {
  
}

/**
 * MessageMapper object is utilised to map the architecture that is selected
 * to the appropriate message types.
 *
 * The idea is that given a particular message type, there should be consistency
 * amongst all architectures outside of their given extensions.
 */
export class AppMessageMapper {
  globalSet: AppProtocolSet<RottnestApplication>;
  currentArchSet: AppProtocolSet<ArchitectureObject>;

  /**
   * Initialises the global and current arch sets
   */
  constructor(globalSet: AppProtocolSet<RottnestApplication> = GlobalProtocolSet,
    currentArchSet: AppProtocolSet<ArchitectureObject> = NoArchProtocolSet) {

    this.currentArchSet = currentArchSet;
    this.globalSet = globalSet;
  }

  /**
   * Gets the default version of the mapper
   */
  static Default() {
    return new AppMessageMapper();
  }

  /**
   * Will remap the messages to the appropriate message types
   */
  remap(protoset: AppProtocolSet<ArchitectureObject>) {
    this.currentArchSet = protoset;
  }

  /**
   * Gets the response function for the key given
   */
  getResponse(key: string): ProtocolOperation<ArchitectureObject> | null {
    const r = this.currentArchSet[key];
    if(r) {
      return r;
    }
    return null;
  }
  
}
