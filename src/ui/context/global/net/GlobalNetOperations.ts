

import { AppServiceClient } from "../../../../net/AppService";
import { ProgramPlugin } from '../../../../obj/plugin/Program.ts'
//import { ArchitecturePlugin } from '../../../../obj/plugin/Architecture.ts'
import { CommEventOps, CommOpQueue, CommsActions } from '../ops/CommsOps.ts';

import { MessageType } from '../../../../net/Protocol.ts';
import RottnestApplication from "../../../container/RottnestApplication.tsx";

export const RTACommEvents: CommEventOps<RottnestApplication> = {
  recvErr: {
    evkey: MessageType.Error,
    evtrigger: (_: AppServiceClient, obj: RottnestApplication, m: any) => {
    	let errState = obj.getModuleStates().getErrorState();
      let someMsg = JSON.stringify(m);
      
			errState.setError(someMsg);
			console.error(`Error occurred: ${someMsg}`);
			obj.triggerUpdate();
		}
	},
	setCurrentArch: {
		evkey: MessageType.Arch.SetCurrent,
    evtrigger: async (_appService: AppServiceClient, obj: RottnestApplication, m: any) => {

			
			const { name, api, jsData, cssData } = m.getJSON().payload;
			const styService = obj.getServices().getStyleService();
			const archService = obj.getServices().getArchPluginService();


			styService.appendToRootInline(cssData)

			//TODO: We need to change this type
			archService.setArchitectureContext({ name, apimap: api,
				plugin: {
					jsData,
					cssData,
				},
				schema: '',
			});
			
    }
	},
	setCurrentExec: {
		evkey: MessageType.Executable.SetCurrent,
    evtrigger: async (_appService: AppServiceClient, obj: RottnestApplication, m: any) => {

			const prg = m.getJSON().payload;
			let prgservice = obj.getServices().getProgramPluginService();
			prgservice.saveProgramData({
				plgKey: prg.name,
				plgValue: prg.name,
				params: prg.parameters
			})

    	obj.triggerUpdate();
			
    }
	},
	recvArchList: {
    evkey: MessageType.Arch.GetList,
    evtrigger: async (_appService: AppServiceClient, obj: RottnestApplication, m: any) => {

			//NOTE: Logic will need to be moved
			// const styService = obj.getServices().getStyleService();
			const refService = obj.getServices().getRefreshService();
			const archService = obj.getServices().getArchPluginService();
			const styService = obj.getServices().getStyleService();
			const plist = m.getJSON().payload['architectures'];
			const current = m.getJSON().payload['current_architecture'];
			for(const a of plist) {
				const aname = a;

				// const cssFile = adetails.cssData;
				// const jsFile = adetails.jsData;
				// styService.appendToRootInline(cssFile)
				await archService.mapArch(aname, { kind: "Serialised",
					data: '',
					apimap: { mask: '', routes: [] }
				});

			}

			if(current) {
				
				// const { name, api, jsData, cssData } = current;
				// styService.appendToRootInline(cssData)
				// archService.setArchitectureContext({ name, apimap: api,
				// 	plugin: {
				// 		jsData,
				// 		cssData,
				// 	},
				// 	schema: '',
				// });
			}
			
			refService.triggerRefresh();			
		}
  },
  recvProgramGetCurrent: {
    evkey: MessageType.Executable.GetCurrent,
    evtrigger: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
			const prg = m.getJSON().payload;
			let newProg: ProgramPlugin = {
				name: prg.name,
				params: prg.parameters,
				parametersSet: true
			};

			let notifyservice = obj.getServices().getNotifyService();
			let prgservice = obj.getServices().getProgramPluginService();
			prgservice.saveProgramData({
				plgKey: newProg.name,
				plgValue: newProg.name,
				params: newProg.params
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
    evkey: MessageType.Executable.GetList,
    evtrigger: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
			const data = m.getJSON().payload;
			const current = data['current_executable'];
			const plist = data['executables'];
			let newProgData: Array<ProgramPlugin> = [];
			for(const prg of plist) {
				// const params = prg['prgparams'].map((p: any) => {
				// 	const [name, kind, arg]: [string, string, any] = p;
				// 	return [name, kind, arg];
				// });
				
				newProgData.push({
					name: prg,
					params: [],
					parametersSet: false
				})
			}
			let prgservice = obj.getServices()
				.getProgramPluginService();

			prgservice.storePrograms(newProgData);

			if(current) {
				
				let newProg: ProgramPlugin = {
					name: current.name,
					params: current.parameters,
					parametersSet: true
				};

				prgservice.saveProgramData({
					plgKey: newProg.name,
					plgValue: newProg.name,
					params: newProg.params
				})
			}
			
    	obj.triggerUpdate();
			appService.consumeFromQueue();
		}
  },
  recvArchConfig: {
    evkey: MessageType.Arch.GetConfig,
    evtrigger: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
    	let archservice = obj.getServices().getArchPluginService();
    	archservice.storeConfig(m.getJSON().payload.config);
    	//obj.state.appStateData.archData.config.config = m.getJSON().payload.config;
    	obj.triggerUpdate();
			appService.consumeFromQueue();
		}
  },
  recvProgramConfig: {
    evkey: MessageType.Executable.GetConfig,
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
				appService.enqueueMessage(MessageType.Arch.GetList);
				appService.enqueueMessage(MessageType.Arch.GetConfig);
				appService.enqueueMessage(MessageType.Executable.GetList);
				appService.enqueueMessage(MessageType.Executable.GetConfig);
				appService.enqueueMessage(MessageType.Executable.GetCurrent);
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
