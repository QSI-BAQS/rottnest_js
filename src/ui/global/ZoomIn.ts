import { ArchCapabilityQuery } from "rottnest-plugin/schema/ArchContext";
import RottnestApplication from "../container/RottnestApplication"
import { noop } from "../../util/Noop";


const leftClick = (rott: RottnestApplication) => {

	const zoomState = rott.getModuleStates().getZoomState();
	const notify = rott.getServices().getNotifyService();
	const refserv = rott.getServices().getRefreshService();
	const ctxobj = rott.getUIContext().getCurrentContext();

	if(ctxobj.queryCapability(ArchCapabilityQuery.MakeQuery("CanZoom")).Yes()) {
		zoomState.zoomIn(25);
	} else {
		notify.makeMessageWithId("zoom-in", "Zoom", "Can't use zoom in now");
		refserv.triggerRefresh();
	}
}

const auxEvent = (_: RottnestApplication) => noop


export default { leftClick, auxEvent }
