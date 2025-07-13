import { ArchitectureCallGraph } from "../ArchSchema";
import { ArchWorkspaceGroup, ArchWorkspaceProps } from "../ArchWorkspace";

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

}
