import { ArchCapabilityQuery } from "rottnest-plugin/schema/ArchContext";
import RottnestApplication from "../container/RottnestApplication"
import { noop } from "../../util/Noop";


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

const auxEvent = (_: RottnestApplication) => noop


export default { leftClick, auxEvent }
