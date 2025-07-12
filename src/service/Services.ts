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

  constructor(container: ServicesHolder) {
    this.refresh = container.getRefreshService();
    this.notify = container.getNotifyService();
    this.network = container.getNetworkService();
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
  
  getRefreshService(): RefreshService {
    return RefreshService.NoRefresh();
  }

  getNotifyService(): NotifyService {
    return new NotifyService();
  }

  getNetworkService(): NetworkService {
    return new NetworkService();
  }

  getServices(): Services {
    return new NoServices();
  }
}
