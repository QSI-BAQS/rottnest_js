import {AppServiceClient, GetAppServiceInstance} from './AppService'


//let appService: AppServiceClient | null = null 

/**
 * Gets an application service instance
 * Will attempt to connect once requested
 */
export function GetNetworkInstance(): AppServiceClient {
	return GetAppServiceInstance();
}

/**
 * Will close the application service for
 * the network
 */
/*export function CloseAppService() {
	//appService.shutdown();
}*/

/**
 * Checks to see if the connection is ready
 * If the connection is not ready, it will return false
 * otherwise true
 */
export function ConnectionReady(): boolean {

	if(GetNetworkInstance() !== null) {
		return GetNetworkInstance().isConnected();
	} else {
		return false;
	}
}


export default {
	GetNetworkInstance,
	ConnectionReady
};
