

import { AppServiceClient } from "../../../../net/AppService";
import { ProgramPlugin } from '../../../../obj/plugin/Program.ts'
//import { ArchitecturePlugin } from '../../../../obj/plugin/Architecture.ts'
import { CommEventOps, CommOpQueue, CommsActions } from '../ops/CommsOps.ts';

import { MSG_REMAP, MSG_GLOBAL_MAP } from "../../../../net/MessageRemap";
import RottnestApplication from "../../../container/RottnestApplication.tsx";

export const RTACommEvents: CommEventOps<RottnestApplication> = {
  recvErr: {
    evkey: MSG_REMAP['err'],
    evtrigger: (_: AppServiceClient, obj: RottnestApplication, m: any) => {
    	let errState = obj.getModuleStates().getErrorState();
      let someMsg = JSON.stringify(m);
      
			errState.setError(someMsg);
			console.error(`Error occurred: ${someMsg}`);
			obj.triggerUpdate();
		}
	},
  recvArchList: {
    evkey: MSG_GLOBAL_MAP['arch_list'],
    evtrigger: async (_appService: AppServiceClient, obj: RottnestApplication, m: any) => {
    	//TODO: We have to refactor this now
    	//
    	//
			// const plist = m.getJSON().payload.arch_list;
			// let newArchs: Array<ArchitecturePlugin> = [];
			// for(const prg of plist) {
			// 	newArchs.push({
			// 		identifier: prg['arch_name'],
			// 		api_map: {}
			// 	})
			// }

			// let archservice = obj.getServices().getArchPluginService();

			// archservice.storeArchs(newArchs);
			
	   //  	/*if(newArchs.length > 0) {
	   //  		obj.state.appStateData.archData.current = newArchs[0]
	   //  	}*/
	   //  	//obj.triggerUpdate();
			// appService.consumeFromQueue();
			//
			// NOTE: Above is old code to remove
			const styService = obj.getServices().getStyleService();
			const refService = obj.getServices().getRefreshService();
			const archService = obj.getServices().getArchPluginService();
			const plist = m.getJSON().payload.arch_list;
			for(const a of plist) {
				const [aname, adetails] = a;

				const cssFile = adetails.cssData;
				const jsFile = adetails.jsData;
				//console.log(jsFile);
				console.log(cssFile);
				styService.appendToRootInline(cssFile)
				await archService.mapArch(aname, { kind: "Serialised", data: jsFile });
				//archService.loadSchema()
				//archService.setArch(aname, adetails);
			}
			refService.triggerRefresh();
			//console.log(plist)
			
		}
  },
  recvProgramGetCurrent: {
    evkey: 'program_get_current',
    evtrigger: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
			const prg = m.getJSON().payload.prg;
			let newProg: ProgramPlugin = {
				name: prg['prg_name'],
				params: prg['prg_params'].map((p: any) =>
					{ return{ param: p.name, kind: 'any'}}) //TODO: Fix the kind
			};

			let notifyservice = obj.getServices().getNotifyService();
			let prgservice = obj.getServices().getProgramPluginService();
			prgservice.saveProgramData({
				plgKey: newProg.name,
				plgValue: newProg.name
			})
			
    	//obj.state.appStateData.progData.current = newProg;
    	notifyservice.makeMessageWithId("prg-set",
    		"Program Set",
    		"Retrieved the current executable from the server");
    	obj.triggerUpdate();
			appService.consumeFromQueue();
		}
  },
  recvProgramList: {
    evkey: MSG_GLOBAL_MAP['program_list'],
    evtrigger: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
			const plist = m.getJSON().payload.prg_list;
			let newProgData: Array<ProgramPlugin> = [];
			for(const prg of plist) {
				newProgData.push({
					name: prg['name'],
					params: prg['params'].map((p: any) =>
						{ return{ param: p.name, kind: 'any'}}) //TODO: Fix the kind
				})
			}
			let prgservice = obj.getServices().getProgramPluginService();
			prgservice.storePrograms(newProgData);
    	//obj.state.appStateData.progData.programs = newProgData
    	obj.triggerUpdate();
			appService.consumeFromQueue();
		}
  },
  recvArchConfig: {
    evkey: MSG_GLOBAL_MAP['arch_get_config'],
    evtrigger: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
    	let archservice = obj.getServices().getArchPluginService();
    	archservice.storeConfig(m.getJSON().payload.config);
    	//obj.state.appStateData.archData.config.config = m.getJSON().payload.config;
    	obj.triggerUpdate();
			appService.consumeFromQueue();
		}
  },
  recvProgramConfig: {
    evkey: MSG_GLOBAL_MAP['program_get_config'],
    evtrigger: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
			let prgservice = obj.getServices().getProgramPluginService();
			prgservice.storeConfig(m.getJSON().payload.config);
    	obj.triggerUpdate();
			appService.consumeFromQueue();
		}
  },

}


/**
 * Initial dispatch operations that occur when `open` even occurs
 * on the socket
 */
const RTADispatchOperations = [
	{
		opkey: "initial",
		operation: (appService: AppServiceClient, _obj: RottnestApplication) => {
			if(appService.isConnected()) {	
				appService.enqueueMessage(MSG_GLOBAL_MAP['arch_list']);
				appService.enqueueMessage(MSG_GLOBAL_MAP['arch_get_config']);
				appService.enqueueMessage(MSG_GLOBAL_MAP['program_list']);
				appService.enqueueMessage(MSG_GLOBAL_MAP['program_get_config']);
				appService.enqueueMessage(MSG_GLOBAL_MAP['program_get_current']);
				appService.consumeFromQueue();
			}
		}
	},
	
]

/**
 * CommunicationActions for Lattice2DArchitecture, allows one
 * to define it in a file and pass it to where it is needed
 */
export const RTACommActions
  = CommsActions.MakeCommsWith<RottnestApplication>(RTACommEvents);


/**
 * Open operations that will be triggered, it is just a list of 1
 */
export const RTAOpenOperations
	= CommOpQueue.MakeDispatchWith<RottnestApplication>(RTADispatchOperations)
