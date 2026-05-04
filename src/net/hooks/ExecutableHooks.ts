import { ProgramPlugin } from "../../obj/plugin/Program";
import { NotifyID } from "../../service/NotifyService";
import { AppServiceMessage } from "../AppServiceMessage";
import { MessageType } from "../Protocol";
import { WebSocketHookDefault } from "./Common";

/**
  * Hooks/Callbacks that are used within the call graph
  * classes to enable a clean interaction with the callgraph
  * instances
  */
export class ExecutableWebSocketHooks extends WebSocketHookDefault {
	
  constructor() {
  	super();
  	this.setInternalMap(
		  {
		    [MessageType.Executable.GetList]: this.getList,
		    [MessageType.Executable.GetCurrent]: this.getCurrent,
		    [MessageType.Executable.GetConfig]: this.getConfig,
		    [MessageType.Executable.SetConfig]: this.noResponse,
		    [MessageType.Executable.SetCurrent]: this.noResponse,
		    [MessageType.Executable.SaveConfig]: this.noResponse,
		    [MessageType.Executable.GetConfig]: this.noResponse,
		  }
  	);
  }
  

  noResponse(_context: any, _jsonObj: any, _asm: AppServiceMessage) {
    //NO-OP
  }

  setCurrent(context: any, _jsonObj: any, asm: AppServiceMessage) {
    
			const prg = asm.getJSON().payload;
			let prgservice = context.getServices().getProgramPluginService();
			prgservice.saveProgramData({
				plgKey: prg.name,
				plgValue: prg.name,
				params: prg.parameters
			})
	
      const notify = context.getServices().getNotifyService();
      const refresh = context.getServices().getRefreshService();
    	notify.makeMessageWithId(NotifyID.Executable.SetCurrent.ID,
    		NotifyID.Executable.SetCurrent.title,
    		NotifyID.Executable.SetCurrent.message);
    	refresh.triggerUpdate();
  }

  getCurrent(context: any, _jsonObj: any, asm: AppServiceMessage) {
    
		const prg = asm.getJSON().payload;
		let newProg: ProgramPlugin = {
			name: prg.name,
			params: prg.parameters,
			parametersSet: true
		};

		let appService = context.getServices().getNetworkService();
		let refreshService = context.getServices().getRefreshService();
		let notifyservice = context.getServices().getNotifyService();
		let prgservice = context.getServices().getProgramPluginService();
		prgservice.saveProgramData({
			plgKey: newProg.name,
			plgValue: newProg.name,
			params: newProg.params
		})
		
  	//obj.state.appStateData.progData.current = newProg;
  	notifyservice.makeMessageWithId(NotifyID.Executable.GetCurrent.ID,
  		NotifyID.Executable.GetCurrent.title,
  		NotifyID.Executable.GetCurrent.message);
  	refreshService.triggerUpdate();
		appService.consumeFromQueue();
  }

  getConfig(context: any, _jsonObj: any, asm: AppServiceMessage) {
    
    const appService = context.getServices().getNetworkService();
    const refreshService = context.getServices().getRefreshService();
		let prgservice = context.getServices().getProgramPluginService();

		prgservice.storeConfig(asm.getJSON().payload.config);
  	refreshService.triggerUpdate();
		appService.consumeFromQueue();
  }

  getList(context: any, _jsonObj: any, asm: AppServiceMessage) {
    const appService = context.getServices().getNetworkService();
    const refreshService = context.getServices().getRefreshService();
		const data = asm.getJSON().payload;
		const current = data['current_executable'];
		const plist = data['executables'];
		let newProgData: Array<ProgramPlugin> = [];
		for(const prg of plist) {			
			newProgData.push({
				name: prg,
				params: [],
				parametersSet: false
			})
		}
		let prgservice = context.getServices()
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

		refreshService.triggerRefresh();
		appService.consumeFromQueue();
  }

  

  
}
