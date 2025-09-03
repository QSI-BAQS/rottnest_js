import { ArchitecturePlugin } from "../obj/plugin/Architecture";
import { ProgramPlugin } from "../obj/plugin/Program";
import RottnestApplication from "../ui/container/RottnestApplication";
import { AppServiceClient } from "./AppService";
import { AppProtocolSet } from "./ProtocolTypes";

/**
 * GlobalProtocolSet is a sane default for Rottnest
 */
export const GlobalProtocolSet: AppProtocolSet<RottnestApplication> = {
  
  recvArchList: {
    pkey: 'arch_meta_arch_list',
    response: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
			const plist = m.getJSON().payload.arch_list;
			let newArchs: Array<ArchitecturePlugin> = [];
			for(const prg of plist) {
				newArchs.push({
					identifier: prg['arch_name'],
					api_map: {}
				})
			}

			let archservice = obj.getServices().getArchPluginService();

			archservice.storeArchs(newArchs);
			
    	/*if(newArchs.length > 0) {
    		obj.state.appStateData.archData.current = newArchs[0]
    	}*/
    	//obj.triggerUpdate();
			appService.consumeFromQueue();
		}
  },
  recvProgramGetCurrent: {
    pkey: 'prgs_program_get_current',
    response: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
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
				plgValue: newProg.name,
				params: []
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
    pkey: 'prgs_program_list',
    response: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
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
    pkey: 'arch_meta_get_config',
    response: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
    	let archservice = obj.getServices().getArchPluginService();
    	archservice.storeConfig(m.getJSON().payload.config);
    	//obj.state.appStateData.archData.config.config = m.getJSON().payload.config;
    	obj.triggerUpdate();
			appService.consumeFromQueue();
		}
  },
  recvProgramConfig: {
    pkey: 'prgs_program_get_config',
    response: (appService: AppServiceClient, obj: RottnestApplication, m: any) => {
			let prgservice = obj.getServices().getProgramPluginService();
			prgservice.storeConfig(m.getJSON().payload.config);
    	obj.triggerUpdate();
			appService.consumeFromQueue();
		}
  },
}

