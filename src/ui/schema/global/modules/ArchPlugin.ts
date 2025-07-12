
import { UpdateTrigger } from "../../../../service/RefreshService";

/**
 * Used to maintain information regarding the arch plugins
 * that would be available
 */
export class ArchPluginState{

  updateTrigger: UpdateTrigger;
  swapFn: (arch: boolean, prog: boolean) => void;
  settingsActive: boolean = false;

  constructor(trigger: UpdateTrigger, swapFn: (arch: boolean, prog: boolean) => void) {
    this.swapFn = swapFn;
    this.updateTrigger = trigger;
  }

  /**
   * Shows the arch settings when clicked
   */
	showArchSettings() {
	  this.swapFn(true, false);
		this.updateTrigger.triggerUpdate();
	}

	/**
	 * Closes the arch settings that
	 * was present for selection
	 */
	closeArchSettings() {
	  this.swapFn(false, false);
		this.updateTrigger.triggerUpdate();
	}
  
}
