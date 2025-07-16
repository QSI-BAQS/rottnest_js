import { RegionData } from "../../obj/LatticeRegionData";
import { ProjectDump } from "../../obj/Project";
import { RegionDataList } from "../../obj/RegionDataList";


/**
 * The project class manages the current project and the information
 * that can recorded and gained from this
 */
export class LatticeDesignProject {

  regionlist: RegionDataList = new RegionDataList();
	
  /**
   * Gets the region list that is the project itself.
   */
	getRegionList(): RegionDataList {
		return this.regionlist;
	}


  /**
   * Given new region data to be integrated, we need to
   * know what selected region was given and what to update
   * NOTE: This queried information that is stated here,
   *     should be packaged with the method call
   */
	updateSelectedRegionDataNoUpdate(regData: RegionData) {
		const getSelectedIdx = this.state.appStateData
			.componentData.selectedRegion;

		const getSelectedKeyStr = this.state.appStateData
			.componentData.selectedRegionType;
		this.getRegionList()
			.updateByIdx(getSelectedKeyStr, 
				     getSelectedIdx, 
				     regData);
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
		const regionList = this.state.regionList;
		const selectedRegion = this
			.getSelectedRegionData();

		if(selectedRegion) {
			const edges = selectedRegion.edgeAABBs();
			const aregs = this.state.regionList
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
	 * Given a kind and the index that it is mapped to
	 * it will remove the region from the list
	 * NOTE: Is this actually a UI method?
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

  /**
   * Updates the selected region data
   */
	updateSelectedRegionData(regData: RegionData) {
		this.updateSelectedRegionDataNoUpdate(regData);
		//this.opers.validate(this);
		this.triggerUpdate();
	}
	

  /**
   * Given a deserialized file, we need to transform it from
   * a flattened graph to a linked graph within the system
   */
	parseData(content: string | null) {
		if(content) {
			const jsonRep = JSON.parse(content);
			if(jsonRep) {
				const partialDump: 
					Partial<ProjectDump> 
					= jsonRep;
				const dump: ProjectDump = {
					project: partialDump.project != null ?
						jsonRep.project : this.state.projectDetails,
					regions: partialDump.regions != null ? jsonRep.regions :
					  this.state.regionList
				};
				
				this.state.projectDetails = dump.project;
				this.state.regionList = RegionDataList.fromFlatten(dump.regions);

				//TODO: Fix this
				const newState = {...this.state};
				//const dspace = this.monitorComponent.designSpace;
				//TODO: Trigger a re-run of the cells once loaded
				// 
				//if(dspace) {
				// 	dspace.redoCells(newState.projectDetails.width,
				// 	  newState.projectDetails.height);
				// }
				//TODO: Fix this
				this.setState(newState);

				//this.triggerUpdate();
			}
			
		}
	}

	
  // NOTE: Loosely connected methods below

  /**
   * Formally: resetData()
   * It is now resetDataList, used to reset the regionlist, typically when a new
   * project is to be applied here
   */
	resetDataList() {
		this.regionlist = new RegionDataList();
		//TODO: May want to check to see if this works
		//his.state.appStateData = this.schemaData.getDefaults().rtstate.appStateData;

    // We want to have a tabdata that is a little more robust here
		// Fix the tab data part here
		this.state.tabData = {
			selectedTabIndex: 0,
			availableTabs: [true, false, false, false],
			tabNames: ['Architecture', 'Call Graph', 
				'Visualiser', 'Run Chart']
		};

		// This resets the rest of the data
		// Rest should be in respective locations and called by the object
		this.state.graphViewData = RottCallGraphDefault(),	
		this.state.visData = VisData.empty();
		this.regionStack = new RegionsSnapshotStack();
		this.currentRDBuffer = new RegionData();

	}
	
}
