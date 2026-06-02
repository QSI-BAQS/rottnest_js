import { ArchCapabilityQuery } from "rottnest-plugin/schema/ArchContext";
import RottnestApplication from "../container/RottnestApplication";
import { MessageType } from "../../net/Protocol";
import { NotifyID } from "../../service/NotifyService";

const leftClick = (container: RottnestApplication) => {

	const rott = container;
	const ctx = rott.getUIContext().getCurrentContext()
	const notify = rott.getServices().getNotifyService();
	const refserv = rott.getServices().getRefreshService();
	if(ctx.queryCapability(ArchCapabilityQuery.MakeQuery("CanNetwork")).Yes()) {

		const rrService = rott.getServices().getRunResultService();
		rrService.reset();

		const projNet = rott.getAppState()
			.getArchitectureObject()
			.getProject()

		const fmt = rott.getAppState()
			.getArchitectureObject()
			.getFormatter();
		
		const appnet = rott.getAppState()
			.getArchitectureObject()
			.getConnectionManager()
			.getNetworkService();

		const archremap = MessageType.Layout.Run;
		const obj = { "layout" : projNet.forNetwork(fmt) };
		//console.log(obj, projNet)
		appnet.sendObj(archremap, obj);
		notify.makeMessageWithTuple(NotifyID.ArchService.SendArchSuccess);
		refserv.triggerRefresh();
	} else {
		notify.makeMessageWithTuple(NotifyID.ArchService.SendArchError);
		refserv.triggerRefresh();
	}

}

const auxEvent = (_: RottnestApplication) => { }

export default { leftClick, auxEvent }
