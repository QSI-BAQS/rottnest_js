import RottnestApplication from "../container/RottnestApplication";
import { ArchCapabilityQuery } from "../schema/arch/ArchContext";

const leftClick = (container: RottnestApplication) => {

	const rott = container;
	const ctx = rott.getUIContext().getCurrentContext()
	const notify = rott.getServices().getNotifyService();
	const refserv = rott.getServices().getRefreshService();

	if(ctx.queryCapability(ArchCapabilityQuery.MakeQuery("CanSend")).Yes()) {
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

		appnet.sendObject("use_arch", projNet.forNetwork(fmt));

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
