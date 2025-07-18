import { RottRouterTypesMSG } from "../../../../../net/Messages";


export class SuperconductingParserOperations {
  
	retrieveRouters(subTypes: RottnestKindMap, data: any) {
		const msgContainer =
			new RottRouterTypesMSG(subTypes);
		data.parseData();
		const realData = data
			.parseDataTo(msgContainer);
		if(realData) {
			return realData.subtypeMap;
		}
		return null;
	}

	decodeGraph(data: any) {
		const msgContainer = new RottGraphMSG();
		data.parseData();
		const realData = data
			.parseDataTo(msgContainer);
		if(realData) {
			return realData.graph;
		}
		return null;
	}

	retrieveSubTypes(data: any) {
				
		const msgContainer =
			new RottSubTypesMSG();
		data.parseData();
		const realData = data
			.parseDataTo(msgContainer);
		if(realData) {
			return realData.regionKinds;
		}
		return null;
	}
	
	submitArch(schedMsg: RottArchMSG) {
		if(this.socket) {
			this.socket.send(schedMsg.toJsonStr());
		}
	}
}

