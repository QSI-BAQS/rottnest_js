/**
 * CallGraphService, this will store the
 * call graph data for it to be access
 */
export class CallGraphService {

  graphViewData = CallGraphService.#ViewDataInit();

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
    this.graphViewData = CallGraphService.#ViewDataInit();
  }
  
  /**
   * Static initialisation for graph view data
   */
  static #ViewDataInit() {
    return {
      graph: new Map(),
    }
  }
  
}
