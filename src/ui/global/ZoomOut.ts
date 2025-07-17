import RottnestApplication from "../container/RottnestApplication"
import { ArchCapabilityQuery } from "../schema/arch/ArchContext";


const leftClick = (rott: RottnestApplication) => {
	const zoomState = rott.getModuleStates().getZoomState();
	const notify = rott.getServices().getNotifyService();
	const ctxobj = rott.getUIContext().getCurrentContext();

	const refserv = rott.getServices().getRefreshService();
	if(ctxobj.queryCapability(ArchCapabilityQuery.MakeQuery("CanZoom")).Yes()) {
		zoomState.zoomOut(25);
	 
	} else {
		notify.makeMessageWithId("zoom-out", "Zoom", "Can't use zoom out now");
		refserv.triggerRefresh();
	}
}

const auxEvent = (_: RottnestApplication) => { }


export default { leftClick, auxEvent }
