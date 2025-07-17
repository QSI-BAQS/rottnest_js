import { AppServiceClient } from "../net/AppService";
import AppServiceModule from '../net/AppServiceModule.ts';

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
   * Starts the network service
   */
  startService() {
		/*const appReady = AppServiceModule
			.ConnectionReady();
		const appService = AppServiceModule
			.GetAppServiceInstance();
		const selfRef = this;
		
		if(appReady) { return; }

		selfRef.rtcCommsActions.ApplyInternal(
			selfRef.commData.appService, selfRef);

		appService.registerOpenFn(() => { selfRef
			.rtcCommsDispatch.applyAll(appService, selfRef); });
		
		this.commData.appService.connect();*/
  }

  /**
   * Stops the service from continuing, will ignore instructions (not implemented)
   */
  stopService() {
    
  }

  /**
   * Provies access to the network service/appservice client
   */
  getNetworkService() {
    return this.appService;
  }
}
