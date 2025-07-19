import { HelpBoxData } from "../ui/container/HelpContainer";
import HelpWorker from "../ui/help/HelpWorker";
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
  helpData: Array<HelpBoxData> = []
  helpDataReady: boolean = false;


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
    const ref = this;
    HelpWorker.loadHelpData()
      .then((data) => {
        ref.helpData = data;
        ref.helpDataReady = true;
      });
  }

  /**
   * Gets the help data to be used in another container
   */
  getHelpData() {
    return this.helpData;
  }

  /**
   * Checks to see if the help is active 
   */
  isActive(): boolean {
    return this.active;
  }

  /**
   * Hides the help view
   */
  makeHidden(): void {
    console.log("What?");
		this.active = false;
		if (!this.active) {
    	this.inpService.removeHook('keydown');
    }
    this.update.triggerRefresh();
  }

  /**
   * Makes the current help view active
   */
  makeActive(): void {
    
		this.active = true;
	  let regArgs: InputHookParams = ['keydown', this.handleEscKey];  
		if (this.active) {
    	this.inpService.registerHook(regArgs);
    }
    this.update.triggerRefresh();
  }

  /**
   * Will toggle the help display when initiated
   */
	toggleHelp() {
		this.active = !this.active;
		console.log(this.active)
	  let regArgs: InputHookParams = ['keydown', this.handleEscKey];  
		if (this.active) {
    	this.inpService.registerHook(regArgs);
		} else {
  		this.inpService.removeHook('keydown');
		}
		this.update.triggerRefresh();
	}

	/**
	 * Gets a callback for toggle help
	 */
	getToggleCallback() {
	  const ref = this;
	  return () => ref.toggleHelp();
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
