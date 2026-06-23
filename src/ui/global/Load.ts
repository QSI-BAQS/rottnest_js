import RottnestApplication from "../container/RottnestApplication"
import { LoadComponent } from "./LoadExtra";
import { PluginEntry } from "../../obj/PluginEntry";
import { NotifyID } from "../../service/NotifyService";
import { ConsoleMessage } from "../../debug/ConsoleMessages";
import { noop } from "../../util/Noop";


const LOAD_BAD_DESERIALIZATION = "Unable to deserialize project";
/**
 * No-op
 */
const leftClick = (_: RottnestApplication) => noop

/**
 * No-op
 */
const auxEvent = (_: RottnestApplication) => noop

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

/**
  * Attempts to find a suitable architecture
  * if it does not map correctly - This is due to some old naming
  * of particular objects
  */
function findSuitableArchitecture(name: string, archList: Array<PluginEntry>) {
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

	let toLoad = e.target.files[0];
	const reader = new FileReader();
	const netserv = rott.getServices().getNetworkService().getClient();	
	const notify = rott.getServices().getNotifyService();
	const archserv = rott.getServices().getArchPluginService();
	const refserv = rott.getServices().getRefreshService();
	const currentArchObj = rott.getAppState().getArchitectureObject();

	if(!netserv.isConnected()) {
		notify.makeMessageWithTuple(NotifyID.ProjectIO.LoadConnectionError);		
	} else {
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
					notify.makeMessageWithTuple(NotifyID.ProjectIO.LoadSuccess);
					refserv.triggerRefresh();
					return true;
				}
			}

			console.warn(LOAD_BAD_DESERIALIZATION);
			notify.makeMessageWithTuple(NotifyID.ProjectIO.LoadError);
	
			refserv.triggerRefresh();
			return false
		})
	}
}


export default { leftClick, auxEvent, extra: LoadComponent }
