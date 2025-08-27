
import { NetworkService } from "./NetworkService";
import { RefreshService } from "./RefreshService";
import { PluginData } from "../obj/plugin/Generic";
import { ArchitecturePlugin, ArchitecturePluginConfig,
	ArchitecturesToEntry, ArchPluginDefault, ArchSet, ArchSetDefault }
	from "../obj/plugin/Architecture";
import { MSG_GLOBAL_MAP } from "../net/MessageRemap";
import { PluginEntry } from "../ui/global/settings/GeneralSettings";

///TODO: Move the interfaces into a separate module
import { ArchitectureSchema } from "../ui/schema/arch/ArchSchema";
import { ArchPluginLoader } from "../ui/schema/arch/ArchPlugin";


// Temporary callbacks
export type ArchUpdateTrigger = (arch: ArchitectureSchema) => void;



/**
 * Storage for all the plugins
 */
export class ArchPluginStorage {
	core: Map<string, ArchitectureSchema>;
	plugins: Map<string, ArchitectureSchema>;

	/**
	 * Core Plugins construction
	 */
	static withCore(schemas: Array<ArchitectureSchema>) {
		const storage = new ArchPluginStorage();
		
		storage.core = new Map();
		schemas.forEach((e) => {
			storage.core.set(e.identifier, e);
		});
		return storage;
	}

	/**
	 * Loads it with the core and external plugins
	 * components
	 */
	static withCoreAndPlugins(_core: Array<ArchitectureSchema>,
		_pluginConfigs: ArchitecturePluginConfig) {
		//TODO: Implement this	
	}

	constructor() {
		this.core = new Map();
		this.plugins = new Map();
	}

	/**
	 * Adds another architecture into the map
	 */
	addPlugin(arch: { default: ArchitectureSchema }) {
		this.core.set(arch.default.name, arch.default);
		debugger;
	}

	/**
	 * Gets an architecture as part of core or plugin
	 */
	getArchitecture(ident: string): ArchitectureSchema | null {
		const coreArch = this.core.get(ident)
		const pluginArch = this.plugins.get(ident)
		if(coreArch) {
			return coreArch;
		} else if(pluginArch) {
			return pluginArch;
		} else {
			return null;
		}
	}
}

/**
 * Service that will retrieve arch information
 * that is on the server and assist with holding data
 * that is from and on the server
 */
export class ArchPluginService {

	storage: ArchPluginStorage;
  stored: ArchSet = ArchSetDefault();
  current: ArchitecturePlugin = ArchPluginDefault();
  netservice: NetworkService;
  refservice: RefreshService;
	update: ArchUpdateTrigger;

  constructor(schemas: Array<ArchitectureSchema>,
  	update: ArchUpdateTrigger,
  	upservice: RefreshService,
  	netservice: NetworkService) {

		this.storage = ArchPluginStorage.withCore(schemas);
  	this.update = update;
    this.netservice = netservice;
    this.refservice = upservice;
    this.loadDebug().then((e) => {
    	
			this.storage.addPlugin(e);

    })
  }

	async loadDebug() {
		return ArchPluginLoader.GetSchemaDefault('/home/ahto/Projects/work/uts/rottnest/build/tscheduler/src/t_scheduler/ui/js/Superconducting.mjs');

	}

	/**
	 * Will attempt to load the schema, once done it will trigger a refresh.
	 */
	async loadSchema(archname: string): Promise<boolean> {
		let loadResult: ArchitectureSchema = await ArchPluginLoader.GetSchemaDefault(archname);
		if(this.storage.getArchitecture(loadResult.identifier)) {
			return false;
		} else {
			this.storage.addPlugin({ default: loadResult });
			return true;
		}
	}

	/**
	 * Stores the configuration
	 */
  storeConfig(config: string) {
  	this.stored.config.contents = config;
  }

	/**
	 * Sets the current architecture
	 */
  setCurrent(arch: ArchitecturePlugin) {
  	this.current = arch;
  }

	/**
	 * Retrieves the architecture that is currently in the list
	 * using a key and maps it to an existing key
	 * if not found, it will not save
	 */
	saveArchData(data: PluginData) {
		console.log(data);
		const archMap = this.stored.architectures.find((e: ArchitecturePlugin) => e.identifier
				=== data.plgKey);

		
		if(archMap) {
			const arch = this.storage.getArchitecture(archMap.identifier);
			this.current = archMap; //Gets set here?
			if(arch) {
				this.update(arch);
			} else {
				console.error("Unable to swap architecture, metadata listed, plugin missing");
			}
			//this.update()
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
	 * Stores the architectures within the service
	 * Checks to see if we need to dynamically load as well
	 */
	async storeArchs(archs: Array<ArchitecturePlugin>) {
		this.stored.architectures = archs;
		let doRefresh = false;
		for(const a in archs) {
			doRefresh = doRefresh || await this.loadSchema(a);
		}
		if(doRefresh) {
			this.refservice.triggerRefresh();
		}
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
