import { MessageType } from "../net/Protocol";
import { PluginData } from "../obj/plugin/Generic";
import {
    ProgramParam,
	ProgramPlugin,
	ProgramPluginSet,
	ProgramPluginSetDefault } from "../obj/plugin/Program";
import { NetworkService } from "./NetworkService";
// import { RefreshService } from "./RefreshService";



/**
 * Service that will retrieve program information
 * that is on the server and assist with holding data
 * that is from and on the server
 */
export class ProgramPluginService {

  stored: ProgramPluginSet = ProgramPluginSetDefault();
	context: ProgramPluginContext = ProgramPluginContext.empty();
	selectedProgramIndex: number = 0;
	
  netservice: NetworkService;
  static plgservice: ProgramPluginService | null = null;


	static GetPluginService(): ProgramPluginService {
		if(ProgramPluginService.plgservice === null) {
			ProgramPluginService.plgservice = new ProgramPluginService();
		}
		return ProgramPluginService.plgservice;
	}

	/**
	  * Constructor that gets the singleton instance of the network service
	  */
  constructor() {
    this.netservice = NetworkService.getInstance();
  }

	/**
	  * Sets the selected index
	  */
	setSelectedIndex(index: number) {
		this.selectedProgramIndex = index;
	}

	/**
	  * Gets the selected index
	  */
	getSelectedIndex() {
		return this.selectedProgramIndex;
	}

	/**
	  * Gets the context object associated with the service
	  *   - Change ProgramParameterSettings
	  *   - Change GlobalNetOperations
	  */
	getContext() {
		return this.context;
	}

  /// OLD API
	// /**
	//  * Sets the refresh service
	//  */
	// setRefreshService(refservice: RefreshService) {
	// 	this.refservice = refservice;
	// }

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

	/**
	  * Sets the current program name
	  */
	setCurrentProgramName(data: PluginData) {
		this.context.setExecutableName(data.plgKey);
	}

	/**
	  * Set the parameters only
	  */
	setParameters(data: PluginData) {
		if(!this.context.parametersSet()) {
			this.context.replaceWithFlattenedParams(data.plgKey, data.params);
		}
	}
	
	/**
	  * Sets the current program and overrides the parameters
	  */
	setProgram(data: PluginData) {
		this.context = ProgramPluginContext.empty();
		this.context.replaceWithFlattenedParams(data.plgKey, data.params);
	}

  /**
   * Saves the program data
   */  
	saveProgramData(data: PluginData) {
		if(!this.context.parametersSet()) {
			this.context.replaceWithFlattenedParams(data.plgKey, data.params);
		}
	}

	/**
	 * Sets the current executable
	 */
	setCurrentExecutable(exe: string) {
		this.context = ProgramPluginContext.empty();
		this.context.setExecutableName(exe);
	}

	saveContext(withParams: boolean = false) {
		const context = this.context;
		const name = this.context.getExecutableName();

		const net = this.netservice.getNetworkService();
		net.sendObject(MessageType.Executable.SetCurrent,
				{
					executable_key: name
				});
		if(withParams) {
		net.sendObject(MessageType.Executable.SetConfig,
				{
					executable_config: context.parametersToPayload()
				});
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
		// this.refservice.triggerRefresh();
	}

	/**
	 * Getting parameters
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
		return this.context.toPluginFormat();
	}

	/**
	  * Gets the current name
	  */
	getCurrentName() {
		return this.context.getExecutableName();
	}

	/**
	  * Checks to see if it is currently set
	  */
	isCurrentSet(): boolean {
		return this.context !== null;
	}
}

/**
  * Internally will store the paramters
  * and the type information that is associated
  */
export type ProgramParameters = {
	[key: string]: [string, number]
}

/**
  * Paramters Payload is used for
  * sending it to the backend so it can be decomposed
  * and set to the executable
  */
export type ProgramParametersPayload = {
	[key: string]: [string, number]
}


/**
  * ProgramParameterDiffResult
  * Use to output the data and show what the difference is
  */
export type ProgramParameterDiffResult = {
	deviations: Set<string>,
	deviates: boolean,
}

/**
  * ProgramPluginContext
  * This object serves a way to ensure that the data
  * for the current executable is able to be modified,
  * saved and synchronised within this system in a sensible
  * way
  */
export class ProgramPluginContext {

	executableName: string = '';
	parameters: ProgramParameters = {};
	isSet: boolean = false;

	static empty() {
		const p = new ProgramPluginContext();
		p.executableName = 'Not Set';
		p.parameters = {};
		p.isSet = false;

		return p;
	}

