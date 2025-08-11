import { ArchCapabilityQuery, ArchCapabilityResult } from "../ArchContext";
import { ArchitectureSerializer } from "../ArchSchema";


/**
 * No ArchDesigner, it is used as a placeholder for when
 * no architecture has been selected
 */
export class ActiveVolumeSerializer implements ArchitectureSerializer<any> {

  serialize(_obj: any): string {
    return '';
  }

  deserialize(_data: string): any {
    return {};
  }

  /**
   * Queries the capabiliteies of the designer
   */
  queryCapability(_query: ArchCapabilityQuery): ArchCapabilityResult {
    return ArchCapabilityResult.Deny();
  }
}
