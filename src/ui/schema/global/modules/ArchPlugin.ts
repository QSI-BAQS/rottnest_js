
import { RefreshService } from "../../../../service/RefreshService";

/**
 * Used to maintain information regarding the arch plugins
 * that would be available
 */
export class ArchPluginState{

  updateTrigger: RefreshService;
  swapFn: (arch: boolean, prog: boolean) => void;
  settingsActive: boolean = false;

	/**
	 * Constructor, requires knowing the current refresh service
	 * and a callback on what to switch the settings to
	 */
  constructor(trigger: RefreshService, swapFn: (arch: boolean, prog: boolean) => void) {
    this.swapFn = swapFn;
    this.updateTrigger = trigger;
  }

  /**
   * Shows the arch settings when clicked
   */
	showArchSettings() {
	  this.swapFn(true, false);
		this.updateTrigger.triggerRefresh();
	}

	/**
	 * Closes the arch settings that
	 * was present for selection
	 */
	closeArchSettings() {
	  this.swapFn(false, false);
		this.updateTrigger.triggerRefresh();
	}
  
}
