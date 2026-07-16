import { HelpService } from "./HelpService";
import { InputHookService } from "./InputHookService";
import { NetworkService } from "./NetworkService";
import { NotifyService } from "./NotifyService"
import { RefreshService, UpdateTrigger } from "./RefreshService"
import { ProgramPluginService } from "./ProgramPluginService";
import { ArchPluginService, ArchUpdateTrigger } from "./ArchPluginService";
import { ValidationService } from "./ValidatorService";
import { RunResultService } from "./RunResultService";
import { StyleService } from "./StyleService";
import { ArchStorageEntry } from "../obj/plugin/Architecture";
import { ZoomModuleParent, ZoomService } from "./ZoomService";
import { ComponentService } from "./ComponentService";
import { ServicesHolder } from "rottnest-plugin/schema/ServicesHolder";
import { UtilityService } from "./UtilityService";
import { CallGraphService } from "./CallGraphService";
import { SynchroniseService } from "./SynchroniseService";

type AppTarget = UpdateTrigger & ZoomModuleParent;

/**
 * This is a set of services that have been
 * currently grouped and will be passed to the
 * ArchitectureObjects when they need to interact
 * with the application's services
 */
export class Services {  
  refresh: RefreshService = RefreshService.NoRefresh();
  notify: NotifyService = new NotifyService();
  inputs: InputHookService = new InputHookService();
  valservice: ValidationService = new ValidationService();
  programplugins: ProgramPluginService;
  archplugins: ArchPluginService;
  rrservice: RunResultService;
  zoomService: ZoomService;
  utilityService: UtilityService;
  help: HelpService;
  callgraphService: CallGraphService = new CallGraphService();
  synchroniseService: SynchroniseService = new SynchroniseService();

  constructor(refreshTarget: AppTarget, _container: ServicesHolder,
    archUpdate: ArchUpdateTrigger, schemas: Array<ArchStorageEntry>) {
    
    this.refresh = new RefreshService(refreshTarget);
    this.notify = new NotifyService();
    this.inputs = new InputHookService();
    this.valservice = new ValidationService();
    this.programplugins = ProgramPluginService.GetPluginService();
    this.archplugins = ArchPluginService.GetPluginService(schemas, archUpdate,
      this.refresh, NetworkService.getInstance());
    this.help = new HelpService(this.refresh, this.inputs);
    this.rrservice = new RunResultService();
    this.zoomService = new ZoomService(100, refreshTarget);
    this.utilityService = new UtilityService(this);
  }

  /**
   * Returns itself
   */
  getServices() {
    return this;
  }
  
	/**
	 * Allows the architecture object to retrieve a service
	 * that allows refreshing of the render upon a change of
	 * state within their own architecture
	 */
  getRefreshService(): RefreshService {
  	return this.refresh;
  }

	/**
	 * Allows the architecture to generate notifications
	 * to allow for arch designer and other components to
	 * notify the user
	 */
  getNotifyService(): NotifyService {
  	return this.notify;
  }

	/**
	 * Gets the network services, this allows
	 * the architecture to interact with the application
	 * client and network
	 */
  getNetworkService(): NetworkService {
  	return NetworkService.getInstance();
  }

  /**
   * Gets the input service
   */
  getInputService(): InputHookService {
  	return this.inputs;
  }

  /**
   * Gets the help server
   */
  getHelpService(): HelpService {
  	return this.help;
  }

	/**
	 * Gets the arch plugin service
	 */
	getArchPluginService(): ArchPluginService {
		return this.archplugins;		
	}

	/**
	 * Gets the program plugin service
	 */
	getProgramPluginService(): ProgramPluginService {
			
		return this.programplugins;
	}

	/**
	 * Gets the validation service
	 */
	getValidationService(): ValidationService {
		return this.valservice;
	}

	/**
	 * Gets the run result service
	 */
  getRunResultService(): RunResultService {
    return this.rrservice;
  }

  /**
   * Component service that will 
   * have components that are able to be used by plugins
   */
  getComponentService() {
    return ComponentService.GetInstance()
  }

  /**
   * Gets the zoom service
   */
  getZoomService(): ZoomService {
    return this.zoomService;
  }

  getStyleService(): StyleService {
    return StyleService.GetInstance(this.getRefreshService());
  }


  getUtilityService(): UtilityService {
    return this.utilityService;
  }

  getCallGraphService(): CallGraphService {
    return this.callgraphService;
  }

  getSynchroniseService(): SynchroniseService {
    return this.synchroniseService;
  }
}

/**
 * Hacked up class to effectively create a bad impl on
 * services for the NoArch group
 */
export class NoServices extends Services {
  constructor() {
    super({ triggerUpdate: () => {},
      getModuleStates: () => { return {} as any },
    }, new NoServicesHolder() as any, () => {},
    []);
  }
}

/**
 * Because we need a services holder, we need to also
 * ensure that it can return services too, this is a hacked
 * up class for no-impls
 */
export class NoServicesHolder {

  /**
   * Gets no refresh service
   */
  getRefreshService(): RefreshService {
    return RefreshService.NoRefresh();
  }

	/**
	 * Gets the run result service
	 */
  getRunResultService(): RunResultService {
    return new RunResultService();
  }

  /**
   * Gets the input service
   */
  getInputService(): InputHookService {
    return new InputHookService();
  }

  /**
   * Gets the no notify service
   */
  getNotifyService(): NotifyService {
    return new NotifyService();
  }

  /**
   * Gets the network service
   */
  getNetworkService(): NetworkService {
    return NetworkService.getInstance();
  }

  /**
   * Gets services which is a new instance
   */
  getServices(): Services {
    return new NoServices();
  }

  /**
   * Returns the program plugin service
   */
  getProgramPluginService(): ProgramPluginService {
    return new ProgramPluginService()
  }


  /**
   * Returns the arch plugin service
   */
  getArchPluginService(): ArchPluginService {
    return new ArchPluginService([], () => {}, this.getRefreshService(),
      this.getNetworkService());
  }

  /**
   * Get new instance of Validation Service
   * uses default arguments
   */
  getValidationService(): ValidationService {
    return new ValidationService();
  }
  
  /**
   * Gets the help server
   */
  getHelpService(): HelpService {
    return new HelpService(this.getRefreshService(), this.getInputService());
  }

  /**
   * Gets the zoomservice
   */
  getZoomService() {
    // Return a broken zoom service
    return new ZoomService(100, {} as any);
  }

  getComponentService() {
    return ComponentService.GetInstance()
  }
  
  getStyleService(): StyleService {
    return StyleService.GetInstance(this.getRefreshService());
  }

  getUtilityService(): UtilityService {
    return {} as UtilityService;
  }
}
