import { ArchCapabilityQuery, ArchCapabilityResult } from "../ArchContext.ts";
import { ArchitecturePlayerState, ArchitectureVisualiser, ArchitectureVisualiserPlayer } from "../ArchSchema";
import { ArchWorkspaceGroup } from "../ArchWorkspace.ts";
import { VisualiserGroup } from "./groups/VisualiserGroup.tsx";
import { SuperconductingState } from "./state/ArchState.ts";


/**
 * Superconducting Player state,
 * Will keep track of the current player for Lat2D when the visualiser is
 * engaged
 */
export class SuperconductingPlayerState implements ArchitecturePlayerState {

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
 * SuperconductingVisualiserPlayer,
 * Used to by the application to play and control the player state of
 * the visualiser
 */
export class SuperconductingVisualiserPlayer implements ArchitectureVisualiserPlayer {
  
  changeFrame(frameNo: number, state: ArchitecturePlayerState): void {
    state.setFrame(frameNo);
  }

  //TODO: Fix this
  togglePlay(_state: ArchitecturePlayerState): boolean {
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
  play(_state: ArchitecturePlayerState): void {
    
  }
  
  //TODO: Fix this
  stop(_state: ArchitecturePlayerState): void {
    
  }
}

/**
 * Superconducting Visualiser that will hold the visualisation related
 * operations
 */
export class SuperconductingVisualiser implements ArchitectureVisualiser {


  state: SuperconductingState;
  
  /**
   * Constructor for the state
   */
  constructor(state: SuperconductingState) {
    this.state = state;
  }
  
   /**
   * Queries the capabiliteies of the designer
   */
  queryCapability(query: ArchCapabilityQuery): ArchCapabilityResult {
    if(query.capability === 'CanZoom') {
      return ArchCapabilityResult.Confirm();
    }
    if(query.capability === 'CanSave') {
      return ArchCapabilityResult.Deny();
    }
    if(query.capability === 'CanLoad') {
      return ArchCapabilityResult.Deny();
    }
    return ArchCapabilityResult.Deny();
  }
  
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
    return new SuperconductingVisualiserPlayer()
  }

  /**
   * Originally in RottnestContainer,
   * has been moved to the visualiser
   */
  getVisData(): any {
    return this.state.getVisState();
  }

  /**
   * Sets the visualisation data
   */
  setVisData(visData: any) {
    this.state.getVisState().setVizData(visData);
  }
  
}
