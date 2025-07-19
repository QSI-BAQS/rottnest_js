import { RouterAggr } from "../net/NetMessages"
import { RegionData } from "../obj/RegionData"
import { SubKind, SuperconductingRegionKindMap } from "../obj/RegionKindMap"
import { SuperconductingState } from "./ArchState"


/**
 * UIComponentData from rottnest app state, it has been
 * composed into a different part but focuses on the region tooling
 * that has to be known by other components
 */
export type UIComponentData = {
		selectedTool: number
		selectedSubTool: number
		selectedRegion: number
		selectedRegionType: string | null 
}


/**
 * State information related to the UI
 * holds onto it as it will be used by other components of the app
 */
export class SuperconductingUIState {

	
	// Parent state object
  pstate: SuperconductingState

	// Sets it to tour mode along with tour step information
	// TODO: Move to global
	tourMode: boolean = false;
  tourStep: number = 0;

  // Colour blind mode
  // TODO: Move to global
	colourblindActive: boolean = false;

	// Components related to tools and regions
  componentData: UIComponentData = {
		selectedTool: -1,
		selectedSubTool: -1,
		selectedRegion: -1,
		selectedRegionType: 'N/A'
  };

	// Update subtypes
	// TODO: Investigate this
  subTypes: any = [];

	// Outlines if the subtypes have been received
	subTypesRecvd: boolean = false;
	
	// Used for specifying the kind of routing on particular
	// regions
  routerList: Map<string, RouterAggr> = new Map();

  // Will update the router list 
	routerListRcvd: boolean = false;

	// Will represent the router selected for the region
	selectedRouterIndex: number = -1;

  /**
   * Constructor with the superconducting state as a parameter
   * will represent an aggregate of states involved here
   */
  constructor(pstate: SuperconductingState) {
    this.pstate = pstate;
  }

	/**
	 * Formally, this was attached to the RottnestContainer
	 * this is a wrapper function for parts of the codebase that still
	 * leverage this
	 */
	triggerUpdate() {
		this.pstate.triggerUpdate();
	}

	/**
	 * Gets the selected region data object when requested,
	 * if a region data object has not been selected it will
	 * return null
	 */
	getSelectedRegionData(): RegionData | null {
		const getSelectedIdx = this.componentData.selectedRegion;
		const selKey = this.componentData.selectedRegionType 
			!== null ? this.componentData.selectedRegionType : 'NA';
		const getSelectedKeyStr = RegionData.PluraliseKind(selKey);

		return this.pstate.getWorkState().getRegionList()
			.retrieveByIdx(getSelectedKeyStr, 
			getSelectedIdx);
	}
	
	/**
	 * Selects the current region using kind and index
	 */
	selectCurrentRegion(kind: string, idx: number) {
		const workstate = this.pstate.getWorkState();
		const selectedObj = workstate.getRegionList()
			.retrieveByIdx(kind, idx);
		if(selectedObj) {
			this.componentData.selectedRegion = idx;
			this.componentData.selectedRegionType = kind;
			this.triggerUpdate();
		} else {
			console
			.error("Unable set current region");
		}
	}

	/**
	 * Retrieves the current tool index that
	 * has been selected
	 */
	getToolIndex() {
		return this.componentData.selectedTool;
	}

	/**
	 * Gets the index of the currently selected subtool
	 */
	getSubToolIndex() {
		return this.componentData.selectedSubTool;
	}

	/**
	 * Gets the selection data
	 */
	getRegionSelectionData(): [number, string | null] {
		return [
			this.componentData.selectedRegion,
			this.componentData.selectedRegionType,
		]

	}

	/**
	 * Gets the subtypes and selected
	 */
	getSubTypesAndSelected(): 
		{ 
			subTypes: Array<SubKind>
			selectedSubTypeTool: number
		} {
		const workstate = this.pstate.getWorkState();
		const keyObj = workstate.toolToRegionKey();
		if(keyObj) {
		const key = RegionData.SingularKind(
			keyObj) as keyof SuperconductingRegionKindMap;

		//TODO: You are apparently a map?

		if(key !== null) {
			return {
				subTypes: this.subTypes[key].map((e: any) => 
					{ return (
						{ name: e.name }) 
					}),
				selectedSubTypeTool:
					this.componentData
					.selectedSubTool
				}
			}
		} 
		return {
			subTypes: [{ name: 'Not Selected' }],	
			selectedSubTypeTool: this
				.componentData
				.selectedSubTool
		}

	}


	/**
	 * Updates the selected subtype
	 */
	updateSelectedSubType(subTypeIndex: number) {
		this.componentData.selectedSubTool = subTypeIndex;
		//this.opers.validate(this); //TODO: Update this
		this.triggerUpdate(); //TODO: update this
	}

	/**
	 * Returns the router list that had been received
	 */	
	getRouterList() {
		return this.routerList;
	}

	/**
	 * Gets the selected router index
	 */
	getSelectedRouterIndex() {
		return this.selectedRouterIndex;
	}

	/**
	 * Updates the router list
	 */
	updateRouterList(routers: Map<string, RouterAggr>) {
		this.routerList = routers;
		this.routerListRcvd = true;
		// this.opers.validate(this); //TODO: update this
		this.triggerUpdate(); //TODO: Update this
	}

	/**
	 * Updates the subtypes list
	 */
	updateSubTypes(subTypes: SuperconductingRegionKindMap) {
		this.subTypes = subTypes;
		this.subTypesRecvd = true;
		// this.validate(this);
		this.triggerUpdate();
	}
} 
