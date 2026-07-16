import {DeRott} from "./Serialisation";


export type JSONMessagePrimitive = string | number | boolean | object;

export type JSONMessage = {
	[key: string]: JSONMessage | JSONMessagePrimitive
}


export type AppServiceMessageParseResult = {
	parsed: boolean,
	result: AppServiceMessage | object
	isValid: () => boolean
	getServiceMessage: () => AppServiceMessage;
}



/**
 * Application Service Message,
 * Will be used by the receiver to then process message
 * and also utilise a parser kind for a particular
 * message type
 */
export class AppServiceMessage {
	
	rawData: string = '';
	interpretedData: any | null = {};
	dataIsJson: boolean = false;
	receivedData: boolean = false;

	jsonData: JSONMessage | object = {};

	constructor(data?: string) {
		if(data) {
			this.rawData = data;
			this.receivedData = true;
		}
	}

	/**
	  * Parses the JSON
	  * If the data cannot be parsed correctly, it will outline this as part
	  * of the result object returned
	  */
	static make(data: string): AppServiceMessageParseResult {
		let success = true;
		let result = {};
		let asm = new AppServiceMessage(data);
		try {
			result = JSON.parse(data);
			
		} catch(exception) {
			console.error(exception);
			success = false;
		}

		return {
			result,
			parsed:success,
			isValid() { return this.parsed; },
			getServiceMessage() {
				return asm;
			}
		}
	}

	/**
	  * When already initialised, we want to
	  * 
	  */
	setDataFromJSON(data: any) {
		this.rawData = JSON.stringify(data);
		this.interpretedData = data;
		this.dataIsJson = true;
		this.receivedData = true;
	}

	/**
	 * When initialised as an empty container
	 * it will allow for the data to be set
	 * for it
	 */
	setData(data: string) {
		this.rawData = data;
	}

	/**
	 * It will parse the raw data into
	 * a JSON object that can be utilised
	 */
	parseData(): boolean {
		try {
			const data = JSON.parse(this.rawData);
			this.interpretedData = data;
			this.dataIsJson = true;
			return true;
		} catch {
			this.dataIsJson = false;
			return false;
		}
	}

	/**
	 * Will accept a DeRott kind that will
	 * attempt to parse it to a particular container kind T
	 * If it fails, it will return null
	 */
	parseDataTo<T extends DeRott>(container: T): T | null {
		if(!this.interpretedData) {
			if(!this.parseData()) {
				return null;
			}
		}

		const gData = this.interpretedData;
		const res = container.fromJSON(gData);
		return res;
	}

	/**
	 * Checks to see if the data is json
	 */
	isJSON(): boolean {
		return this.dataIsJson;	
	}

	/**
	 * Checks if raw data has been received
	 */
	hasRaw(): boolean {
		return this.receivedData;
	}

	/**
	 * Will get the raw data
	 */
	getRaw(): string {
		return this.rawData;
	}

	/**
	 * Gets the JSON representation or null if
	 * it is not parseable as JSON
	 */
	getJSON(): any | null {
		if(!this.dataIsJson) {
			this.parseData();
		}
		return this.interpretedData;
	}

}
