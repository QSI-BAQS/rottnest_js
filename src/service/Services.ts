import { HelpService } from "./HelpService";
import { InputHookService } from "./InputHookService";
import { NetworkService } from "./NetworkService";
import { NotifyService } from "./NotifyService"
import { RefreshService } from "./RefreshService"

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
  help: HelpService;

  constructor(container: ServicesHolder) {
    this.refresh = container.getRefreshService();
    this.notify = container.getNotifyService();
    this.network = container.getNetworkService();
    this.inputs = container.getInputService();
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
   * Gets the help server
   */
  getHelpService(): HelpService {
    return new HelpService(this.getRefreshService(), this.getInputService());
  }
}
