import { InputHookParams, InputHookService } from "./InputHookService";
import { RefreshService } from "./RefreshService";


/**
 * HelpService that will allow the user to
 * trigger help when required for learning the UI
 */
export class HelpService {

  active: boolean = false;
  update: RefreshService;
  inpService: InputHookService;

  /**
   * Initialises with the required services to operate
   * correctly.
   * It will need to trigger a refresh when toggled
   * and it will need to be able to register and de-register
   * input handlers
   */
  constructor(update: RefreshService, inputs: InputHookService) {
    this.update = update;
    this.inpService = inputs;
  }

  /**
   * Checks to see if the help is active 
   */
  isActive(): boolean {
    return this.active;
  }

  /**
   * Will toggle the help display when initiated
   */
	toggleHelp() {
		const helpActive = !this.active;
	  let regArgs: InputHookParams = ['keydown', this.handleEscKey];  
		if (helpActive) {
    	this.inpService.registerHook(regArgs);
		} else {
  		this.inpService.removeHook('keydown');
		}
		this.update.triggerRefresh();
	}

  /**
   * Handler for when an escape key is pressed
   */
	handleEscKey = (event: any) => {
  		if (event.key === 'Escape' && this.active) {
    			this.toggleHelp();
  		}
	}
  
}
