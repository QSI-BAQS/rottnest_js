import { MSG_GLOBAL_MAP } from "../net/MessageRemap";
import { PluginData } from "../obj/plugin/Generic";
import { ProgramPlugin, ProgramPluginDefault, ProgramPluginSet,
	ProgramPluginToEntry, ProgramPluginSetDefault } from "../obj/plugin/Program";
import { PluginEntry,  } from "../ui/global/settings/GeneralSettings";
import { NetworkService } from "./NetworkService";
import { RefreshService } from "./RefreshService";



/**
 * Service that will retrieve program information
 * that is on the server and assist with holding data
 * that is from and on the server
 */
export class ProgramPluginService {

  stored: ProgramPluginSet = ProgramPluginSetDefault();
  current: ProgramPlugin = ProgramPluginDefault();
  netservice: NetworkService;
  refservice: RefreshService;

  constructor(upservice: RefreshService, netservice: NetworkService) {
    this.netservice = netservice;
    this.refservice = upservice;
  }


	/**
	 * Stores programs into the service
	 */
  storePrograms(progs: Array<ProgramPlugin>) {
  	this.stored.programs = progs;
  }

	/**
	 * Stores the configuration
	 */
  storeConfig(config: string) {
  	this.stored.config.contents = config;
  }

  /**
   * Saves the program data
   */  
	saveProgramData(data: PluginData) {
		const prog = this.stored.programs.find((e: ProgramPlugin) => e.name === data.plgKey);
		if(prog) {
			this.current = prog;
			this.refservice.triggerRefresh();
		} 
	}

  /**
   * Saves the program configuration
   */  
	saveProgramConfig(data: PluginData) {
		this.stored.config.contents = data.plgValue;
		this.refservice.triggerRefresh();
		this.netservice.appService.sendObj(MSG_GLOBAL_MAP['program_set_config'],
			{ config: data.plgValue });
	}

	//TODO: Finish this
	getParameters(_ident: string) {
		return { parameters: [] }
	}

  /**
   * Gets the program configuration so it can be updated
   * by the user
   */
	getProgramConfig(): string {
		return this.stored.config.contents;
	}

  /**
   * Retrieves the program list from the backend
   */
	getProgramList(): Array<PluginEntry> {
		return this.stored.programs.map((p) => {
			return ProgramPluginToEntry(p);
		});
	}


  /**
   * Gets the current executable from the backend that is
   * selected
   */
	getCurrentExe(): ProgramPlugin {
		return this.current;
	}
}
