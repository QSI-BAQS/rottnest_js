import { ProgramPluginService } from "../../../../service/ProgramPluginService";
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
	programService: ProgramPluginService;
  	
  /**
   * Constructs the program plugin state
   * Will have an event trigger to refresh the main container
   */
  constructor(trigger: RefreshService, plgstates: PluginRepresetationState,
  	programService: ProgramPluginService) {
    this.updateTrigger = trigger;
    this.plgstates = plgstates;
    this.swapFn = plgstates.getCallback();
    this.programService = programService;
  }

	/**
	 * Returns true if the settings are active
	 * and be displayed
	 */
	areSettingsActive(): boolean {
		return this.plgstates.getStates()[1];
	}

	getPrograms() {
		this.programService.requestProgramList()
	}

  /**
   * Shows the program settings when clicked
   */
	showProgramSettings() {
		this.getPrograms();
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
