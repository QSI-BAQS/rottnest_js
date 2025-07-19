import { RegionCell, RegionData, Regions } from "../obj/RegionData";
import { RegionDataList } from "../obj/RegionDataList";
import { SuperconductingRegionKindMap } from "../obj/RegionKindMap";
import { RegionsSnapshotStack } from "../obj/RegionSnapshotStack";
import { RunResultBuffer } from "../obj/RunResult";
import { SuperconductingState } from "./ArchState";


/**
 * It will receive run results from the backend
 * which correspond to widget ids and different components
 */
export class SuperconductingRunResultBuffer {
	rrBuffer: RunResultBuffer = new RunResultBuffer();
}


/**
 * State object of things which are currently being operated on.
 * Majority of the methods associated here were previously
 * located in RottnestContainer will be moved here
 */
export class SuperconductingWorkingState {

	//
	// Used for new updates from the designer
	designRegionBuffer: RegionData = new RegionData();

	// Used for holding/storing the whole design
	designRegionList: RegionDataList = new RegionDataList();

	// Parent state object
  pstate: SuperconductingState;

	// Snapshots that are held
	snapshots: RegionsSnapshotStack = new RegionsSnapshotStack(this);

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
	 * Formally getCurrentRDBuffer()
	 *
	 * Retrieves the current regionBuffer used by the designer
	 * to modify and commit
	 */
	getRegionBuffer(): RegionData {
		return this.designRegionBuffer;
	}

	/**
	 * Gets the region data list, all the regions are in a single
	 * list that constitutes the design at the current time
	 */
	getRegionList(): RegionDataList {
		return this.designRegionList;
	}


	// Compat function
	// TODO: Remove this or defer to a different place
	static ToolNumberToRegionKey(tnum: number)
		: string | null {
		switch(tnum) {
			case 1:
				return 'buffers';
			case 2:
				return 'bus';
			case 3:
				return 'factories';
			case 4:
				return 'bellstates';
			case 5:
				return 'registers';
			default:
				break;
		}

		return null;
	}

	// Compat function
	toolToRegionKey(): keyof Regions | null {

		const uistate = this.pstate.getUIState();
		const rtag = 
			SuperconductingWorkingState.ToolNumberToRegionKey(uistate.getToolIndex());
		if(rtag !== null) {
			return rtag as keyof Regions;
		}
		return null;
	}

	// Compat function
	// Should be replaced
	onRegion() {
		this.snapshots.action(this.designRegionList.cloneList());
	}

	/**
	 * Formally applyRDBuffer
	 *
	 * Applys the current regiondata buffer to 
	 * the region list. It will then duplicate the
	 * current regionlist and move on.
	 */	
	applyRegionDataBuffer() {

		const uistate = this.pstate.getUIState();
		const oldBuffer: RegionData = this.designRegionBuffer;
		this.designRegionBuffer = new RegionData();
		//The index 6, is currently the unselect,
		//this is *not good*

		if(uistate.getToolIndex() === 6) {
			//Clean up
			//TODO: We need to have callbacks 
			//for this
			//I have littered the code with
			//too much rubbish

			this.onRegion();
			this.designRegionList
				.cleanupIntersections(oldBuffer);
			// this.opers.validate(this);
			this.triggerUpdate();
		} else {
			const rkey = this.toolToRegionKey(); //TODO: Conversion exists,
			//just need to use it
			
			if(rkey) {
				const pkey = RegionData.SingularKind(rkey);

				const pkeyCvt = pkey as keyof SuperconductingRegionKindMap;
				const subkindFor = uistate.subTypes[pkeyCvt];
				let kindex = uistate.componentData.selectedSubTool;


				if(kindex === 0) {
					kindex = (subkindFor
						  .length-1)
					 % subkindFor.length;
				}

				const kSubKindDefault = subkindFor[kindex];
				
				
				oldBuffer.setSubKind(kSubKindDefault.name);

				this.onRegion();
				this.designRegionList.addData(oldBuffer, rkey);
				
				this.designRegionList.resolveConnectionsFromTraversal(false);

				let res: RegionCell | undefined = oldBuffer.cells.values()
					.next().value;

				if(res) {	
					const { x, y }: 
					{ x: number
					  y: number } 
						= res;	
					this
					.updateSelectedRegion(x,
							      y);
					
				}
				this.triggerUpdate();
			}
		}
	}


