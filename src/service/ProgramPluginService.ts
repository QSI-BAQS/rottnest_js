import { MSG_GLOBAL_MAP } from "../net/MessageRemap";
import { ProgramPlugin, ProgramPluginDefault, ProgramPluginToEntry } from "../obj/plugin/Program";
import { PluginData, PluginEntry } from "../ui/global/settings/GeneralSettings";
import { NetworkService } from "./NetworkService";
import { RefreshService } from "./RefreshService";



/**
 * Service that will retrieve program information
 * that is on the server and assist with holding data
 * that is from and on the server
 */
export class ProgramPluginService {

  stored: ProgramPlugin = ProgramPluginDefault();
  netservice: NetworkService;
  refservice: RefreshService;

  constructor(upservice: RefreshService, netservice: NetworkService) {
    this.netservice = netservice;
    this.refservice = upservice;
  }

  /**
   * Saves the program data
   */  
	saveProgramData(data: PluginData) {
		const prog = this.state.appStateData
			.progData.programs.find((e: ProgramPlugin) => e.name === data.plgKey);
		if(prog) {
			this.state.appStateData.progData.current = prog;
			this.refservice.triggerRefresh();
		} 
	}

  /**
   * Saves the program configuration
   */  
	saveProgramConfig(data: PluginData) {
		this.stored.config.config = data.plgValue;
		this.refservice.triggerRefresh();
		this.netservice.appService.sendObj(MSG_GLOBAL_MAP['program_set_config'],
			{ config: data.plgValue });
	}

  /**
   * Gets the program configuration so it can be updated
   * by the user
   */
	getProgramConfig(): string {
		return this.state.appStateData.progData.config.config;
	}

  /**
   * Retrieves the program list from the backend
   */
	getProgramList(): Array<PluginEntry> {
		return this.state.appStateData.progData.programs.map((p) => {
			return ProgramPluginToEntry(p);
		})
	}


  /**
   * Gets the current executable from the backend that is
   * selected
   */
	getCurrentExe(): ProgramPlugin {
		return this.state.appStateData.progData.current
	}
}
