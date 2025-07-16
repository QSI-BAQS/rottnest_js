import AppServiceModule from "../../../net/AppServiceModule";
import { ArchPluginService } from "../../../service/ArchPluginService";
import { HelpService } from "../../../service/HelpService";
import { InputHookService } from "../../../service/InputHookService";
import { NetworkService } from "../../../service/NetworkService";
import { NotifyService } from "../../../service/NotifyService";
import { ProgramPluginService } from "../../../service/ProgramPluginService";
import { RefreshService } from "../../../service/RefreshService";
import { Services, ServicesHolder } from "../../../service/Services";
import { ValidationService } from "../../../service/ValidatorService";
import { ArchitectureUIContext } from "../arch/ArchContext";
import { ArchitectureObject, ArchitectureSchema } from "../arch/ArchSchema";
import { NoArchSchema } from "../arch/noarch/NoArch";
import { ArchPluginState } from "./modules/ArchPlugin";
import { ErrorState } from "./modules/ErrorState";
import { PluginRepresetationState } from "./modules/PluginRepState";
import { ProgramPluginState } from "./modules/ProgramPlugin";
import { ProjectSettingsState } from "./modules/SettingsState";
import { ZoomState } from "./modules/ZoomState";

/**
 * Return Object for project state
 */
type ProjectRetObj = {
	obj: ProjectSettingsState | null,
	isReady: boolean
}

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
	modstate: RottnestApplicationModulesState;
	architectureSchema: ArchitectureSchema;
	architectureObject: ArchitectureObject;

	/**
	 * Initialises the architecture state to a default
	 */
	constructor(architectureSchema: ArchitectureSchema = new NoArchSchema()) {
		this.modstate = new RottnestApplicationModulesState(this);
		this.architectureSchema = architectureSchema;
		this.architectureObject = architectureSchema.createArchitecture(
			this.modstate.getServices()
		);
	}

	/**
	 * Gets the module states so we can retrieve the state information
	 * and update them
	 */
	getModuleStates(): RottnestApplicationModulesState {
		return this.modstate;
	}

	/**
	 * Gets the architecture object that has been
	 * constructed by the schema
	 */
	getArchitectureObject(): ArchitectureObject {
		return this.architectureObject;
	}

	/**
	 * Gets the architecture schema
	 */
	getArchitectureSchema(): ArchitectureSchema {
		return this.architectureSchema;
	}

	/**
	 * Will swap out the current architecture for the argument
	 * given
	 */
	swapArchitecture(schema: ArchitectureSchema): boolean {
		this.architectureSchema = schema;
		this.architectureObject = schema.createArchitecture(this
			.modstate.getServices())
		return true;
	}
}

/**
 * RottnestApplicationState, holds onto all the data
 * that the container will need to use to do its job
 */
export class RottnestApplicationModulesState {

	services: RottnestApplicationServices;
	states: RottnestApplicationComponentStates;
	
  constructor(appState: RottnestApplicationState) {
  	this.services = new RottnestApplicationServices();
  	this.states = new RottnestApplicationComponentStates(
  		appState.getArchitectureObject(),
  		this.services.getServices())
  }

	/**
	 * Gets the component states
	 */
	getStates(): RottnestApplicationComponentStates {
		return this.states;
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
		//const selfRef = this;
		const appReady = AppServiceModule.ConnectionReady();
		//const appService = AppServiceModule.GetAppServiceInstance();
		
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
 * RottnestApplicationComponentStates
 * This will hold some global information/data that is used
 * by global or other components
 */
export class RottnestApplicationComponentStates {

	zoomState: ZoomState;
	archState: ArchPluginState;
	programState: ProgramPluginState;
	pluginsState: PluginRepresetationState;
	errorState: ErrorState;
	projectState: ProjectSettingsState | null = null;

	constructor(archobj: ArchitectureObject | null, services: Services) {
		const refresh = services.refresh;
		this.pluginsState = new PluginRepresetationState();
		this.zoomState = new ZoomState(100, refresh);
		this.archState = new ArchPluginState(refresh, this
			.pluginsState.getCallback());
		this.programState = new ProgramPluginState(refresh, this
			.pluginsState.getCallback());
		this.errorState = new ErrorState();
		if(archobj !== null) {
			this.projectState = new ProjectSettingsState(archobj, refresh);
		}
	}

	/**
	 * Gets the project state
	 */
	getProjectState(): ProjectRetObj {
		return { obj: this.projectState, isReady: this.projectState !== null };
	}

	/**
	 * Gets the error state
	 */
	getErrorState() {
		return this.errorState;
	}

	/**
	 * Gets the zoom state
	 */
	getZoomState() {
		return this.zoomState;
	}

	/**
	 * Gets the architecture plugin state
	 */
	getArchState() {
		return this.archState
	}

	/**
	 * Gets the program plugins state
	 */
	getProgramState() {
		return this.programState;
	}

	/**
	 * Gets the UI plugins state
	 */
	getPluginsState() {
		return this.pluginsState
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
	 * Gets the arch plugin service
	 */
	getArchPluginService(): ArchPluginService {
		return this.services.archplugins;		
	}

	/**
	 * Gets the program plugin service
	 */
	getProgramPluginService(): ProgramPluginService {
			
		return this.services.programplugins;
	}

	/**
	 * Gets the validation service
	 */
	getValidationService(): ValidationService {
		return this.services.valservice;
	}

	/**
	 * Returns the whole services group
	 */
  getServices(): Services {
  	return this.services;
  }
}
