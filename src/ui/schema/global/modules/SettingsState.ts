import { UpdateTrigger } from "../../../../service/RefreshService";



export class SettingsState {

  trigger: UpdateTrigger;
  settingsActive: boolean = false;
  newProjectActive: boolean = false;
  
  
  constructor(trigger: UpdateTrigger) {
    this.trigger = trigger;
  }
  /**
	 * Creates a settings form component that
	 * will allow the user to update project details
	 *
	 */
	showSettings() {

		this.settingsActive = true;
		this.trigger.triggerUpdate();
	}

	/**
	 * Shows a new project
	 */
	showNewProject() {

		this.newProjectActive = true;
		this.trigger.triggerUpdate();
	}

	
	/**
	 * Creates a settings form component that
	 * will allow the user to update project details
	 *
	 */
	cancelSettings() {
		this.settingsActive = false;
		this.trigger.triggerUpdate();
	}

	cancelNewProject() {
		this.newProjectActive = false;
		this.resetData();
		this.opers.validate(this);
		this.triggerUpdate();
	}
}
