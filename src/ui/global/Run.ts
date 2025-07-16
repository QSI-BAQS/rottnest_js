import ArchConverter from "../../util/ArchConverter";
import RottnestApplication from "../container/RottnestApplication";
import { RottArchMSG } from "../schema/arch/lat2d/net/NetMessages";

//TODO: Delegate this to the architecture
const leftClick = (container: RottnestApplication) => {
	const rottContainer = container;
	const rrBuf = rottContainer.getRRBuffer();
	const appService = rottContainer.commData.appService;
	const projAssembly = rottContainer.getProjectAssembly();
	const tschedProject = ArchConverter.ToTSched(projAssembly);
	
	if(tschedProject) {
		rrBuf.reset();
		appService.submitArch(
			new RottArchMSG(tschedProject))
	}
}

const auxEvent = (_: RottnestApplication) => { }

export default { leftClick, auxEvent }
