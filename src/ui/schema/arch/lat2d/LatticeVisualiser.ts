import { ArchitecturePlayerState, ArchitectureVisualiser, ArchitectureVisualiserPlayer } from "../ArchSchema";
import { ArchWorkspaceGroup, ArchWorkspaceProps } from "../ArchWorkspace.ts";

/**
 * Constructs the workspace group that will be used by the workspace component
 * within rottnest
 */
export class LatticeVisualiserUIGroup implements ArchWorkspaceGroup {
  makeGroup(_data: ArchWorkspaceProps): Array<React.ReactElement> {
      return [];
  }
}

export class LatticeVisualiserContainer {
  
}

export class LatticePlayerState implements ArchitecturePlayerState {

  frameNo: number = 0;
  maxFrame: number = 0;
  framerate: number = 60;
  playing: boolean = false;
  
  currentFrame(): number {
    return this.frameNo;
  }

  setFrame(frame: number): void {
    this.frameNo = frame;
  }

  lastFrame(): number {
    return this.maxFrame;
  }

  getFramerate(): number {
    return this.framerate;
  }

  setFramerate(hz: number): boolean {
    if(hz > 400 || hz <= 0) {
      return false;
    } else {
      this.framerate = hz;
      return true;
    }
  }
}


export class LatticeVisualiserPlayer implements ArchitectureVisualiserPlayer {
  
  changeFrame(frameNo: number, state: ArchitecturePlayerState): void {
    state.setFrame(frameNo);
  }

  togglePlay(state: ArchitecturePlayerState): boolean {
    return false;
  }

  nextFrame(state: ArchitecturePlayerState): void {
    const frameNo = state.currentFrame();
    state.setFrame(frameNo+1);
  }

  resetPlayer(state: ArchitecturePlayerState): void {
    state.setFrame(0);
  }

  prevFrame(state: ArchitecturePlayerState): void {
    const frameNo = state.currentFrame();
    state.setFrame(frameNo-1);
    
  }

  play(state: ArchitecturePlayerState): void {
    
  }
  
  stop(state: ArchitecturePlayerState): void {
    
  }
}

/**
 * Lattice Visualiser that will hold the visualisation related
 * operations
 */
export class LatticeVisualiser implements ArchitectureVisualiser {

  
  visualiser: LatticeVisualiserContainer = new LatticeVisualiserContainer();
  visData: any = {};

  makeWorkspaceGroup(): ArchWorkspaceGroup {
    return new LatticeVisualiserUIGroup();
  }

  makePlayer(): ArchitectureVisualiserPlayer {
    return new LatticeVisualiserPlayer()
  }

  /**
   * Originally in RottnestContainer,
   * has been moved to the visualiser
   */
  getVisData(): any {
    //Retrieve from the object
    // getVisData(object: ArchitectureObject)
  }

  setVisData(visData: any) {
    this.visData = visData; 
  }
  
}
