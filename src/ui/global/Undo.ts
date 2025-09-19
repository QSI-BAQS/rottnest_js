import { ArchCapabilityQuery } from "rottnest-plugin/schema/ArchContext";
import RottnestApplication from "../container/RottnestApplication"


const leftClick = (rott: RottnestApplication, _e?: any) => {
	const aobj = rott.getAppState().getArchitectureObject();
	const notify = rott.getServices().getNotifyService();
	const refserv = rott.getServices().getRefreshService();
	const ctxobj = rott.getUIContext().getCurrentContext();
	if(ctxobj.queryCapability(ArchCapabilityQuery.MakeQuery("CanUndo")).Yes()) {
		if(aobj) {
			aobj.getDesigner().getActionTracker().performUndo();
		} else {
			notify.makeMessageWithId("undo-on",
				"Undo", "Unable to apply it to object");
		}
		refserv.triggerRefresh();
	} else {
		
			notify.makeMessageWithId("undo-on", "Undo", "You can not use undo here");
			refserv.triggerRefresh();
	}
}

const auxEvent = (_: RottnestApplication) => { }


export default { leftClick, auxEvent }
