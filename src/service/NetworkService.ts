import { AppServiceClient } from "../net/AppService";
import AppSeriveModule from '../net/AppServiceModule.ts';

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
	  this.appService = AppSeriveModule.GetAppServiceInstance();
  }

  /**
   * Provies access to the network service/appservice client
   */
  getNetworkService() {
    return this.appService;
  }
}
