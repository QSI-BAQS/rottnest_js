import {AppServiceClient, GetAppServiceInstance} from './AppService'

/**
 * Gets an application service instance
 * Will attempt to connect once requested
 */
export function GetNetworkInstance(): AppServiceClient {
	return GetAppServiceInstance();
}

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

/**
  * Gets the functions to check to see
  * if a connection is ready or get the singleton
  * instance of the connection
  */
export default {
	GetNetworkInstance,
	ConnectionReady
};
