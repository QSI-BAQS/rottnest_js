import { ArchitectureConnectionManager } from "../../ArchSchema";
import { RottnestRouterKindMap } from "../obj/RegionKindMap";
import { RottArchMSG, RottGraphMSG, RottRouterTypesMSG, RottSubTypesMSG } from "./NetMessages";


export class SuperconductingParserOperations {
  
	retrieveRouters(subTypes: RottnestRouterKindMap, data: any) {
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
	
	submitArch(obj: ArchitectureConnectionManager, schedMsg: RottArchMSG) {
		let socket = obj.getNetworkService();
		if(socket) {
			socket.sendMessage(schedMsg.toJsonStr());
		}
	}
}

