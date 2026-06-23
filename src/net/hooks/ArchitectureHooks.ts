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
        [MessageType.Arch.GetList]: super
          .MakeHookWrapper(this, 'getList'),
        [MessageType.Arch.GetCurrent]: super
          .MakeHookWrapper(this, 'noResponse'),
        [MessageType.Arch.GetConfig]: super
        .MakeHookWrapper(this, 'getConfig'),
        [MessageType.Arch.SetConfig]: super
          .MakeHookWrapper(this, 'noResponse'),
        [MessageType.Arch.SetCurrent]: super
          .MakeHookWrapper(this, 'setCurrent'),
        [MessageType.Arch.SaveConfig]: super
          .MakeHookWrapper(this, 'noResponse'),
        [MessageType.Arch.GetConfig]: super
          .MakeHookWrapper(this, 'noResponse'),
      }
    )
    
  }

  /**
    * setCurrent
    * Sets the current architecture
    */
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

  /**
    * getConfig
    * Gets the config for the architecture
    */
  getConfig(context: any, _jsonObj: any, asm: AppServiceMessage) {
    
    	let appService = context.getServices().getNetworkService();
    	let archservice = context.getServices().getArchPluginService();
    	archservice.storeConfig(asm.getJSON().payload.config);
    	//obj.state.appStateData.archData.config.config = m.getJSON().payload.config;
    	context.triggerUpdate();
			appService.consumeFromQueue();
  }

  /**
    * getList
    * This retrieves the list of the architectures
    */
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
				await archService.mapArch(aname,
				  { kind: "Serialised",
					  data: '',
					  apimap: {
					    mask: '',
					    routes: []
					  }
				});

			}
			
			refService.triggerRefresh();			
    
  }

}

  
