import { AppServiceClient } from "../net/AppService";
import AppServiceModule from '../net/AppServiceModule.ts';
import { AppMessageMapper } from "../net/Message.ts";

/**
 * Network Service, will provide access to necessary
 * websocket objects and bindings
 */
export class NetworkService {

  appService: AppServiceClient;
	appMapper: AppMessageMapper;
	
  /**
   * Constructs an app service client as part of connecting
   * to the client
   */
  constructor() { 
	  this.appService = AppServiceModule.GetNetworkInstance();
	  this.appMapper = AppMessageMapper.Default();
  }

  request(messageKind: string, payloadTag: string, payload: any) {
  	const appservice = this.getNetworkService();
		const obj: any = {};
		obj[payloadTag] = payload;
		appservice.sendObject(messageKind, obj)
  	
  }

	isConnected() {
		return this.appService.isConnected();
	}

  /**
   * Stops the service from continuing, will ignore instructions (not implemented)
   */
  stopService() {
    // NO-OP
  }

	/**
	  * Gets the application service
	  */
  getClient() {
  	return this.appService;
  }

  /**
   * Provies access to the network service/appservice client
   */
  getNetworkService() {
    return this.appService;
  }
}
