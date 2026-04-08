import { MessageType } from "../net/Protocol";
import { PluginData } from "../obj/plugin/Generic";
import {
    ProgramParam,
	ProgramPlugin,
	ProgramPluginDefault,
	ProgramPluginSet,
	ProgramPluginSetDefault } from "../obj/plugin/Program";
import { NetworkService } from "./NetworkService";
import { RefreshService } from "./RefreshService";



/**
 * Service that will retrieve program information
 * that is on the server and assist with holding data
 * that is from and on the server
 */
export class ProgramPluginService {

  stored: ProgramPluginSet = ProgramPluginSetDefault();
  current: ProgramPlugin | null = null;
  currentName: string | null = null;
  netservice: NetworkService;
  refservice: RefreshService;

  static plgservice: ProgramPluginService | null = null;

  constructor(upservice: RefreshService, netservice: NetworkService) {
    this.netservice = netservice;
    this.refservice = upservice;
  }

	static GetPluginService(
		upservice: RefreshService,
		netservice: NetworkService
	): ProgramPluginService {
		if(ProgramPluginService.plgservice === null) {
			ProgramPluginService.plgservice = new ProgramPluginService(upservice, netservice);
		} else {
			const plgs = ProgramPluginService.plgservice;
			plgs.setNetworkService(netservice);
			plgs.setRefreshService(upservice);
		}
		return ProgramPluginService.plgservice;
	}

	/**
	 * Sets the refresh service
	 */
	setRefreshService(refservice: RefreshService) {
		this.refservice = refservice;
	}

	/**
	 * Sets the Network Service
	 */
	setNetworkService(netservice: NetworkService) {
		this.netservice = netservice;
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
	 * Requests the program list
	 */
	requestProgramList() {
		const netserv = this.netservice.getNetworkService();
		netserv.sendMessage(MessageType.Executable.GetList);
	}

	setCurrentProgramName(data: PluginData) {
		this.currentName = data.plgKey;
	}

  /**
   * Saves the program data
   */  
	saveProgramData(data: PluginData) {
		// const prog = this.stored.programs
		// 	.find((e: ProgramPlugin) => e.name === data.plgKey);
		
		// this.current = prog === undefined ? null : prog;
		// console.log(this.current);
		this.current = {
			name: data.plgKey,
			params: data.params,
			parametersSet: true
		}
	}

	/**
	 * Sets the current executable
	 */
	setCurrentExecutable(exe: string) {
		const netserv = this.netservice.getNetworkService();
		const prog = this.stored.programs.find((e) => e.name === exe);
		if(prog) {
			this.current = prog;
			if(netserv) {
				debugger;
				netserv.sendObject(MessageType.Executable.SetCurrent, {
					"executable_key" : exe
				});
			}
		}
	}

  /**
   * Saves the program configuration
   */  
	saveProgramConfig(data: PluginData) {
		this.stored.config.contents = data.plgValue;
		this.netservice.appService.sendObj(
			MessageType.Executable.SetConfig,
			{
				executable_config: data.plgValue
			});
		this.refservice.triggerRefresh();
	}

	/**
	 * Getting parameters
	 * TODO: Not ready
	 */
	getParameters(ident: string): Array<ProgramParam> | null {
		const thing = this.stored.programs.find((e) => e.name === ident);
		if(thing) {
			return thing.params;
		} else {
			return null;
		}
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
	getProgramList() {
		return this.stored.programs.map((p) => {
			return {
				name: p.name,
				params: p.params
			}
		});
	}


  /**
   * Gets the current executable from the backend that is
   * selected
   */
	getCurrentExe(): ProgramPlugin {
		if(this.current) {
			return this.current;
		} else {
			return ProgramPluginDefault();
		}
	}

	getCurrentName() {
		return this.currentName;
	}

	isCurrentSet(): boolean {
		return this.current !== null;
	}
}
