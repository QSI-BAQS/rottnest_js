import { NetworkService } from "./NetworkService";
import { RefreshService } from "./RefreshService";
import { PluginData } from "../obj/plugin/Generic";
import { ArchAPIMap, ArchitecturePlugin, ArchitecturePluginConfig,
	ArchitecturesToEntry, ArchPackage, ArchPluginDefault, ArchSet, ArchSetDefault, 
    ArchStorageEntry}
	from "../obj/plugin/Architecture";
import { MSG_GLOBAL_MAP } from "../net/MessageRemap";
import { PluginEntry } from "../ui/global/settings/GeneralSettings";

///TODO: Move the interfaces into a separate module
import { ArchitectureSchema } from "../ui/schema/arch/ArchSchema";
import { ArchPluginLoader } from "../ui/schema/arch/ArchPlugin";
import { Services } from "./Services";

//import StorageDB from "../db/StorageDB";
// Temporary callbacks
export type ArchUpdateTrigger = (arch: ArchitectureSchema) => void;


/**
 * Storage for all the plugins
 */
export class ArchPluginStorage {
	core: Map<string, ArchStorageEntry>;
	plugins: Map<string, ArchStorageEntry>;

	/**
	 * Core Plugins construction
	 */
	static withCore(schemas: Array<ArchStorageEntry>) {
		const storage = new ArchPluginStorage();
		
		storage.core = new Map();
		schemas.forEach((e) => {
			storage.core.set(e.schema.name, e);
		});
		return storage;
	}

	/**
	 * Loads it with the core and external plugins
	 * components
	 */
	static withCoreAndPlugins(_core: Array<ArchitectureSchema>,
		_pluginConfigs: ArchitecturePluginConfig) {
	}

	constructor() {
		this.core = new Map();
		this.plugins = new Map();
	}

	/**
	 * Adds another architecture into the map
	 */
	addPlugin(arch: { archname: string, default: ArchitectureSchema, apimap: ArchAPIMap }) {
		let archInst = arch.default;
		if(arch.default) {
			let cot: any = arch.default;
			archInst = new cot(); //Reflected construction, need to use any
		}
		this.core.set(arch.archname, {
			schema: archInst,
			apimap: arch.apimap
		});

	}

	/**
	 * Gets an architecture as part of core or plugin
	 */
	getArchitecture(ident: string): ArchStorageEntry | null {
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

	static plgservice: ArchPluginService | null = null;

  constructor(schemas: Array<ArchStorageEntry>,
  	update: ArchUpdateTrigger,
  	upservice: RefreshService,
  	netservice: NetworkService) {

		this.storage = ArchPluginStorage.withCore(schemas);
  	this.update = update;
    this.netservice = netservice;
    this.refservice = upservice;

  }

	static GetPluginService(
		defaultSchemas: Array<ArchStorageEntry>,
		update: ArchUpdateTrigger,
		upservice: RefreshService,
		netservice: NetworkService
	): ArchPluginService {
		if(ArchPluginService.plgservice === null) {
			ArchPluginService.plgservice = new ArchPluginService(defaultSchemas, update,
				upservice, netservice);
		} else {
			const plgs = ArchPluginService.plgservice;
			plgs.setNetworkService(netservice);
			plgs.setRefreshService(upservice);
			plgs.setUpdate(update);
		}
		return ArchPluginService.plgservice;
	}

	static FileSystemInit() {
		//Consider this
	}

	setNetworkService(netservice: NetworkService) {
		this.netservice = netservice;
	}

	setRefreshService(upservice: RefreshService) {
		this.refservice = upservice;
	}

	setUpdate(update: ArchUpdateTrigger) {
		this.update = update;
	}

	
	/**
	 * Maps an architecture and stores
	 * it into the storage class for it to be held
	 */
	async mapArch(name: string, archpkg: ArchPackage) {
		if(archpkg.kind === "Serialised") {
	    const modtext = btoa(archpkg.data)
	    const module = await import('data:text/javascript;base64,' + modtext);
			this.storage.addPlugin({
				archname: name,
				default: module.default,
				apimap: archpkg.apimap
			});
    }
	}

	/**
	 * Will attempt to load the schema, once done it will trigger a refresh.
	 */
	async loadSchema(archname: string): Promise<boolean> {
		let loadResult: ArchitectureSchema
			= await ArchPluginLoader.GetSchemaDefault(archname);
		if(this.storage.getArchitecture(loadResult.name)) {
			return false;
		} else {
			//this.storage.addPlugin({ name: loadResult.name, default: loadResult });
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
		const archKey = data.plgKey;
		const archMap = this.storage.core.get(data.plgKey);
		if(archMap) {
			let arch = {
				name: archMap.schema.name,
				//TODO: Will need to figure out the prototype fix...
				createArchitecture: (services: Services) => {
					return archMap.schema.createArchitecture(services)
				}
			};
			
			this.current = {
				identifier: archMap.schema.name,
				api_map: archMap.apimap
			}
			if(arch) {
				this.update(arch);
			} else {
				console.error("Unable to swap architecture, metadata listed, plugin missing");
			}
			this.netservice.getNetworkService().sendObj('arch_meta_arch_set', {
				'arch_name': archKey
			})
			//this.update()
			this.refservice.triggerRefresh();
			
		} else {
			console.error("Unable to save architecture")
		}
			
	}

	/**
	 * Uses the network service to request all
	 * the architectures on the backend
	 */
	requestArchitectures() {
		this.netservice.getNetworkService()
			.sendMessage(MSG_GLOBAL_MAP['arch_list']);
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
		return new Array(...this.storage.core.entries().map((a) => {
			console.log(a);
			return ArchitecturesToEntry({
				identifier: a[0],
				api_map: {}
			});
		}));
	}


	/**
	 * Gets the selected architecture
	 */
	getCurrentArch(): ArchitecturePlugin {
		return this.current;
	}
}
