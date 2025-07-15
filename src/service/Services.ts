import { HelpService } from "./HelpService";
import { InputHookService } from "./InputHookService";
import { NetworkService } from "./NetworkService";
import { NotifyService } from "./NotifyService"
import { RefreshService } from "./RefreshService"
import { ProgramPluginService } from "./ProgramPluginService";
import { ArchPluginService } from "./ArchPluginService";
import { UnimplReturn } from "../ui/schema/util/unimpl";
import { ValidationService } from "./ValidatorService";

/**
 * ServicesHolder is the container that will
 * hold a reference to all the services, this is to also
 * produce individual components but also produce a `Services`
 * object
 */
export interface ServicesHolder {

  getRefreshService(): RefreshService;

  getNotifyService(): NotifyService;

  getNetworkService(): NetworkService;

  getInputService(): InputHookService;

  getHelpService(): HelpService;

  getProgramPluginService(): ProgramPluginService;

  getArchPluginService(): ArchPluginService

  getValidationService(): ValidationService;

  getServices(): Services;

}


/**
 * This is a set of services that have been
 * currently grouped and will be passed to the
 * ArchitectureObjects when they need to interact
 * with the application's services
 */
export class Services {  
  refresh: RefreshService = RefreshService.NoRefresh();
  notify: NotifyService = new NotifyService();
  network: NetworkService = new NetworkService();
  inputs: InputHookService = new InputHookService();
  valservice: ValidationService = new ValidationService();
  programplugins: ProgramPluginService;
  archplugins: ArchPluginService;
  help: HelpService;

  constructor(container: ServicesHolder) {
    this.refresh = container.getRefreshService();
    this.notify = container.getNotifyService();
    this.network = container.getNetworkService();
    this.inputs = container.getInputService();
    this.valservice = new ValidationService();
    this.programplugins = new ProgramPluginService(this.refresh, this.network);
    this.archplugins = new ArchPluginService(this.refresh, this.network);
    this.help = new HelpService(this.refresh, this.inputs);
  }
}

/**
 * Hacked up class to effectively create a bad impl on
 * services for the NoArch group
 */
export class NoServices extends Services {
  constructor() {
    super(new NoServicesHolder());
  }
}

/**
 * Because we need a services holder, we need to also
 * ensure that it can return services too, this is a hacked
 * up class for no-impls
 */
export class NoServicesHolder implements ServicesHolder {

  /**
   * Gets no refresh service
   */
  getRefreshService(): RefreshService {
    return RefreshService.NoRefresh();
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
    return new NetworkService();
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
    return UnimplReturn<ProgramPluginService>();
  }


  /**
   * Returns the arch plugin service
   */
  getArchPluginService(): ArchPluginService {
    return UnimplReturn<ArchPluginService>();
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
}
