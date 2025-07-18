/**
 * The meta object here is for holding information that will be
 * used by UI components
 */
export class SuperconductingDesignerMeta {
	
	regionList: RegionDataList;
	subTypes: SuperconductingRegionKindMap;
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
