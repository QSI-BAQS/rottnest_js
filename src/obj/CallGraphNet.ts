import { ArchitectureConnectionManager } from "rottnest-plugin/schema/ArchSchema";
import { MessageType } from "../net/Protocol";

export class RottArchMSG {
	
	tschedData: any;

	constructor(tsched: any) {
		this.tschedData = tsched;
	}

	toJsonStr(): string {
		return JSON.stringify({
			message: MessageType.Layout,
			originator: "rottnest",
			payload: this.tschedData,
		});
	}
}


export class RottGraphMSG  {

	graph = {
		graph: new Map(),
	};

	fromStr(_: string): this | null {
		return null;
	}

	fromJSON(jsonObj: any): this | null {
		//console.log(jsonObj)
		//Assume it is a JSON object
		const data = jsonObj['payload'];
		// TODO: Fix this!
		const graph = data['graph_view']['graph'];
		for(const k in graph) {

			const cobj = graph[k];
			this.graph.graph.set(cobj.id,cobj);

		}
		return this;
	}
}


export class NetParserOperations {
  

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

	
	submitArch(obj: ArchitectureConnectionManager, schedMsg: RottArchMSG) {
		let socket = obj.getNetworkService();
		if(socket) {
			socket.sendMessage(schedMsg.toJsonStr());
		}
	}
}



export class RottStatusResponseMSG  {

	curesult: any = {};

	fromStr(_: string) { return null; }

	fromJSON(obj: any) {
		
		const data = obj['payload'];
		this.curesult.volumes = data.volumes;
		this.curesult.t_source = data.t_source;
		this.curesult.status = data.status;
		this.curesult.cu_id = data.cu_id;
		this.curesult.vis_obj = data.vis_obj === undefined ?
			null : data.vis_obj;
		

		return this;
	}
}



export class RottnestParserOperations {
  

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

	
	submitArch(obj: ArchitectureConnectionManager, schedMsg: RottArchMSG) {
		let socket = obj.getNetworkService();
		if(socket) {
			socket.sendMessage(schedMsg.toJsonStr());
		}
	}
}


