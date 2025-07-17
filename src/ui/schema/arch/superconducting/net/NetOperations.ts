

import { AppServiceClient } from "../../../../../net/AppService";
import { RottRunResultMSG } from "../../../../../net/Messages";
import { Lattice2DArchitecture } from "../Lattice2D.ts";
import { CommEventOps, CommOpQueue, CommsActions } from '../../../global/ops/CommsOps.ts';

import { MSG_REMAP } from "../../../../../net/MessageRemap";

/**
 *
 * RTCCommEvents is a collection of events that is relevant for the Lattice2DArchitecture
 * Separate events can be separated into another container or context type
 * That will be the focus.
 */
export const RTCCommEvents: CommEventOps<Lattice2DArchitecture> = {
  recvSubType: {
    evkey: MSG_REMAP['subtype'],
    evtrigger: (appService: AppServiceClient, obj: Lattice2DArchitecture, m: any) => {
      let kinds = appService
				.retrieveSubTypes(m);
			appService.consumeFromQueue();
			if(kinds) {
				obj.updateSubTypes(kinds);

			}
		}
  },
  recvGetRouter: {
    evkey: MSG_REMAP['get_router'],
    evtrigger: (appService: AppServiceClient, obj: Lattice2DArchitecture, m: any) => {
      let kinds = appService
					.retrieveRouters(
						obj.state.subTypes,m);
			if(kinds) {
				obj.updateRouterList(kinds);
			}
			appService.consumeFromQueue();
		}
  },
  recvUseArch: {
    evkey: MSG_REMAP['use_arch'],
    evtrigger: (appService: AppServiceClient, _: Lattice2DArchitecture, m: any) => {
      let someMsg = m 
				if(someMsg) {
					let arch_id = someMsg.getJSON().payload.arch_id;
					appService.runResult(new RottRunResultMSG(arch_id));
				}
				appService.consumeFromQueue();
		  }
  },
  recvErr: {
    evkey: MSG_REMAP['err'],
    evtrigger: (_: AppServiceClient, obj: Lattice2DArchitecture, m: any) => {
    
      let someMsg = JSON.stringify(m); 
			obj.state.errorMessage = someMsg;
			obj.state.errorDisplay = true;
			console.error(`Error occurred: ${someMsg}`);
			obj.triggerUpdate();
		}
	},

  recvRunResult: {
    evkey: MSG_REMAP['run_result'],
    evtrigger: (_: AppServiceClient, obj: Lattice2DArchitecture, m: any) => {
    
      //TODO Set the graph id for
			//the msg to be sent for
			//get_graph
			let rrBuf = obj.getRRBuffer();
			let json = m.interpretedData; 
		
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
				obj.state.tabData
				.availableTabs[3]
					= true;
				
				obj.state.tabData
				.availableTabs[1]
					= true;
				shouldUpdate = true;
			}
			if(rkind === "VisualResult") {
				obj.state.visData = mdat;
				obj.state.tabData
				.availableTabs[2]
					= true;
				shouldUpdate = true;
			}
			if(shouldUpdate) {
				obj.triggerUpdate();
			}
			//This needs to trigger
			//a retrieval on get_graph
		}
	},

  recvGetRootGraph: {
    evkey: MSG_REMAP['get_root_graph'],
    evtrigger: (appService: AppServiceClient, obj: Lattice2DArchitecture, m: any) => {
      let graph = appService
				.decodeGraph(m);
			if(graph) {
				obj.getVisualiser().setViewData(graph);
			}       
			appService.consumeFromQueue();
		}
	},

	recvGetArgs: {
    evkey: MSG_REMAP['get_args'],
    evtrigger: (appService: AppServiceClient, _r: Lattice2DArchitecture, _m: any) => {
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
		operation: (appService: AppServiceClient, _obj: Lattice2DArchitecture) => {
			if(appService.isConnected()) {	
				appService.enqueueMessage(MSG_REMAP['subtype']);
				appService.enqueueMessage(MSG_REMAP['get_router']);
				appService.enqueueMessage(MSG_REMAP['get_root_graph']);
				appService.consumeFromQueue();
			}
		}
	},
	
]

/**
 * CommunicationActions for Lattice2DArchitecture, allows one
 * to define it in a file and pass it to where it is needed
 */
export const RTCCommActions
  = CommsActions.MakeCommsWith<Lattice2DArchitecture>(RTCCommEvents);


/**
 * Open operations that will be triggered, it is just a list of 1
 */
export const RTCOpenOperations
	= CommOpQueue.MakeDispatchWith<Lattice2DArchitecture>(RTCDispatchOperations)
