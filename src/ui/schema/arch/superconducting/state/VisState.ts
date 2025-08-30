import VisData from "../ui/vis/VisData";
import { SuperconductingState } from "./ArchState";

/**
 * Visualiser state where the vis data will be helpd and updated
 */
export class SuperconductingVisState {

  // Parent container state
  pstate: SuperconductingState;

  // Visualiser data
  visData: any = VisData.empty();

  /**
   * Initialises the visualiser state
   */
  constructor(pstate: SuperconductingState) {
    this.pstate = pstate;
  }

  /**
   * Resets the visualiser state
   */
  reset() {
    this.visData = VisData.empty();
  }

  /**
   * Sets the visualiser data
   */
  setVizData(visData: any) {
    this.visData = visData;
  }

  /**
   * Returns the visualiser data
   */
  getVizData() {
    return this.visData;
  }
}
