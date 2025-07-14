import React from 'react';
import GlobalBar from '../global/GlobalBar.tsx';

import SettingsForm from './SettingsForm';
import NewProjectForm from './NewProjectForm';
import ErrorDisplay from './ErrorDisplay.tsx';
import HelpWorker from '../help/HelpWorker.tsx';  

import { RouterAggr} from '../../net/Messages.ts';
import { HelpContainer } from './HelpContainer.tsx';
import { AppCommData, RottnestContainerOperations, RottnestContainerSchema }
	from '../schema/global/RottnestContainerSchema.ts';
import { HelpDataCollection, HelpUISchema } from '../schema/global/HelpUISchema.ts';


import { PluginData, PluginEntry } from '../global/settings/GeneralSettings.tsx';
import { ProgramPlugin, ProgramPluginToEntry } from '../../obj/plugin/Program.ts';
import { ArchitecturePlugin, ArchitecturesToEntry } from '../../obj/plugin/Architecture.ts';
import { NotifyMessage, NotifyMessageSpace, NotifyQueue } from '../global/notify/NotifyMessage.tsx';
import { UpdateTrigger } from '../../service/RefreshService.ts';

import { MSG_GLOBAL_MAP } from '../../net/MessageRemap.ts';
import styles from '../styles/RottnestContainer.module.css';
import { RottnestProperties, RottnestState } from '../schema/global/ApplicationState.ts';
import { RottnestApplicationModules } from '../schema/global/RottnestApplicationSchema.ts';



/**
 * This is the rewrite of the rottnest container
 */
export class RottnestApplication extends React.Component<RottnestProperties, RottnestState>
	implements UpdateTrigger {

	modules: RottnestApplicationModules = new RottnestApplicationModules();

	/**
	 * Requires to be implemented as part of update
	 * trigger interface
	 */
	triggerUpdate(): void {
		let nstate = {...this.state};
		this.setState(nstate);
	}

	/**
	 * Will mount components during its load as well as check to see
	 * if certain objects are ready.
	 */
	componentDidMount() {
		this.state.appState.readyAppService();

		HelpWorker.loadHelpData('en')
			.then((_data: any) => { })
			.catch((err: any) => { console.error("Failed to load help data: ", err)})
	}

	/**
	 * Will perform unmounting operations to ensure that
	 * any side effects don't impact other contexts
	 */
	componentWillUnmount() {
  		if (this.modules.getServices().help.isActive()) {
  			this.modules.getServices().inputs.removeHook('keydown');
  		}
	}

	/**
	 * Main render call for the RottnestApplication object
	 */
	render() {

		return (
			<>
			</>
		)
	}
}

/**
 * Container for the main application
 * Will be a single page with a number of different
 * components rendered underneath it
 *
 */
class RottnestContainer extends React.Component<RottnestProperties, RottnestState> {

	
	schemaData: RottnestContainerSchema
		= new RottnestContainerSchema();
	
	commData: AppCommData = this.schemaData
		.getData()
		.rtcommdata;

	helpData: HelpDataCollection
		= HelpUISchema.DataDefaults();
	opers: RottnestContainerOperations = this.schemaData.getOperations();
	state: RottnestState = this.schemaData
		.getData()
		.rtstate;

	constructor(props: RottnestProperties) {
		super(props);
	}

	closeError() {
		this.state.errorDisplay = false;
		this.triggerUpdate();
	}
	
	getRRBuffer() {
		return this.state.rrBuffer;
	}


	/**
	 * Shows an program settings selector
	 * in a similar manner to the settings modal
	 */


	//Transferred mostly (LatticeVisualiser.ts)
	getVisData() {
		return this.state.visData.vis_obj;
	}

	// WARNING: Not done
	gotoVizWithData(data: any) {
		console.log(data);
		this.state.tabData.selectedTabIndex = 2;
		this.state.tabData.availableTabs[2] = true;
		//this.state.visData = data; //Causing issues
		this.triggerUpdate();
	}

	// WARNING: Not done
	getProjectAssembly(): ProjectAssembly {
		return {
			projectDetails: this.state
				.projectDetails,
			regionList: this.state.regionList
		}
	}


	monitorComponent: ComponentMonitor = {
		designSpace: null,
		settingsForm: null
	}
	
	//NOTE: Moved to LatticeCallGraph.ts
	getCGGraph() {
		return this.state.graphViewData;
	}

	//NOTE: Moved to LatticeDesign.ts
	getRouterList() {
		return this.state.routerList;
	}

