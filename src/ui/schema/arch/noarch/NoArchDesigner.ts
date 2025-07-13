import { ArchActionTracker } from "../ArchActionTracker";
import { ArchitectureDesigner } from "../ArchSchema";
import { ArchWorkspaceGroup, ArchWorkspaceProps } from "../ArchWorkspace";

/**
 * This action does nothing as it is realistically just
 * there to disable the tracking when no architecture is selected
 */
class NoActionTracker implements ArchActionTracker {
  action(_nothing: any) { }

  undo(): any {
    return {}
  }

  redo(_nothing: any): any {
    return {}
  }
}

/**
 * Constructs the workspace group that will be used by the workspace component
 * within rottnest, this will return nothing
 * TODO: Populate with nothing components
 */
export class NoArchWorkspaceGroup implements ArchWorkspaceGroup {
  makeGroup(_data: ArchWorkspaceProps): Array<React.ReactElement> {
      return [];
  }
}

/**
 * No ArchDesigner, it is used as a placeholder for when
 * no architecture has been selected
 */
export class NoArchDesigner implements ArchitectureDesigner {
  getActionTracker(): ArchActionTracker {
    return new NoActionTracker();
  }

  makeWorkspaceGroup(): ArchWorkspaceGroup {
      return new NoArchWorkspaceGroup();
  }
}
