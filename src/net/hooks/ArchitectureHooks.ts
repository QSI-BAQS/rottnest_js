import { AppServiceMessage } from "../AppServiceMessage";
import { WebSocketHookDefault } from "./Common";
import { MessageType } from "../Protocol";


/**
  * Hooks/Callbacks that are used within the call graph
  * classes to enable a clean interaction with the callgraph
  * instances
  */
export class ArchitectureWebSocketHooks extends WebSocketHookDefault {

  constructor() {
    super();
    this.setInternalMap(
      {
        [MessageType.Arch.GetList]: this.getList,
        [MessageType.Arch.GetCurrent]: this.noResponse,
        [MessageType.Arch.GetConfig]: this.getConfig,
        [MessageType.Arch.SetConfig]: this.noResponse,
        [MessageType.Arch.SetCurrent]: this.setCurrent,
        [MessageType.Arch.SaveConfig]: this.noResponse,
        [MessageType.Arch.GetConfig]: this.noResponse,
      }
    )
    
  }

  setCurrent(context: any, _jsonObj: any, asm: AppServiceMessage) {
    
			const { name, api, jsData, cssData } = asm.getJSON().payload;
			const styService = context.getServices().getStyleService();
			const archService = context.getServices().getArchPluginService();

			styService.appendToRootInline(cssData)
			archService.setArchitectureContext({ name, apimap: api,
				plugin: {
					jsData,
					cssData,
				},
				schema: '',
			});
  }

  getConfig(context: any, _jsonObj: any, asm: AppServiceMessage) {
    
    	let appService = context.getServices().getNetworkService();
    	let archservice = context.getServices().getArchPluginService();
    	archservice.storeConfig(asm.getJSON().payload.config);
    	//obj.state.appStateData.archData.config.config = m.getJSON().payload.config;
    	context.triggerUpdate();
			appService.consumeFromQueue();
  }

  async getList(context: any, _jsonObj: any, asm: AppServiceMessage) {
			const refService = context.getServices().getRefreshService();
			const archService = context.getServices().getArchPluginService();
			// const styService = obj.getServices().getStyleService();
			const plist = asm.getJSON().payload['architectures'];
			// const current = asm.getJSON().payload['current_architecture'];
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
			
			refService.triggerRefresh();			
    
  }

}

  
