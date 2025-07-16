import { ArchitecturePlayerState, ArchitectureVisualiser, ArchitectureVisualiserPlayer } from "../ArchSchema";
import { ArchWorkspaceGroup } from "../ArchWorkspace.ts";
import { VisualiserGroup } from "./groups/VisualiserGroup.tsx";



export class LatticeVisualiserContainer {
  
}

/**
 * Lattice Player state,
 * Will keep track of the current player for Lat2D when the visualiser is
 * engaged
 */
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

/**
 * LatticeVisualiserPlayer,
 * Used to by the application to play and control the player state of
 * the visualiser
 */
export class LatticeVisualiserPlayer implements ArchitectureVisualiserPlayer {
  
  changeFrame(frameNo: number, state: ArchitecturePlayerState): void {
    state.setFrame(frameNo);
  }

  //TODO: Fix this
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

  //TODO: Fix this
  play(state: ArchitecturePlayerState): void {
    
  }
  
  //TODO: Fix this
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

  /**
   * Constructs an architecture workspace group that will
   * be used by the front end in order to display
   * the content appropriately
   */
  makeWorkspaceGroup(): ArchWorkspaceGroup {
    return new VisualiserGroup();
  }

  /**
   * Constructs a visualiser playerm will need to
   * allow the data to be attached to the visualiser
   */
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

  /**
   * Sets the visualisation data
   */
  setVisData(visData: any) {
    this.visData = visData; 
  }
  
}
