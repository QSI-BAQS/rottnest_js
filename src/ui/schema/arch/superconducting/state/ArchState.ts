import { SuperconductingCallGraphState } from "./CallGraphState";
import { SuperconductingUIState } from "./UIState";
import { SuperconductingVisState } from "./VisState";
import { SuperconductingWorkingState } from "./WorkingState";



/**
 * Represents the state of the superconducting architecture
 * It acts as the parent for the states below so they can request
 * data via their parent
 */
export class SuperconductingState {

  // workstate, will hold buffers necessary for designers and other
  // components were the objects are mutable
  workstate: SuperconductingWorkingState

  // uistate, will be related to the user interface
  // and the current state it is in
  uistate: SuperconductingUIState;

  // visstate, will be related to the visualiser
  // state and information for that component
  visstate: SuperconductingVisState;

  // cgstate, will be related to the callgraph state
  cgstate: SuperconductingCallGraphState;

  // Callback to ensure that it refreshes the UI on updates
  refreshCallback: () => void;
  
  constructor(refreshCallback: () => void) {
    this.workstate = new SuperconductingWorkingState(this);
    this.uistate = new SuperconductingUIState(this);
    this.visstate = new SuperconductingVisState(this);
    this.cgstate = new SuperconductingCallGraphState(this);
    this.refreshCallback = refreshCallback;
  }

  /**
   * Triggers a refresh from the parent object
   */
  triggerUpdate() {
    this.refreshCallback();
  }

  /**
   * Work state, it will represent the state that
   * the current buffers are in
   */
  getWorkState(): SuperconductingWorkingState {
    return this.workstate;
  }

  /**
   * User Interface state, will represent what
   * state the UI is in
   */
  getUIState(): SuperconductingUIState {
    return this.uistate;
  }

  /**
   * Gets the visualiser state information
   * that will allow for data to be updated for that component
   */
  getVisState(): SuperconductingVisState {
    return this.visstate;
  }

  /**
   * Gets the callgraph state
   */
  getCallGraphState(): SuperconductingCallGraphState {
    return this.cgstate;
  }
}
