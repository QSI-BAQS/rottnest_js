import { UpdateTrigger } from "../../../../service/RefreshService";



/**
 * Used to maintain information regarding the program plugins
 * that would be available
 */
export class ProgramPluginState{

  updateTrigger: UpdateTrigger;
  settingsActive: boolean = false;
  swapFn: (arch: boolean, prog: boolean) => void;

  constructor(trigger: UpdateTrigger) {
    this.updateTrigger = trigger;
  }

  /**
   * Shows the program settings when clicked
   */
	showProgramSettings() {
	  this.swapFn(false, true);
		this.updateTrigger.triggerUpdate();
	}

	/**
	 * Closes the program settings that
	 * was present for selection
	 */
	closeProgramSettings() {
	  this.swapFn(false, false);
		this.updateTrigger.triggerUpdate();
	}
  
}
