import RottnestApplication from "../container/RottnestApplication"
import { ArchCapabilityQuery } from "../schema/arch/ArchContext";


const leftClick = (rott: RottnestApplication) => {
	const aobj = rott.getAppState().getArchitectureObject();
	const notify = rott.getServices().getNotifyService();
	const refserv = rott.getServices().getRefreshService();
	const ctxobj = rott.getUIContext().getCurrentContext();
	if(ctxobj.queryCapability(ArchCapabilityQuery.MakeQuery("CanUndo")).Yes()) {
		if(aobj) {
			debugger;
			console.log('undoing')
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
