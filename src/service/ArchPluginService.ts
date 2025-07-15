
import { NetworkService } from "./NetworkService";
import { RefreshService } from "./RefreshService";
import { PluginData } from "../obj/plugin/Generic";
import { ArchitecturePlugin, ArchitecturePluginConfig,
	ArchitecturesToEntry, ArchPluginDefault, ArchSet, ArchSetDefault }
	from "../obj/plugin/Architecture";
import { MSG_GLOBAL_MAP } from "../net/MessageRemap";
import { PluginEntry } from "../ui/global/settings/GeneralSettings";



/**
 * Service that will retrieve arch information
 * that is on the server and assist with holding data
 * that is from and on the server
 */
export class ArchPluginService {

  stored: ArchSet = ArchSetDefault();
  current: ArchitecturePlugin = ArchPluginDefault();
  netservice: NetworkService;
  refservice: RefreshService;

  constructor(upservice: RefreshService, netservice: NetworkService) {
    this.netservice = netservice;
    this.refservice = upservice;
  }


	/**
	 * Retrieves the architecture that is currently in the list
	 * using a key and maps it to an existing key
	 * if not found, it will not save
	 */
	saveArchData(data: PluginData) {
		const arch = this.stored.architectures.find((e: ArchitecturePlugin) => e.identifier
				=== data.plgKey);
		if(arch) {
			this.current = arch;
			this.refservice.triggerRefresh();
		} else {
			console.error("Unable to save architecture")
		}
			
	}

	/**
	 * Updates the current architecture based on
	 * the JSON configuration file that has been given
	 */
	saveArchConfig(data: PluginData) {
		
		this.stored.config.contents = data.plgValue;
		this.netservice.getNetworkService().sendObj(MSG_GLOBAL_MAP['arch_set_config'],
			{ config: data.plgValue });
		this.refservice.triggerRefresh();
	}



	/**
	 * Gets the currently saved configuration data
	 */
	getArchConfig(): ArchitecturePluginConfig {
		return this.stored.config;
	}

	/**
	 * Gets the currently retrieve set of plugin entries
	 */
	getArchItems(): Array<PluginEntry> {
		return this.stored.architectures.map((a) => {
			return ArchitecturesToEntry(a);
		});
	}


	/**
	 * Gets the selected architecture
	 */
	getCurrentArch(): ArchitecturePlugin {
		return this.current;
	}
	

  
}
