

import { AppServiceClient } from "../../../../../net/AppService";
import { RottRunResultMSG } from "../../../../../net/Messages";
import { Superconducting2DArchitecture } from "../Superconducting.ts";
import { CommEventOps, CommOpQueue, CommsActions } from '../../../global/ops/CommsOps.ts';

import { MSG_GLOBAL_MAP, MSG_REMAP } from "../../../../../net/MessageRemap";
import { SuperconductingParserOperations } from "./NetParserOps.ts";

/**
 *
 * RTCCommEvents is a collection of events that is relevant for the Superconducting2DArchitecture
 * Separate events can be separated into another container or context type
 * That will be the focus.
 */
export const RTCCommEvents: CommEventOps<Superconducting2DArchitecture> = {
  recvSubType: {
    evkey: MSG_REMAP['subtype'],
    evtrigger: (appService: AppServiceClient, obj: Superconducting2DArchitecture, m: any) => {
    	
			let parserOps = new SuperconductingParserOperations();
      let kinds = parserOps
				.retrieveSubTypes(m);
			appService.consumeFromQueue();
			if(kinds) {

				obj.getStateData().uistate.updateSubTypes(kinds);

			}
		}
  },
  recvGetRouter: {
    evkey: MSG_REMAP['get_router'],
    evtrigger: (appService: AppServiceClient, obj: Superconducting2DArchitecture, m: any) => {
    	let subTypes = obj.getStateData().uistate.subTypes;
			let parserOps = new SuperconductingParserOperations();
      let kinds = parserOps
					.retrieveRouters(
						subTypes,
						m);
			if(kinds) {
	    	obj.getStateData().uistate.updateRouterList(kinds);
			}
			appService.consumeFromQueue();
		}
  },
  recvUseArch: {
    evkey: MSG_REMAP['use_arch'],
    evtrigger: (appService: AppServiceClient, _: Superconducting2DArchitecture, m: any) => {
      let someMsg = m 
				if(someMsg) {
					let arch_id = someMsg.getJSON().payload.arch_id;
					appService.runResult(new RottRunResultMSG(arch_id));
				}
				appService.consumeFromQueue();
		  }
  },
  /*recvErr: {
    evkey: MSG_REMAP['err'],
    evtrigger: (_: AppServiceClient, obj: Superconducting2DArchitecture, m: any) => {
    
      let someMsg = JSON.stringify(m); 
			obj.state.errorMessage = someMsg;
			obj.state.errorDisplay = true;
			console.error(`Error occurred: ${someMsg}`);
			obj.triggerUpdate();
		}
	},*/

  recvRunResult: {
    evkey: MSG_REMAP['run_result'],
    evtrigger: (_: AppServiceClient, obj: Superconducting2DArchitecture, m: any) => {
    
      //TODO Set the graph id for
			//the msg to be sent for
			//get_graph
			let rrBuf = obj.services.getRunResultService();
			let json = m.interpretedData; 
			let modMeta = obj.meta;
		
			//A lot of heavy lifting done with this
			//to address a terrible messaging system
			if(json.payload.status === 'pending') {
				//early return as we have no data
				return;
			}
			const [rkind, mdat] = rrBuf.decodeAndSort(json.payload);
			//appService
			//	.sendObj('get_graph','');
			
			let shouldUpdate = false;
			if(rkind === "CUIDObj" || rkind === "CUIDTotal") {

				modMeta.setEnable("CallGraph")
				modMeta.setEnable("Chart")
	
				shouldUpdate = true;
			}
			if(rkind === "VisualResult") {
				obj.getStateData().getVisState().getVizData = mdat;
				modMeta.setEnable("Visualiser");
				shouldUpdate = true;
			}
			if(shouldUpdate) {
				obj.services.getRefreshService().triggerRefresh();
			}
		}
	},

  recvGetRootGraph: {
    evkey: MSG_GLOBAL_MAP['get_root_graph'],
    evtrigger: (appService: AppServiceClient, obj: Superconducting2DArchitecture, m: any) => {
			let parserOps = new SuperconductingParserOperations();
      let graph = parserOps
				.decodeGraph(m);
			if(graph) {
				obj.getStateData().getCallGraphState().setGraphViewData(graph);
			}       
			appService.consumeFromQueue();
		}
	},

	recvGetArgs: {
    evkey: MSG_REMAP['get_args'],
    evtrigger: (appService: AppServiceClient, _r: Superconducting2DArchitecture, _m: any) => {
      /*let kinds = appService
					.retrieveArgs(m);
				if(kinds) {
				selfRef
				.updateArgsList(kinds);
				
				}*/
			appService.consumeFromQueue();
		}
	  
	}
}

/**
 * Initial dispatch operations that occur when `open` even occurs
 * on the socket
 */
const RTCDispatchOperations = [
	{
		opkey: "initial",
		operation: (appService: AppServiceClient, _obj: Superconducting2DArchitecture) => {
			if(appService.isConnected()) {	
				appService.enqueueMessage(MSG_REMAP['subtype']);
				appService.enqueueMessage(MSG_REMAP['get_router']);
				appService.enqueueMessage(MSG_GLOBAL_MAP['get_root_graph']);
				appService.consumeFromQueue();
			}
		}
	},
	
]

/**
 * CommunicationActions for Superconducting2DArchitecture, allows one
 * to define it in a file and pass it to where it is needed
 */
export const RTCCommActions
  = CommsActions.MakeCommsWith<Superconducting2DArchitecture>(RTCCommEvents);


/**
 * Open operations that will be triggered, it is just a list of 1
 */
export const RTCOpenOperations
	= CommOpQueue.MakeDispatchWith<Superconducting2DArchitecture>(RTCDispatchOperations)