	/**
	  * Constructs a new instance of a program plugin context
	  */
	static make(name: string, params: ProgramParameters) {
		const ctx = new ProgramPluginContext();
		ctx.executableName = name;
		ctx.parameters = params;
		ctx.isSet = true;
		return ctx;
	}

	/**
	  * Clones the current context
	  * This is to ensure we can corroborate the contexts
	  * between these two portions of data using the same type
	  */
	clone() {
		const name = this.executableName;
		const newParams: ProgramParameters = this.cloneParameters();
		return ProgramPluginContext.make(name,newParams);
	}

	/**
	  * Clones the parameters 
	  */
	cloneParameters() {
		const newParams: ProgramParameters = {};
		for(const key in this.getParameters()) {
			const data = this.getParameters()[key];
			newParams[key] = data;
		}
		return newParams;
	}

	/**
	  * Performs a diff using the parameter key and emits the difference
	  */
	diffParameter(parameterKey: keyof ProgramParameters,
		other: ProgramParameters) {

		const entry = this.parameters[parameterKey];
		const otherEntry = other[parameterKey];

		return entry[1] !== otherEntry[1];
	}

	/**
	  * Performs a diff between the two contexts and emits
	  * a change log
	  */
	diff(context: ProgramPluginContext): ProgramParameterDiffResult {
		const current = this.getParameters();
		const other = context.getParameters();


		const keySet: Array<keyof ProgramParameters> = Object.keys(current);
		const deviations: Set<string> = new Set();
		let deviates = false;
		
		for(const k of keySet) {
			if(other.isSet) {
				const result = this.diffParameter(k, other);
				if(result) {
					deviations.add(k as string);
				}
				deviates = deviates || result;
			}
		}

		return {
			deviations,
			deviates,
		};
	}

	/**
	  * Gets the parameters in the form of:
	  * key : [kind, value]
	  */
	getParameters() {
		return this.parameters;
	}

	/**
	  * Gets the executable name
	  */
	getExecutableName() {
		return this.executableName;
	}

	/**
	  * Gets an array of parameters 
	  */
	getParameterKeys(): Array<string> {
		return Object.keys(this.parameters);
	}

	/**
	  * Checks to see if the parameters have been
	  * set locally - If not, then it will override
	  */
	parametersSet() {
		return this.isSet;
	}

	/**
	  * Flattened program paramters
	  * that will allow for replacing using this method
	  */
	replaceWithFlattenedParams(name: string, parameters: Array<ProgramParam>) {
		this.executableName = name;
		for(const p of parameters) {
			this.setParametersFromTuple(p);
		}
	}

	/**
	  * Replace the context with another context
	  */
	replaceContext(context: ProgramPluginContext) {
		this.executableName = context.executableName;
		this.parameters = context.cloneParameters();
		this.isSet = true;
	}

	/**
	  * Replaces the current context
	  * with the name and parameters
	  */
	replace(name: string, parameters: ProgramParameters) {
		this.executableName = name;
		this.parameters = parameters;
		this.isSet = true;
	}

	/**
	  * Sets the executable name
	  */
	setExecutableName(name: string) {
		this.executableName = name;
	}

	/**
	  * Sets the parameter when using a tuple
	  */
	setParametersFromTuple(params: [string, string, number]) {
		const [key, kind, value] = params;
		this.parameters[key] = [kind, value];
	}

	/**
	  * Using an iterator we are able to set the parameters
	  */
	setParametersFromIterator(params: Iterable<[string, ProgramParam]>) {
		for(const [k, data] of params) {
			this.parameters[k][0] = data[1];
			this.parameters[k][1] = data[2];
		}
	}

	/**
	  * Sets the value of a parameter
	  */
	setParameterValue(key: string, value: number) {
		this.parameters[key][1] = value;		
	}

	/**
	  * Creates an array of flattened tuples
	  * These are an array of tuples
	  */
	toFlattenedTuples() {
		const flattened: Array<ProgramParam> = [];
		for(const key in this.parameters) {
			const kind = this.parameters[key][0];
			const value = this.parameters[key][1];
			flattened.push([key, kind, value]);
		}
		return flattened;
	}


	/**
	  * Creates a plugin format object
	  */
	toPluginFormat(): ProgramPlugin {
		return {
			name: this.executableName,
			params: this.toFlattenedTuples(),
			parametersSet: true
		}
	}

	/**
	  * toPayload
	  * This transforms the parameters field to ensure that
	  * the data can be sent to the backend
	  */
	parametersToPayload() {
		const payloadObject: ProgramParametersPayload = {};
		for(const key in this.parameters) {
			payloadObject[key] = this.parameters[key]
		}
		return payloadObject;
	}
}
