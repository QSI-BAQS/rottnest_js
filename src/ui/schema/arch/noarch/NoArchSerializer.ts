import { ArchCapabilityQuery, ArchCapabilityResult } from "rottnest-plugin/schema/ArchContext";
import { ArchitectureSerializer } from "rottnest-plugin/schema/ArchSchema";


/**
 * No ArchDesigner, it is used as a placeholder for when
 * no architecture has been selected
 */
export class NoArchSerializer implements ArchitectureSerializer<any> {

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
