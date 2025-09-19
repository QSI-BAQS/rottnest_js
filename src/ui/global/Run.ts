import { ArchCapabilityQuery } from "rottnest-plugin/schema/ArchContext";
import RottnestApplication from "../container/RottnestApplication";

const leftClick = (container: RottnestApplication) => {

	const rott = container;
	const ctx = rott.getUIContext().getCurrentContext()
	const notify = rott.getServices().getNotifyService();
	const refserv = rott.getServices().getRefreshService();

	if(ctx.queryCapability(ArchCapabilityQuery.MakeQuery("CanNetwork")).Yes()) {

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

		const netmap = rott.getAppState()
			.getArchitectureObject()
			.getConnectionManager()
			.getNetworkMap();

		//TODO: Getting the remap
		const archremap = netmap.get('use_arch')!;
		const obj = projNet.forNetwork(fmt);
		console.log(obj, projNet)
		appnet.sendObj(archremap, obj);

		notify.makeMessageWithId('send-arch-good', "Network Communications",
			"Object has been sent to process-pool");
		refserv.triggerRefresh();
	} else {
		notify.makeMessageWithId('send-arch-err', "Network Communications",
			"Unable to send object to process-pool");
		refserv.triggerRefresh();
	}

}

const auxEvent = (_: RottnestApplication) => { }

export default { leftClick, auxEvent }
