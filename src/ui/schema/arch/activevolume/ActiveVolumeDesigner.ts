import { ArchActionTracker } from "../ArchActionTracker";
import {  ArchCapabilityQuery, ArchCapabilityResult } from "./sigs/ArchContext";
import { ArchitectureDesigner } from "./sigs/ArchSchema";
import { ArchWorkspaceGroup, ArchWorkspaceProps } from "./sigs/ArchWorkspace";
import { ActiveVolumeDesignGroup } from "./groups/DesignerGroup";

/**
 * This action does nothing as it is realistically just
 * there to disable the tracking when no architecture is selected
 */
class ActiveVolumeTracker implements ArchActionTracker {
  action(_nothing: any) { }

  undo(): any { return {} }

  redo(_nothing: any): any { return {} }

  performAction(): void {}

  performRedo(): void {}

  performUndo(): void {}
}

/**
 * Constructs the workspace group that will be used by the workspace component
 * within rottnest, this will return nothing
 * TODO: Populate with nothing components
 */
export class ActiveVolumeWorkspaceGroup implements ArchWorkspaceGroup {
  makeGroup(data: ArchWorkspaceProps): Array<React.ReactElement> {
      return new ActiveVolumeDesignGroup().makeGroup(data);
  }
}

/**
 * No ArchDesigner, it is used as a placeholder for when
 * no architecture has been selected
 */
export class ActiveVolumeDesigner implements ArchitectureDesigner {
  getActionTracker(): ArchActionTracker {
    return new ActiveVolumeTracker();
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
      return ArchCapabilityResult.Confirm();
    }
    if(query.capability === 'CanLoad') {
      return ArchCapabilityResult.Confirm();
    }
    if(query.capability === 'CanNetwork') {
      return ArchCapabilityResult.Confirm();
    }
    return ArchCapabilityResult.NotKnown();
  }

  /**
   * Constructs the workspace group
   */
  makeWorkspaceGroup(): ArchWorkspaceGroup {
      return new ActiveVolumeWorkspaceGroup();
  }
}
