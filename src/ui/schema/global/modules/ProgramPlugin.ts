import { RefreshService } from "../../../../service/RefreshService";
import { PluginRepresetationState } from "./PluginRepState";



/**
 * Used to maintain information regarding the program plugins
 * that would be available
 */
export class ProgramPluginState {

  updateTrigger: RefreshService;
  settingsActive: boolean = false;
  swapFn: (arch: boolean, prog: boolean) => void;
	plgstates: PluginRepresetationState
  	
  /**
   * Constructs the program plugin state
   * Will have an event trigger to refresh the main container
   */
  constructor(trigger: RefreshService, plgstates: PluginRepresetationState) {
    this.updateTrigger = trigger;
    this.plgstates = plgstates;
    this.swapFn = plgstates.getCallback();
  }

	/**
	 * Returns true if the settings are active
	 * and be displayed
	 */
	areSettingsActive(): boolean {
		return this.plgstates.getStates()[1];
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