	/**
	 * Calls into the selected region and retrieves the
	 * list of adjacent regions that it can manually set
	 */
	getValidAdjacentsOfSelected() {
		const adjacentList = [
			{
				name: "Not Selected",
				listIdx: -1,
				connectorId: 0,
				direction: 0
			}
		]
		const regionList = this.designRegionList;
		const selectedRegion = this.pstate.getUIState()
			.getSelectedRegionData();

		if(selectedRegion) {
			const edges = selectedRegion.edgeAABBs();
			const aregs = this.designRegionList
				.discoverFromEdges(edges);
			const selKind = selectedRegion.getKind();
			adjacentList	
				.push(...aregs.map((ar, idx) =>{
					const kindP = RegionData
						.PluraliseKind(ar
						.regionData
						.getKind())
					return ({
						name: kindP,
						listIdx: 
							ar.ownIdx
						!== null ?
						ar.ownIdx : -1,
						connectorId: 
							idx+1,
						direction: ar.dir
					})
				})
				.filter((ar, _) => {
					return regionList
					.canConnectToKind(
							selKind, 
							ar.name);
				}));
		} 
		return adjacentList;
	}
	

  /**
   * Shows visibility of a region
   */
	updateVisibility(region: RegionData, visible: boolean) {	
		region.setVisbility(visible);
		this.triggerUpdate();
	}

	/**
	 * Deletes a selected region from the list
	 */
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
	
	//TODO: Funny method, subTypes and selected might be
	//messing with things
	getRegionListData() {
		const uistate = this.pstate.getUIState();
		return {
			regionList: this.designRegionList,
			selectedIdx: uistate.componentData.selectedRegion,
			selectedKind: uistate.componentData.selectedRegionType,
			subTypes: uistate.subTypes,
			connectionRecs: [{name: 'None/Invalid', connectorId: 0}]
		}
	}


	
	updateSelectedRegion(x: number, y: number) {

		const uistate = this.pstate.getUIState();
		const aggrData = this.designRegionList
			.getRegionDataFromCoords(x, y); 
		

		if(aggrData) {
			uistate.componentData
			.selectedRegion 
				= aggrData.regIdx
			uistate.componentData.selectedRegionType = RegionData.PluraliseKind(
					aggrData.kind);
			//this.opers.validate(this);
			this.triggerUpdate();
		} else {
			//reset
			uistate.componentData.selectedRegion = -1; 
			uistate.componentData.selectedRegionType = null;
			//this.opers.validate(this);
			this.triggerUpdate();

		}
	}

	/**
	 * Updates the selected regions but does not trigger an update
	 */
	updateSelectedRegionDataNoUpdate(regData: RegionData) {
		const uistate = this.pstate.getUIState();
		const getSelectedIdx = uistate.componentData.selectedRegion;
		const getSelectedKeyStr = uistate.componentData.selectedRegionType;
		this.getRegionList()
			.updateByIdx(getSelectedKeyStr, getSelectedIdx,regData);
	}

	/**
	 * Updates the selected region and triggers an update
	 */
	updateSelectedRegionData(regData: RegionData) {
		this.updateSelectedRegionDataNoUpdate(regData);
		// this.opers.validate(this);
		this.triggerUpdate();
	}


	//TODO: Clean up this
	resetData() {
		const visstate = this.pstate.getVisState();
		const cgstate = this.pstate.getCallGraphState();
		this.designRegionList = new RegionDataList();
		
		//TODO: May want to check to see if this works
		/*this.state.appStateData = this.schemaData.getDefaults().rtstate.appStateData;
		this.state.tabData = {
			selectedTabIndex: 0,
			availableTabs: [true, false, false, false],
			tabNames: ['Architecture', 'Call Graph', 
				'Visualiser', 'Run Chart']
		};*/
		
		this.snapshots = new RegionsSnapshotStack(this);
		this.designRegionBuffer = new RegionData();

		cgstate.reset();
		visstate.reset();
	}


}
