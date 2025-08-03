

/*
  Remembering the fields from the previous version:
  :: ::
	schemaData: RottnestContainerSchema
		= new RottnestContainerSchema();
	
	commData: AppCommData = this.schemaData
		.getData()
		.rtcommdata;

	opers: RottnestContainerOperations = this.schemaData.getOperations();
	state: RottnestState = this.schemaData.getData().rtstate;
*/

export class RottnestCompatibility {
  
	// // WARNING: Not done
	// gotoVizWithData(data: any) {
	// 	console.log(data);
	// 	this.state.tabData.selectedTabIndex = 2;
	// 	this.state.tabData.availableTabs[2] = true;
	// 	//this.state.visData = data; //Causing issues
	// 	this.triggerUpdate();
	// }

	// // WARNING: Not done
	// getProjectAssembly(): ProjectAssembly {
	// 	return {
	// 		projectDetails: this.state
	// 			.projectDetails,
	// 		regionList: this.state.regionList
	// 	}
	// }
	
	// getProjectDetails() {
	// 	return this.state.projectDetails;
	// }
}
