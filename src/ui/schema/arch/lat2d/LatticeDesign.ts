
import { ArchitectureDesigner } from '../ArchSchema.ts';
import { ArchWorkspaceGroup, ArchWorkspaceProps } from '../ArchWorkspace.ts';
import { RegionData } from './obj/LatticeRegionData.ts';
import { RegionDataList } from './obj/RegionDataList.ts';
import { LatticeRegionKindMap } from './obj/RegionKindMap.ts';

/**
 * State object of things which are currently being operated on.
 */
export class LatticeWorkingState {

  selectedRegion: number = -1;
  selectedRegionType: string = 'N/A';
  
  
	getSelectedRegionData(): RegionData | null {
		const getSelectedIdx = this.selectedRegion;
		const selKey = this.selectedRegionType 
			!== null ? this.selectedRegionType  : 'NA';
		const getSelectedKeyStr = RegionData
			.PluraliseKind(
			selKey);


		return this.getRegionList()
			.retrieveByIdx(getSelectedKeyStr, 
			getSelectedIdx);
	}

	
	updateSelectedSubType(subTypeIndex: number) {
		this.state.appStateData
			.componentData
			.selectedSubTool = subTypeIndex;
		this.opers.validate(this);
		this.triggerUpdate();
	}
}

/**
 * LatticeDesign which reflects the design object
 * within the designer and operations related to it.
 */
export class LatticeDesign {

  state: LatticeWorkingState;

  constructor() {
    this.state = new LatticeWorkingState();
     
  }

}


/**
 * Constructs the workspace group that will be used by the workspace component
 * within rottnest
 */
export class LatticeDesignerUIGroup implements ArchWorkspaceGroup {
  makeGroup(_data: ArchWorkspaceProps): Array<React.ReactElement> {
      return [];
  }
}

/**
 * The meta object here is for holding information that will be
 * used by UI components
 */
export class LatticeDesignerMeta {
	
	regionList: RegionDataList;
	subTypes: LatticeegionKindMap;
	routerList: Map<string, RouterAggr> //Designer
	routerListRcvd: boolean = false;
	

	selectedRouterIndex: number = 0;

	// NOTE: Need to fix up field
	// 
	getRouterList() {
		return this.routerList;
	}


	
	getSelectedRouterIndex() {
		return this.selectedRouterIndex;
	}


	//
	updateRouterList(routers: Map<string, RouterAggr>) {
		this.routerList = routers;
		this.routerListRcvd = true;
		this.opers.validate(this);
		//this.triggerUpdate(); - Need to figure out how we trigger
		// updates
	}

	

	updateSubTypes(subTypes: RottnestKindMap) {
		this.state.subTypes = subTypes;
		this.state.subTypesRecvd = true;
		this.opers.validate(this);
		this.triggerUpdate();
	}


	//
	deleteSelectedRegion(kind: string, idx: number) {

		const selectedObj = this.getRegionList()
			.retrieveByIdx(kind, idx);

		if(selectedObj) {
			//1. Add onto the undo stack
			this.onRegion();
			
			//2. Delete
			selectedObj.markAsDead();	
		}
	}


	selectCurrentRegion(kind: string, idx: number) {
		const selectedObj = this.getRegionList()
			.retrieveByIdx(kind, idx);
		if(selectedObj) {
			this.state.appStateData.componentData
				.selectedRegion = idx;
			this.state.appStateData.componentData
				.selectedRegionType = kind;
			
			this.triggerUpdate();
		} else {
			console
			.error("Unable set current region");
		}
	}
	
	// NOTE: Marked for removal, will use schema instead
	// WARNING: Do not use this anymore
	updateSelectedSubType(subTypeIndex: number) {
		this.state.appStateData
			.componentData
			.selectedSubTool = subTypeIndex;
		this.opers.validate(this);
		this.triggerUpdate();
	}

	getSubTypesAndSelected(): 
		{ 
			subTypes: Array<SubKind>
			selectedSubTypeTool: number
		}{
		const keyObj = this.toolToRegionKey();
		if(keyObj) {
		const key = RegionData.SingularKind(
			keyObj) as keyof RottnestKindMap;

		//TODO: You are apparently a map?

		if(key !== null) {
			return {
				subTypes: this.state
					.subTypes[key]
					.map((e) => 
					{ return (
						{ name: e.name }) 
					}),
				selectedSubTypeTool: this.state
					.appStateData
					.componentData
					.selectedSubTool
				}
			}
		} 
		return {
			subTypes: [
				{ name: 'Not Selected' }
			],	
			selectedSubTypeTool: this.state
				.appStateData
				.componentData
				.selectedSubTool
		}

	}

	
	updateSelectedRegion(x: number, y: number) {
		const aggrData = this.state.regionList
			.getRegionDataFromCoords(x, y); 

		if(aggrData) {
			this.state.appStateData.componentData
			.selectedRegion 
				= aggrData.regIdx
			this.state.appStateData.componentData
			.selectedRegionType 
				= RegionData.PluraliseKind(
					aggrData.kind);
			this.opers.validate(this);
			this.triggerUpdate();
		} else {
			//reset
			this.state.appStateData.componentData
			.selectedRegion 
				= -1; 
			this.state.appStateData.componentData
			.selectedRegionType 
				= null;
			this.opers.validate(this);
			this.triggerUpdate();

		}
	}

	getSelectedRegionData(): RegionData | null {
		const getSelectedIdx = this.state.appStateData
			.componentData.selectedRegion;
		const selKey = this.state.appStateData
			.componentData.selectedRegionType 
			!== null ?
			this.state.appStateData
			.componentData.selectedRegionType  
				: 'NA';
		const getSelectedKeyStr = RegionData
			.PluraliseKind(
			selKey);


		return this.getRegionList()
			.retrieveByIdx(getSelectedKeyStr, 
			getSelectedIdx);
	}
}


/**
 * The current target for the designer
 * It will hold the current state of the design
 */
export class LatticeDesignBuffer {

	
}


export class LatticeDesigner implements ArchitectureDesigner {

	target: LatticeDesign = new LatticeDesign();

	
  makeWorkspaceGroup(): ArchWorkspaceGroup {
    return new LatticeDesignerUIGroup();
  }
	
}
