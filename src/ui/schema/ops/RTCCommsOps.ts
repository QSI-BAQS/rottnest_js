import { AppServiceClient } from "../../../net/AppService";
import { MSG_REMAP, MSG_GLOBAL_MAP } from "../../../net/MessageRemap";
import { RottRunResultMSG } from "../../../net/Messages";
import RottnestContainer from "../../container/RottnestContainer";
import { CommEventOps, CommOpQueue, CommsActions } from "./CommsOps";

import {ProgramPlugin } from '../../../model/plugin/Program.ts'
import { ArchitecturePlugin } from '../../../model/plugin/Architecture.ts'
/**
 *
 * RTCCommEvents is a collection of events that is relevant for the RottnestContainer
 * Separate events can be separated into another container or context type
 * That will be the focus.
 * 
 * 
 */
export const RTCCommEvents: CommEventOps<RottnestContainer> = {
  recvSubType: {
    evkey: MSG_REMAP['subtype'],
    evtrigger: (appService: AppServiceClient, rtc: RottnestContainer, m: any) => {
      let kinds = appService
				.retrieveSubTypes(m);
			if(kinds) {
				rtc.updateSubTypes(kinds);

				appService
				.sendMessage(MSG_REMAP['get_router']);
			}
		}
  },
  recvArchList: {
    evkey: MSG_GLOBAL_MAP['arch_list'],
    evtrigger: (_appService: AppServiceClient, rtc: RottnestContainer, m: any) => {
    	
			const plist = m.getJSON().payload.arch_list;
			let newArchs: Array<ArchitecturePlugin> = [];
			console.log(plist)
			for(const prg of plist) {
				newArchs.push({
					identifier: prg['arch_name'],
					api_map: {}
				})
			}
			
    	rtc.state.appStateData.archData.architectures = newArchs;
    	if(newArchs.length > 0) {
    		rtc.state.appStateData.archData.current = newArchs[0]
    	}
    	console.log("triggering: arch_list")
    	rtc.triggerUpdate();
		}
  },
  recvProgramGetCurrent: {
    evkey: MSG_GLOBAL_MAP['program_get_current'],
    evtrigger: (_appService: AppServiceClient, rtc: RottnestContainer, m: any) => {
			const prg = m.getJSON().payload.prg;
			let newProg: ProgramPlugin = {
				name: prg['prg_name'],
				params: prg['prg_params'].map((p: any) =>
					{ return{ param: p.name, kind: 'any'}}) //TODO: Fix the kind
			};
			
    	rtc.state.appStateData.progData.current = newProg;
    	console.log("triggering: get_current_program")
    	rtc.triggerUpdate();
		}
  },
  recvProgramList: {
    evkey: MSG_GLOBAL_MAP['program_list'],
    evtrigger: (_appService: AppServiceClient, rtc: RottnestContainer, m: any) => {
			const plist = m.getJSON().payload.prg_list;
			let newProgData: Array<ProgramPlugin> = [];
			console.log(plist)
			for(const prg of plist) {
				newProgData.push({
					name: prg['name'],
					params: prg['params'].map((p: any) =>
						{ return{ param: p.name, kind: 'any'}}) //TODO: Fix the kind
				})
			}
			
    	rtc.state.appStateData.progData.programs = newProgData
    	rtc.triggerUpdate();
		}
  },
  recvArchConfig: {
    evkey: MSG_GLOBAL_MAP['arch_get_config'],
    evtrigger: (_appService: AppServiceClient, rtc: RottnestContainer, m: any) => {
    	rtc.state.appStateData.archData.config = m['config']
    	rtc.triggerUpdate();
		}
  },
  recvProgramConfig: {
    evkey: MSG_GLOBAL_MAP['program_get_config'],
    evtrigger: (_appService: AppServiceClient, rtc: RottnestContainer, m: any) => {
    	rtc.state.appStateData.progData.config = m['config']
    	rtc.triggerUpdate();
		}
  },
  recvGetRouter: {
    evkey: MSG_REMAP['get_router'],
    evtrigger: (appService: AppServiceClient, rtc: RottnestContainer, m: any) => {
      let kinds = appService
					.retrieveRouters(
						rtc.state.subTypes,m);
				if(kinds) {
					rtc.updateRouterList(kinds);
				}
		}
  },
  recvUseArch: {
    evkey: MSG_REMAP['use_arch'],
    evtrigger: (appService: AppServiceClient, _: RottnestContainer, m: any) => {
      let someMsg = m 
				if(someMsg) {
					let arch_id = someMsg.getJSON().payload.arch_id;
					appService.runResult(new RottRunResultMSG(arch_id));
				}
		  }
  },
  recvErr: {
    evkey: MSG_REMAP['err'],
    evtrigger: (_: AppServiceClient, rtc: RottnestContainer, m: any) => {
    
      let someMsg = JSON.stringify(m); 
			rtc.state.errorMessage = someMsg;
			rtc.state.errorDisplay = true;
			console.error(`Error occurred: ${someMsg}`);
			rtc.triggerUpdate();
		}
	},

  recvRunResult: {
    evkey: MSG_REMAP['run_result'],
    evtrigger: (_: AppServiceClient, rtc: RottnestContainer, m: any) => {
    
      //TODO Set the graph id for
			//the msg to be sent for
			//get_graph
			let rrBuf = rtc.getRRBuffer();
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
				rtc.state.tabData
				.availableTabs[3]
					= true;
				
				rtc.state.tabData
				.availableTabs[1]
					= true;
				shouldUpdate = true;
			}
			if(rkind === "VisualResult") {
				rtc.state.visData = mdat;
				rtc.state.tabData
				.availableTabs[2]
					= true;
				shouldUpdate = true;
			}
			if(shouldUpdate) {
				rtc.triggerUpdate();
			}
			//This needs to trigger
			//a retrieval on get_graph
		}
	},

  recvGetRootGraph: {
    evkey: MSG_REMAP['get_root_graph'],
    evtrigger: (appService: AppServiceClient, rtc: RottnestContainer, m: any) => {
      let graph = appService
				.decodeGraph(m);
			if(graph) {
				rtc.state.graphViewData
				= graph;
			}       
		}
	},

	recvGetArgs: {
    evkey: MSG_REMAP['get_args'],
    evtrigger: (_a: AppServiceClient, _r: RottnestContainer, _m: any) => {
      /*let kinds = appService
					.retrieveArgs(m);
				if(kinds) {
				selfRef
				.updateArgsList(kinds);
				
				}*/
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
		operation: (appService: AppServiceClient, _rtc: RottnestContainer) => {
			if(appService.isConnected()) {	
				appService.sendMessage(MSG_REMAP['subtype']);
				appService.sendMessage(MSG_REMAP['get_root_graph']);
				appService.sendMessage(MSG_GLOBAL_MAP['arch_list']);
				appService.sendMessage(MSG_GLOBAL_MAP['program_list']);
				appService.sendMessage(MSG_GLOBAL_MAP['program_get_current']);
			}
		}
	},
	
]

/**
 * CommunicationActions for RottnestContainer, allows one
 * to define it in a file and pass it to where it is needed
 */
export const RTCCommActions
  = CommsActions.MakeCommsWith<RottnestContainer>(RTCCommEvents);


/**
 * Open operations that will be triggered, it is just a list of 1
 */
export const RTCOpenOperations
	= CommOpQueue.MakeDispatchWith<RottnestContainer>(RTCDispatchOperations)
