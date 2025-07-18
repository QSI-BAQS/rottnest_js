import RottnestApplication from "../container/RottnestApplication"
import { LoadComponent } from "./LoadExtra";


/**
 * No-op
 */
const leftClick = (_: RottnestApplication) => { }

/**
 * No-op
 */
const auxEvent = (_: RottnestApplication) => { }

/**
 * Return type for onload
 */
type FileReaderRetType = string | ArrayBuffer | null;


/**
 * `false` is a failure marker in our check function,
 * if it is not the type we expect, it will return false and therefore
 * we will check to see if it is that (which will return false),
 * otherwise if it is normal, it will be true
 */
function DeserialFailMarkerCheck(data: any): boolean {
	if(data === false && data instanceof Boolean) {
		return false;
	}
	return true;
}

/**
 * Checks that the deserialisation can occur.
 * it will return an empty object
 */
function CheckedDeserialize(data: FileReaderRetType): string  {
	let output = 'false';
	if(data instanceof String) {
		output = String(data);
	}
	return output;
}

/**
 * Quirky version to embed an input procedure on the loader
 */
export const hiddenInputProc = (e: any, rott: RottnestApplication) => {
	const reader = new FileReader();
	let toLoad = e.target.files.item(0);
	
	const notify = rott.getServices().getNotifyService();
	const refserv = rott.getServices().getRefreshService();
	const currentArchObj = rott.getAppState().getArchitectureObject();
	if(currentArchObj) {
		const serialiser = currentArchObj.getSerializer();

	
			if(serialiser) {	
			reader.addEventListener('load', () => {
				let result = serialiser.deserialize(CheckedDeserialize(reader.result));

				
				if(DeserialFailMarkerCheck(result)) {
					//Attach to the object
					currentArchObj.setProject(result);
				} else {
					console.warn("Fail marker detected, outputting notification to user");
				}
			},false);
	
			if(toLoad) {
				reader.readAsText(toLoad);
			}
			notify.makeMessageWithId("load-good", "Load Operation",
			"The file has been loaded");
			refserv.triggerRefresh();
			return true;
		}
	}
	console.warn("Unable to deserialize project");
	notify.makeMessageWithId("load-err", "Load Operation",
		"The file did not deserialize correctly");
	
	refserv.triggerRefresh();
	return false
}


export default { leftClick, auxEvent, extra: LoadComponent }
