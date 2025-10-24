
import { ArchPluginService } from "../../../../service/ArchPluginService";
import { RefreshService } from "../../../../service/RefreshService";
import { PluginRepresetationState } from "./PluginRepState";

/**
 * Used to maintain information regarding the arch plugins
 * that would be available
 */
export class ArchPluginState{

  updateTrigger: RefreshService;
  archService: ArchPluginService;
  plgstates: PluginRepresetationState;
  swapFn: (arch: boolean, prog: boolean) => void;
  
	/**
	 * Constructor, requires knowing the current refresh service
	 * and a callback on what to switch the settings to
	 */
  constructor(trigger: RefreshService, plgstates: PluginRepresetationState,
  	archService: ArchPluginService) {
  	this.archService = archService;
    this.updateTrigger = trigger;
    this.plgstates = plgstates;
    this.swapFn = plgstates.getCallback();
  }

	/**
	 * Returns true if the settings are active
	 * and be displayed
	 */
	areSettingsActive(): boolean {
		return this.plgstates.getStates()[0];
	}

	/**
	 * Gets the list of plugins to then load and maintain
	 */
	getPlugins() {
		this.archService.requestArchitectures();
	}

  /**
   * Shows the arch settings when clicked
   */
	showArchSettings() {
		this.getPlugins();
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
