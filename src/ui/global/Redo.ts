import RottnestApplication from "../container/RottnestApplication"
import { ArchCapabilityQuery } from "../schema/arch/ArchContext";


const leftClick = (rott: RottnestApplication) => {

	
	const aobj = rott.getAppState().getArchitectureObject();
	const notify = rott.getServices().getNotifyService();
	const refserv = rott.getServices().getRefreshService();
	const ctxobj = rott.getUIContext().getCurrentContext();
	if(ctxobj.queryCapability(ArchCapabilityQuery.MakeQuery("CanUndo")).Yes()) {
		if(aobj) {
			aobj.getDesigner().getActionTracker().performRedo();
		} else {
			notify.makeMessageWithId("undo-on", "Redo", "Unable to apply it to object");
		}
		refserv.triggerRefresh();
	} else {
		
			notify.makeMessageWithId("undo-on", "Redo", "You can not use redo here");
			refserv.triggerRefresh();
	}
}

const auxEvent = (_: RottnestApplication) => {}


export default { leftClick, auxEvent }
