import { SuperconductingState } from "./ArchState";


/**
 * SuperconductingCallGraphState, this will store the
 * call graph data for it to be access
 */
export class SuperconductingCallGraphState {

  pstate: SuperconductingState;
  graphViewData: any = {};


  constructor(pstate: SuperconductingState) {
    this.pstate = pstate;
  }

  /**
   * Gets the graph view data
   */
  getGraphViewData() {
    return this.graphViewData;
  }

  /**
   * Sets the graph view data to whatever the argument is
   */
  setGraphViewData(data: any) {
    this.graphViewData = data;
  }

  /**
   * Resets the graph view data
   */
  reset() {
    this.graphViewData = {};
  }
  
}
