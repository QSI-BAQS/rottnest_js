import RottnestApplication from "../container/RottnestApplication"
import { LoadComponent } from "./LoadExtra";
import { PluginEntry } from "./settings/GeneralSettings";


/**
 * No-op
 */
const leftClick = (_: RottnestApplication) => {
	
}

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
	let loadedVal = String(data);
	console.log(data);
	if(loadedVal.length > 4) {
		output = loadedVal;
	}
	return output;
}

function getArchitectureList(rott: RottnestApplication) {
	const archService = rott.getServices().getArchPluginService();
	const archs = archService.getArchItems();

	return archs;
}

function findSuitableArchitecture(name: string, archList: Array<PluginEntry>) {
	//TODO: Make this mapping dynamic
	const archMap: { [key:string]: string } = {
		'lat2d': 'Four Stage Superconducting',
		'Four Stage Superconducting': 'Four Staged Superconducting',
		'Active Volume': 'Active Volume'
	}
	const mapResult: string | undefined = archMap[name];
	console.log(mapResult);
	if(mapResult !== undefined) {
		//Check archList now

		const result = archList.find(e => e.plgName === mapResult);

		return result;
	} else {
		return undefined;
	}
}

/**
 * Quirky version to embed an input procedure on the loader
 */
export const hiddenInputProc = async(e: any, rott: RottnestApplication) => {
	const reader = new FileReader();
	let toLoad = e.target.files[0];

	
	const notify = rott.getServices().getNotifyService();
	const archserv = rott.getServices().getArchPluginService();
	const refserv = rott.getServices().getRefreshService();

	
	const currentArchObj = rott.getAppState().getArchitectureObject();


	return archserv.requestWithHook(() => {
		if(currentArchObj) {
			const serialiser = currentArchObj.getSerializer();
 
			const currentArchName = currentArchObj.getName();
	
				if(serialiser) {	
					reader.addEventListener('load', () => {
					let result = serialiser.deserialize(CheckedDeserialize(reader.result));

					if(DeserialFailMarkerCheck(result)) {
						const projectArch = result.header.architecture;
						console.log('Attempting to swap, checking')
						if(currentArchName !== projectArch) {
							const archList = getArchitectureList(rott);
							const suitable = findSuitableArchitecture(projectArch, archList);
							console.log(suitable, archList, projectArch);
							console.log('Attempting to swap, getting suitable');
							if(suitable !== undefined) {
								//Trigger a move to a new arch and with the project associated.
								// Get arch schema
								// Use rott to swap
								// Update project
								archserv.saveArchData({
									plgKey: suitable.plgName,
									plgValue: suitable.plgName,
									params: suitable.params
								})
								console.log('Attempting to swap, swapping')
								const newArchObj = rott.getAppState().getArchitectureObject();
								//Needs to be re-interpreted!
								const newSerializer = newArchObj.getSerializer();
								if(newSerializer) {
									
									const newObj = newSerializer.deserialize(CheckedDeserialize(reader.result));
									console.log(newObj);
									if(newObj) {
										newArchObj.setProject(newObj);
										
									}
								} 
							
							}

						
						}
										
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
	})
}


export default { leftClick, auxEvent, extra: LoadComponent }
