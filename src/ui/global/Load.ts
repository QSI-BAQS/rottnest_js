import RottnestApplication from "../container/RottnestApplication"
import { LoadComponent } from "./LoadExtra";
import { PluginEntry } from "../../obj/PluginEntry";
import { NotifyID } from "../../service/NotifyService";
import { ConsoleMessage } from "../../debug/ConsoleMessages";


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
	//console.log(data);
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

function findInRemap(name: string) {
	
	const archMap: { [key:string]: string } = {
		'lat2d': 'Four Stage Superconducting',
		'Superconducting': 'Four Stage Superconducting',
		'Four Stage Superconducting': 'Four Staged Superconducting',
		'Active Volume': 'Active Volume'
	}

	const result = archMap[name];
	if(result) {
		return result;
	} else {
		return name;
	}
}

function findSuitableArchitecture(name: string, archList: Array<PluginEntry>) {
	//TODO: Make this mapping dynamic
	const archMap: { [key:string]: string } = {
		'lat2d': 'Four Stage Superconducting',
		'Superconducting': 'Four Stage Superconducting',
		'Four Stage Superconducting': 'Four Staged Superconducting',
		'Active Volume': 'Active Volume'
	}
	const mapResult: string | undefined = archMap[name];
	if(mapResult !== undefined) {
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
					let result = serialiser
						.deserialize(CheckedDeserialize(reader.result));

					if(DeserialFailMarkerCheck(result)) {
						const projectArch = result.header.architecture;
						if(findInRemap(currentArchName)
							!== findInRemap(projectArch)) {
							const archList = getArchitectureList(rott);
							const suitable = findSuitableArchitecture(
								projectArch, archList);

							if(suitable !== undefined) {
								archserv.setArchitectureWithBuffer(
									{
										plgKey: suitable.plgName,
										plgValue: suitable.plgName,
										params: suitable.params
									},
									reader.result
								);
							}						
						} else {
							currentArchObj.setProject(result as any);
						}
					} else {
						console.warn(ConsoleMessage.Warning.ProjectIO.Load);
					}
				},false);
	
				if(toLoad) {
					reader.readAsText(toLoad);
				}
				notify.makeMessageWithId(
					NotifyID.ProjectIO.LoadSuccess.ID,
					NotifyID.ProjectIO.LoadSuccess.title,
					NotifyID.ProjectIO.LoadSuccess.message);
				refserv.triggerRefresh();
				return true;
			}
		}

		console.warn("Unable to deserialize project");
		notify.makeMessageWithId(
			NotifyID.ProjectIO.LoadError.ID,
			NotifyID.ProjectIO.LoadError.title,
			NotifyID.ProjectIO.LoadError.message);
	
		refserv.triggerRefresh();
		return false
	})
}


export default { leftClick, auxEvent, extra: LoadComponent }
