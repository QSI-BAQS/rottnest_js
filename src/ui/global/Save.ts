
import RottnestApplication from "../container/RottnestApplication"
import { ArchCapabilityQuery } from "../schema/arch/ArchContext";
import { SaveProject } from "../../util/FileDownload";


/**
 * This triggers a save of the project, which will:
 * 	* ProjectDetails
 * 	* RegionDataList
 */
const leftClick = (rott: RottnestApplication) => {
	
	const ctx = rott.getUIContext().getCurrentContext()
	const notify = rott.getServices().getNotifyService();
	const refserv = rott.getServices().getRefreshService();

	if(ctx.queryCapability(ArchCapabilityQuery.MakeQuery("CanSave")).Yes()) {

		const proj = rott.getAppState()
			.getArchitectureObject()
			.getProject();

		const serialiser = rott.getAppState()
			.getArchitectureObject()
			.getSerializer();

		const fmt = rott.getAppState()
			.getArchitectureObject()
			.getFormatter();


		const projserialized = serialiser.serialize(proj.forFile(fmt));
		const projname = proj.header.name;

		//TODO: some of the functions should subsystems
		SaveProject(projname, projserialized);

		notify.makeMessageWithId('save-arch-good', "File Operations",
			"File has been saved");
		refserv.triggerRefresh();
	} else {
		
		notify.makeMessageWithId('save-arch-err', "File Operations",
			"Unable to convert/save the file, this isn't supported");
		refserv.triggerRefresh();
	}
}


const auxEvent = (_: RottnestApplication) => { }



export default { leftClick, auxEvent }
