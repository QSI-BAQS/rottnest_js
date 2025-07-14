import AppServiceModule from "../../../net/AppServiceModule";
import { ArchitectureObject, ArchitectureSchema } from "../arch/ArchSchema";
import { NoArchSchema } from "../arch/noarch/NoArch";

/**
 * The properties will be informed via main.tsx
 * that will outline information regarding the build itself
 */
export type RottnestProperties = {
	buildid: string
}

/**
 * This is an aggregate type that will hold all state objects
 * that can invoke an update onto the main container and sub-containers
 */
export type RottnestState = {
	archState: RottnestArchitectureState,
	appState: RottnestApplicationState,
}

/**
 * RottnestApplicationState that will hold onto
 * the schema and object currently selected
 * It will also have access to the globals required as part of construction
 */
export class RottnestArchitectureState {
	architectureSchema: ArchitectureSchema = new NoArchSchema()
	architectureObject: ArchitectureObject | null = null;

	/**
	 * Initialises the architecture state to a default
	 */
	constructor() {
		//TODO: Initialise the state
	}

	/**
	 * Will swap out the current architecture for the argument
	 * given
	 */
	swapArchitecture(schema: ArchitectureSchema): boolean {
		return false;
	}
}

/**
 * RottnestApplicationState, holds onto all the data
 * that the container will need to use to do its job
 */
export class RottnestApplicationState {

  constructor() {
  }

  /**
   * Checks to see if the network connection is ready
   * This is used on the 
   */
	readyAppService() {
		const selfRef = this;
		const appReady = AppServiceModule.ConnectionReady();
		const appService = AppServiceModule.GetAppServiceInstance();
		
		if(!appReady) { 
      //TODO: Fix this
  		/*selfRef.rtcCommsActions.ApplyInternal(
  			selfRef.commData.appService, selfRef);

  		appService.registerOpenFn(() => { selfRef
  			.rtcCommsDispatch.applyAll(appService, selfRef); });
		
  		this.commData.appService.connect();*/
    }
	}
}


/**
 * Used to monitor specific components
 * TODO: I think this can be removed
 */
//type ComponentMonitor = {
	//designSpace: DesignSpace | null
	//settingsForm: SettingsForm | null
//}
