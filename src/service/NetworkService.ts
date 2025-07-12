import { AppServiceClient } from "../net/AppService";
import AppServiceModule from "../net/AppServiceModule";



/**
 * Network Service, will provide access to necessary
 * websocket objects and bindings
 */
export class NetworkService {

  appService: AppServiceClient;

  /**
   * Constructs an app service client as part of connecting
   * to the client
   */
  constructor() { 
	  this.appService = AppServiceModule.GetAppServiceInstance();
  }

  /**
   * Provies access to the network service/appservice client
   */
  getNetworkService() {
    return this.appService;
  }
}
