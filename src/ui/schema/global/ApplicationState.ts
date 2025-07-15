import AppServiceModule from "../../../net/AppServiceModule";
import { HelpService } from "../../../service/HelpService";
import { InputHookService } from "../../../service/InputHookService";
import { NetworkService } from "../../../service/NetworkService";
import { NotifyService } from "../../../service/NotifyService";
import { RefreshService } from "../../../service/RefreshService";
import { Services, ServicesHolder } from "../../../service/Services";
import { ArchitectureUIContext } from "../arch/ArchContext";
import { ArchitectureObject, ArchitectureSchema } from "../arch/ArchSchema";
import { NoArchSchema } from "../arch/noarch/NoArch";

/**
 * The properties will be informed via main.tsx
 * that will outline information regarding the build itself
 */
export type RottnestProperties = {
	buildId?: string,
	buildDate?: string,
}

/**
 * This is an aggregate type that will hold all state objects
 * that can invoke an update onto the main container and sub-containers
 */
export type RottnestState = {
	appState: RottnestApplicationState,
	appContext: ArchitectureUIContext,
}

/**
 * RottnestApplicationState that will hold onto
 * the schema and object currently selected
 * It will also have access to the globals required as part of construction
 */
export class RottnestApplicationState {
	appState: RottnestApplicationModulesState;
	architectureSchema: ArchitectureSchema;
	architectureObject: ArchitectureObject | null = null;

	/**
	 * Initialises the architecture state to a default
	 */
	constructor(architectureSchema: ArchitectureSchema = new NoArchSchema()) {
		this.appState = new RottnestApplicationModulesState();
		this.architectureSchema = architectureSchema;
		this.architectureObject = architectureSchema.createArchitecture(
			this.appState.getServices()
		);
	}

	/**
	 * Will swap out the current architecture for the argument
	 * given
	 */
	swapArchitecture(schema: ArchitectureSchema): boolean {
		this.architectureSchema = schema;
		this.architectureObject = schema.createArchitecture(this
			.appState.getServices())
		return true;
	}
}

/**
 * RottnestApplicationState, holds onto all the data
 * that the container will need to use to do its job
 */
export class RottnestApplicationModulesState {

	services: RottnestApplicationServices;

  constructor() {
  	this.services = new RottnestApplicationServices();
  }

	/**
	 * Gets the services that are available
	 */
  getServices(): Services {
  	return this.services.getServices();
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
 * Application Services that will be provided to
 * the architecture objects.
 */
export class RottnestApplicationServices implements ServicesHolder {

	services: Services;

	constructor() {
		this.services = new Services(this);
	}
	
	/**
	 * Allows the architecture object to retrieve a service
	 * that allows refreshing of the render upon a change of
	 * state within their own architecture
	 */
  getRefreshService(): RefreshService {
  	return this.services.refresh;
  }

	/**
	 * Allows the architecture to generate notifications
	 * to allow for arch designer and other components to
	 * notify the user
	 */
  getNotifyService(): NotifyService {
  	return this.services.notify;
  }

	/**
	 * Gets the network services, this allows
	 * the architecture to interact with the application
	 * client and network
	 */
  getNetworkService(): NetworkService {
  	return this.services.network;
  }

  /**
   * Gets the input service
   */
  getInputService(): InputHookService {
  	return this.services.inputs;
  }

  /**
   * Gets the help server
   */
  getHelpService(): HelpService {
  	return this.services.help;
  }

	/**
	 * Returns the whole services group
	 */
  getServices(): Services {
  	return this.services;
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
