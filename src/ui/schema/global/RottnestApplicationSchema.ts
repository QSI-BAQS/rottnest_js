// import { ContainerSchema } from '../Schema.ts';
// //import { RottnestKindMap } from '../../../model/RegionKindMap';
// //import { RottCallGraphDefault } from '../../../model/CallGraph';
// import { AppServiceClient } from '../../../net/AppService';
// import AppServiceModule from '../../../net/AppServiceModule';
// //import RottnestContainer from '../../container/RottnestContainer.tsx';
// import { ValidationExecutor } from '../../../vald/Validation.ts';

// //import VisData from '../../vis/VisData.ts';
// import { NotifyQueue } from '../../global/notify/NotifyMessage.tsx';

// /// Will need to do something about this
// export type AppCommData = {
// 	appService: AppServiceClient
// }

// /// Will need to do something about this
// type TabViewStateData = {	
// 	selectedTabIndex: number
// 	tabNames: Array<string>
// 	availableTabs: Array<boolean>
// }

// /**
//  *  Container State information
//  *  that can be updated by other components
//  *  or internally.
//  */
// /*type RottnestAppState = {
// 	settingsActive: boolean
// 	newProjectActive: boolean
// 	archSettingsActive: boolean
// 	progSettingsActive: boolean
// 	helpActive: boolean
// 	colourblindActive: boolean
// 	tourMode: boolean
//   tourStep: number
// 	zoomValue: number
// 	componentData: { // Should be moved out
// 		selectedTool: number
// 		selectedSubTool: number
// 		selectedRegion: number
// 		selectedRegionType: string | null 
// 	},
// 	archData: { //Consider moving out
// 		architectures: Array<ArchitecturePlugin>,
// 		config: ArchitecturePluginConfig,
// 		current: ArchitecturePlugin
// 	},
// 	progData: { //Consider moving out
// 		programs: Array<ProgramPlugin>,
// 		config: ProgramPluginConfig
// 		current: ProgramPlugin

// 	}
// }*/

// /**

// 	I need to do something with these

// 	subTypesRecvd: boolean // Not done
// 	routerListRcvd: boolean // Not done
// 	selectedRouterIndex: number // Not done

//  */

// export type RottnestState = {
// 	//appStateData: RottnestAppState 
// 	tabData: TabViewStateData //---
// 	errorDisplay: boolean
// 	errorMessage: string
// 	//rrBuffer: RunResultBuffer 
// 	valexec: ValidationExecutor
// }
// /**
//  * Maintains state information related to
//  * rendering and data
//  */
// /*export type RottnestState = {
// 	projectDetails: ProjectDetails // Moved to interface - ArchSchema.ts
// 	appStateData: RottnestAppState 
// 	regionList: RegionDataList //Designer (Done) - LatticeDesign.ts
// 	subTypes: RottnestKindMap  //Designer (Done) - LatticeDesign.ts
// 	routerList: Map<string, RouterAggr> //Designer (Done) - LatticeDesign.ts
// 	tabData: TabViewStateData //---
// 	subTypesRecvd: boolean // Not done
// 	visData: any // Not done
// 	routerListRcvd: boolean // Not done
// 	selectedRouterIndex: number // Not done
// 	errorDisplay: boolean
// 	errorMessage: string
// 	graphViewData: RottCallGraph // CallGraph (Done) - LatticeCallGraph.ts
// 	rrBuffer: RunResultBuffer 
// 	valexec: ValidationExecutor
// }*/

// /**
//  * Aggregate data container
//  * Currently only one field that will hold the data
//  */
// type RottnestContainerAggr = {
//   rtstate: RottnestState
//   rtcommdata: AppCommData
//   //rtsubkinds: RottnestKindMap
// }

// /**
//  * List of subkinds, subkinds get reported from the
//  * backend
//  */
// // let RottnestSubKinds: RottnestKindMap = {
// // 	bus: [{ name: 'Not Selected' }],	
// // 	register: [{ name: 'Not Selected'}],
// // 	bellstate: [{ name: 'Not Selected'}],
// // 	factory: [{ name: 'Not Selected'}],
// // 	buffer: [{ name: 'Not Selected' }]	
// // }