	//NOTE: Moved to LatticeDesign.ts
	getSelectedRouterIndex() {
		return this.state.selectedRouterIndex;
	}

	// Moved to LatticeDesign.ts
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

	// Moved to LatticeDesign.ts
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

	//TODO: Funny method, subTypes and selected might be
	//messing with things
	// NOTE: Marked for removal, will use schema instead
	// WARNING: Do not use this anymore
	getRegionListData() {
		return {
			regionList: this.state.regionList,
			selectedIdx: this.state.appStateData
				.componentData
				.selectedRegion,
			selectedKind: this.state.appStateData
				.componentData
				.selectedRegionType,
			subTypes: this.state.subTypes,
			connectionRecs: [{name: 'None/Invalid', 
				connectorId: 0}]
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

	// Moved to LatticeDesign.ts
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

	//Moved to LatticeDesign.ts
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

	getRegionSelectionData(): [number, string | null] {
		return [
			this.state.appStateData.componentData
			.selectedRegion,
			this.state.appStateData.componentData
			.selectedRegionType,
		]

	}



	resetData() {
		this.state.regionList = new RegionDataList();
		//TODO: May want to check to see if this works
		this.state.appStateData = this.schemaData.getDefaults().rtstate.appStateData;
		this.state.tabData = {
			selectedTabIndex: 0,
			availableTabs: [true, false, false, false],
			tabNames: ['Architecture', 'Call Graph', 
				'Visualiser', 'Run Chart']
		};
		this.state.graphViewData = RottCallGraphDefault(),	
		this.state.visData = VisData.empty();
		this.regionStack = new RegionsSnapshotStack();
		this.currentRDBuffer = new RegionData();

	}

	registerDesignSpace(designSpace: DesignSpace) {
	       this.monitorComponent.designSpace = designSpace;
	}

	registerSettingsForm(settingsForm: SettingsForm) {
	       this.monitorComponent.settingsForm = settingsForm;
	}

	getProjectDetails() {
		return this.state.projectDetails;
	}


	
	makeNotification(msg: NotifyMessage) {
		this.state.notifyQueue.enqueueMessage(msg);
	}

	undoRegion() {
		let res = this.regionStack.undoAction(
			this.state.regionList
		);
		if(res) {
			this.state.regionList = res;
			this.opers.validate(this);
			this.triggerUpdate();
		}
		
	}

	redoRegion() {
		let res = this.regionStack.redoAction(
			this.state.regionList
		);
		if(res) {
			this.state.regionList = res;
			this.triggerUpdate();
		}
		
	}

	onRegion() {
		this.regionStack.onAction(
			this.state.regionList.cloneList()
		);
	}



	/**
	 * Retrieves the current tool index that
	 * has been selected
	 */
	getToolIndex() {
		return this.state.appStateData.componentData
			.selectedTool;
	}

	getSubToolIndex() {
		return this.state.appStateData
			.componentData.selectedSubTool;
	}

	


	/**
	 * Updates the state and triggers a
	 * re-render
	 */
	triggerUpdate() {
		const newState = {...this.state};
		this.setState(newState);
		
	}


	/**
	 * Takes the project from settings and writes it
	 * to the save buffer
	 */
	applySettings(project: ProjectDetails) {
		this.state.projectDetails = project;	
		this.state.appStateData.settingsActive = false;

		const newState = {...this.state};
		const dspace = this.monitorComponent.designSpace;
		if(dspace) {
			dspace.redoCells(newState
					 .projectDetails.width,
				newState.projectDetails.height);
		}
		this.setState(newState);

	}

	applyNewProject(project: ProjectDetails) {
		this.resetData();
		this.state.projectDetails = project;	
		this.state.appStateData.settingsActive = false;
		this.state.appStateData.newProjectActive = false;
		
		const newState = {...this.state};
		const dspace = this.monitorComponent.designSpace;
		if(dspace) {
			dspace.redoCells(newState.projectDetails.width,
				newState.projectDetails.height);
		}
		this.setState(newState);
	}

	/**
	 * Modifies the zoomIn and zoomOut
	 * TODO: Bug with zoom-ing and breaking the grid gap
	 */
	zoomIn(perc: number) {
		if((this.state.appStateData.zoomValue + perc) <= 400) {
			this.state.appStateData.zoomValue += perc;	
			this.triggerUpdate();
		}
	}

	/**
	 * Modifies the zoomIn and zoomOut
	 * TODO: Bug wih zoom-ing and breaking the grid gap
	 */
	zoomOut(perc: number) {
		if((this.state.appStateData.zoomValue - perc) > 0) {
			this.state.appStateData.zoomValue -= perc;	
			this.triggerUpdate();
		}
	}

	resetDSMove() {
		const dspace = this.monitorComponent.designSpace;
		if(dspace) {
			dspace.resetMove();
		}
	}

	updateVisibility(region: RegionData, visible: boolean) {	
		region.setVisbility(visible);
		this.triggerUpdate();
	}

	updateSelectedTab(idx: number) {
		const tabs = this.state.tabData.tabNames;
		this.state.tabData.selectedTabIndex 
			= idx % tabs.length;
		this.triggerUpdate();
	}

	// TODO: Check this method
	saveArchData(data: PluginData) {
		const arch = this.state.appStateData
			.archData.architectures.find(
				(e: ArchitecturePlugin) => e.identifier === data.plgKey);
		if(arch) {
			this.state.appStateData.archData.current = arch;
			this.triggerUpdate();
		} 
			
	}

	// TODO: Check this method
	saveArchConfig(data: PluginData) {
		
		this.state.appStateData.progData.config.config = data.plgValue;
		this.triggerUpdate();
		this.commData.appService.sendObj(MSG_GLOBAL_MAP['arch_set_config'],
			{ config: data.plgValue });
	}

	// TODO: Check this method
	saveProgramData(data: PluginData) {
		const prog = this.state.appStateData
			.progData.programs.find((e: ProgramPlugin) => e.name === data.plgKey);
		if(prog) {
			this.state.appStateData.progData.current = prog;
			this.triggerUpdate();
		} 
	}

	// TODO: Check this method
	saveProgramConfig(data: PluginData) {
		this.state.appStateData.progData.config.config = data.plgValue;
		this.triggerUpdate();
		this.commData.appService.sendObj(MSG_GLOBAL_MAP['program_set_config'],
			{ config: data.plgValue });
	}

	getProgramConfig(): string {
		return this.state.appStateData.progData.config.config;
	}

	getArchConfig(): string {
		return this.state.appStateData.archData.config.config;
	}

	getArchItems(): Array<PluginEntry> {
		return this.state.appStateData.archData.architectures.map((a) => {
			return ArchitecturesToEntry(a);
		})
	}

	getProgramList(): Array<PluginEntry> {
		return this.state.appStateData.progData.programs.map((p) => {
			return ProgramPluginToEntry(p);
		})
	}

	getCurrentExe(): ProgramPlugin {
		return this.state.appStateData.progData.current
	}

	getCurrentArch(): ArchitecturePlugin {
		return this.state.appStateData.archData.current
	}
	
	render() {
		const rottContainer = this;
		const updateables = new Map();
		const zoomValue = this.state
			.appStateData.zoomValue;
	
		const settingsisActive = !this.state.appStateData
			.settingsActive;
		const newProjectActive = this.state.appStateData
			.newProjectActive;


		const newProjectElement = newProjectActive ? 
			<NewProjectForm rootContainer={rottContainer}/> :
		<></>

		//const notifyMsg = this.state.notifyQueue.dequeueProxy();
		//const notifyMsgRender = notifyMsg !== null ? notifyMsg.getElement() : <></>;
	
		updateables.set(100, [`${zoomValue}%`, 
			rottContainer]);
		updateables.set(400, this.getCurrentArch().identifier);
		updateables.set(500, this.getCurrentExe().name);
	
		const errorComponent = this.state.errorDisplay ? 
			<ErrorDisplay message={this.state.errorMessage} 
				rootContainer={this} /> :
			<></>;
	
		// Help Componenet
		const helpComponent = this.state.appStateData.helpActive ?
  			<HelpContainer 
    				toggleOff={() => this.toggleHelp()}
    				helpData={this.helpData}
  			/> :
  		<></>;

		return (
			<div className={styles.rottnest}>
				<SettingsForm   rootContainer={rottContainer}
						isHidden={settingsisActive} 
						projectDetails={this.state.projectDetails}
				/>
				{newProjectElement}
				{errorComponent}
				{helpComponent}
				<NotifyMessageSpace queue={this.state.notifyQueue} />
				<GlobalBar componentMap={updateables}
						container={rottContainer} 
				/>
			
				<WorkspaceContainer 
						container={rottContainer}
				/>
			</div>
		)
	}
}

export default RottnestContainer;
