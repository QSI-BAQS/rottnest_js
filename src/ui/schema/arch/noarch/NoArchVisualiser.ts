import { ArchitecturePlayerState, ArchitectureVisualiser, ArchitectureVisualiserPlayer } from "../ArchSchema";
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
export class NoArchVisualiser implements ArchitectureVisualiser {

  makeWorkspaceGroup(): ArchWorkspaceGroup {
      return new NoArchWorkspaceGroup();
  }

  makePlayer(): ArchitectureVisualiserPlayer {
      return new NoArchVisualiserPlayer();
  }
}

/**
 * NoArchVisualiserPlayer that will do nothing
 */
export class NoArchVisualiserPlayer implements ArchitectureVisualiserPlayer {
  
  changeFrame(_frameNo: number, _state: ArchitecturePlayerState): void {}

  togglePlay(_state: ArchitecturePlayerState): boolean { return false; }

  nextFrame(_state: ArchitecturePlayerState): void {}

  resetPlayer(_state: ArchitecturePlayerState): void {}

  prevFrame(_state: ArchitecturePlayerState): void {}
  
  play(_state: ArchitecturePlayerState): void {}
  
  stop(_state: ArchitecturePlayerState): void {
    
  }
}