// /**
//  * RTCommData, used to hold onto the service
//  * instance as there is only going to be one
//  * socket/pipe in use.
//  */
// const RTCommData: AppCommData = {
// 		appService: AppServiceModule
// 			.GetAppServiceInstance()
// };

// /**
//  * Defaults around the rottnest state
//  * data, will be used in part to initialise
//  * the project data and other buffers as necessary
//  */
// const RTStateDefault: RottnestState = 
// {
// 		projectDetails: {
// 			name: 'Project1',
// 			version: '1',
// 			architecture: 'lat2d',
// 			author: 'User',
// 			width: 20,
// 			height: 20,
// 			description: 'Quick Description'
// 		},
// 		notifyQueue: new NotifyQueue(),
// 		regionList: new RegionDataList(),
// 		subTypes: RottnestSubKinds,	
// 		routerList: new Map(),
// 		subTypesRecvd: false,
// 		routerListRcvd: false,
// 		selectedRouterIndex: 0,
// 		errorMessage: '',
// 		errorDisplay: false,
// 		appStateData: {
// 			tourMode: false, //TODO: Utilise these variables
// 			tourStep: 0,
// 			settingsActive: false,
// 			newProjectActive: false,
// 			archSettingsActive: false,
// 			progSettingsActive: false,
// 			zoomValue: 100,
// 			colourblindActive: false,
// 			helpActive: false,
// 			componentData: {
// 				selectedTool: 0,
// 				selectedSubTool: 0,
// 				selectedRegion: -1,
// 				selectedRegionType: null
// 			},
// 			archData: {
// 				architectures: [],
// 				config: { config: '' },
// 				current: { identifier: 'N/A', api_map: {} }
// 			},
// 			progData: {
// 				programs: [],
// 				config: { config: ''},
// 				current: { name: 'N/A', params: [] }
// 			}
// 		},		
// 		tabData: {
// 			selectedTabIndex: 0,
// 			availableTabs: [true, false, false, false],
// 			tabNames: ['Architecture', 'Call Graph', 
// 				'Visualiser', 'Run Chart']
// 		},
// 		graphViewData: RottCallGraphDefault(),	
// 		visData: VisData.empty(),
// 		rrBuffer: new RunResultBuffer(),
// 		valexec: ValidationExecutor.Make()
// };



// export class RottnestContainerSchema implements ContainerSchema<
//   RottnestContainerAggr,
//   RottnestContainerOperations> {

//   data: RottnestContainerAggr = RottnestContainerSchema.DataDefaults();

// 	/**
// 	 * Returns defaults of the data that will represent
// 	 * the state objects, commdata and subkinds
// 	 */
//   static DataDefaults(): RottnestContainerAggr {
//     return {
// 			rtstate: RTStateDefault,
// 			rtcommdata: RTCommData,
// 			rtsubkinds: RottnestSubKinds
//     }
//   }

//   getDefaults(): RottnestContainerAggr {
//     return {
//         rtstate: { ...RTStateDefault },
//         rtcommdata: { ...RTCommData },
//         rtsubkinds: { ...RottnestSubKinds }
//     };
//   }

// 	/**
// 	 * Will return an aggregate object with
// 	 * state, commdata and subkinds
// 	 */
//   getData(): RottnestContainerAggr {
//     return this.data;
//   }

// 	/**
// 	 * Returns a set of operations that will
// 	 * operate on the container
// 	 */
//   getOperations(): RottnestContainerOperations {
//     return {

// 			/**
// 			 * Validates the project assembly against the validation
// 			 * ruleset implemented
// 			 * The ruleset 
// 			 */
//     	validate: (rtc: RottnestContainer) => {
// 				const valexec = rtc.state.valexec;
// 				const projasm = rtc.getProjectAssembly();

// 				valexec.localOnly(projasm);
    		
//     	}
//     };
//   }
  
// }


