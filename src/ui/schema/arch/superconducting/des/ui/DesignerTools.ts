

/**
 * Contains a list of tools that the user can select from
 * as well as monitoring the 
 */
export class SuperconductingDesignerTools {

  /**
   * 
   */
  constructor() {
    
  }
  
	/**
	 * Retrieves the current tool index that
	 * has been selected
	 */
	getToolIndex() {
		return this.state.appStateData.componentData
			.selectedTool;
	}

	getSubToolIndex() {
		return this.state.appStateData
			.componentData.selectedSubTool;
	}
}
