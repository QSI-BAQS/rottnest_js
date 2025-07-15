import { RefreshService } from "../../../../service/RefreshService";



/**
 * Used to maintain information regarding the program plugins
 * that would be available
 */
export class ProgramPluginState {

  updateTrigger: RefreshService;
  settingsActive: boolean = false;
  swapFn: (arch: boolean, prog: boolean) => void;

  /**
   * Constructs the program plugin state
   * Will have an event trigger to refresh the main container
   */
  constructor(trigger: RefreshService, swapFn: (arch: boolean, prog: boolean) => void) {
    this.updateTrigger = trigger;
    this.swapFn = swapFn;
  }

  /**
   * Shows the program settings when clicked
   */
	showProgramSettings() {
	  this.swapFn(false, true);
		this.updateTrigger.triggerRefresh();
	}

	/**
	 * Closes the program settings that
	 * was present for selection
	 */
	closeProgramSettings() {
	  this.swapFn(false, false);
		this.updateTrigger.triggerRefresh();
	}
  
}
