import { MSG_GLOBAL_MAP } from "../net/MessageRemap";
import { ArchitecturePlugin, ArchPluginDefault } from "../obj/plugin/Architecture";
import { PluginData } from "../ui/global/settings/GeneralSettings";
import { NetworkService } from "./NetworkService";
import { RefreshService } from "./RefreshService";



/**
 * Service that will retrieve arch information
 * that is on the server and assist with holding data
 * that is from and on the server
 */
export class ArchPluginService {

  stored: ArchitecturePlugin = ArchPluginDefault();
  netservice: NetworkService;
  refservice: RefreshService;

  constructor(upservice: RefreshService, netservice: NetworkService) {
    this.netservice = netservice;
    this.refservice = upservice;
  }



	// TODO: Check this method
	saveArchData(data: PluginData) {
		const arch = this.state.appStateData
			.archData.architectures.find(
				(e: ArchitecturePlugin) => e.identifier === data.plgKey);
		if(arch) {
			this.state.appStateData.archData.current = arch;
			this.refservice.triggerUpdate();
		} 
			
	}

	// TODO: Check this method
	saveArchConfig(data: PluginData) {
		
		this.state.appStateData.progData.config.config = data.plgValue;
		this.refservice.triggerUpdate();
		this.commData.appService.sendObj(MSG_GLOBAL_MAP['arch_set_config'],
			{ config: data.plgValue });
	}




	getArchConfig(): string {
		return this.state.appStateData.archData.config.config;
	}

	getArchItems(): Array<PluginEntry> {
		return this.state.appStateData.archData.architectures.map((a) => {
			return ArchitecturesToEntry(a);
		})
	}



	getCurrentArch(): ArchitecturePlugin {
		return this.state.appStateData.archData.current
	}
	

  
}
