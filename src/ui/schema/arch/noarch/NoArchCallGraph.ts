import { ArchCapabilityQuery, ArchCapabilityResult } from "rottnest-plugin/schema/ArchContext";
import { ArchitectureCallGraph } from "rottnest-plugin/schema/ArchSchema";
import { ArchWorkspaceGroup, ArchWorkspaceProps } from "rottnest-plugin/schema/ArchWorkspace";

/**
 * Constructs the workspace group that will be used by the workspace component
 * within rottnest, this will return nothing
 * TODO: Populate with nothing components
 */
class NoArchWorkspaceGroup implements ArchWorkspaceGroup {
  makeGroup(_data: ArchWorkspaceProps): Array<React.ReactElement> {
      return [];
  }
}

/**
 * No ArchDesigner, it is used as a placeholder for when
 * no architecture has been selected
 */
export class NoArchCallGraph implements ArchitectureCallGraph {

  makeWorkspaceGroup(): ArchWorkspaceGroup {
      return new NoArchWorkspaceGroup();
  }

  /**
   * Queries the capabiliteies of the designer
   */
  queryCapability(query: ArchCapabilityQuery): ArchCapabilityResult {
    if(query.capability === 'CanZoom') {
      return ArchCapabilityResult.Deny();
    }
    if(query.capability === 'CanUndo') {
      return ArchCapabilityResult.Deny();
    }
    if(query.capability === 'CanSave') {
      return ArchCapabilityResult.Deny();
    }
    if(query.capability === 'CanLoad') {
      return ArchCapabilityResult.Confirm();
    }
    return ArchCapabilityResult.NotKnown();
  }
}
