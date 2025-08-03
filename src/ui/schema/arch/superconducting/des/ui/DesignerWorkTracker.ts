

// /**
//  * The work tracker is used to keep track of regions
//  * that have been added
//  * It allows querying of the tracker to understand
//  * what has been selected
//  */
// export class SuperconductingDesignerWorkTracker {

  
// 	getRegionSelectionData(): [number, string | null] {
// 		return [
// 			this.state.appStateData.componentData
// 			.selectedRegion,
// 			this.state.appStateData.componentData
// 			.selectedRegionType,
// 		]

// 	}

// 	//TODO: Funny method, subTypes and selected might be
// 	//messing with things
// 	// NOTE: Marked for removal, will use schema instead
// 	// WARNING: Do not use this anymore
// 	getRegionListData() {
// 		return {
// 			regionList: this.state.regionList,
// 			selectedIdx: this.state.appStateData
// 				.componentData
// 				.selectedRegion,
// 			selectedKind: this.state.appStateData
// 				.componentData
// 				.selectedRegionType,
// 			subTypes: this.state.subTypes,
// 			connectionRecs: [{name: 'None/Invalid', 
// 				connectorId: 0}]
// 		}
// 	}

	
// 	updateVisibility(region: RegionData, visible: boolean) {	
// 		region.setVisbility(visible);
// 		this.triggerUpdate();
// 	}
// }
