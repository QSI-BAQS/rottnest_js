import {AppServiceClient, APP_URL} from './AppService'


let appService: AppServiceClient | null = null 

/**
 * Gets an application service instance
 * Will attempt to connect once requested
 */
export function GetAppServiceInstance() {
	if(appService === null) {
		appService = new AppServiceClient(APP_URL);
	}
	return appService;
}

/**
 * Will close the application service for
 * the network
 */
export function CloseAppService() {
	//appService.shutdown();
	appService = null;
}

/**
 * Checks to see if the connection is ready
 * If the connection is not ready, it will return false
 * otherwise true
 */
export function ConnectionReady(): boolean {

	if(appService !== null) {
		return appService.isConnected();
	} else {
		return false;
	}
}


export default {
	GetAppServiceInstance,
	CloseAppService,
	ConnectionReady
};
