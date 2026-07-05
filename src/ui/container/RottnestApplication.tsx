import React from 'react';
import GlobalBar from '../global/GlobalBar.tsx';
import ErrorDisplay from './error/ErrorDisplay.tsx';
import { HelpContainer } from './HelpContainer.tsx';
import { NotifyMessageSpace } from '../global/notify/NotifyMessage.tsx';
import { ArchWorkspaceContainer } from './WorkspaceContainer.tsx'
import { UpdateTrigger } from '../../service/RefreshService.ts';
import { RottnestApplicationState, RottnestProperties, RottnestState }
	from '../context/global/ApplicationState.ts'

import styles from '../styles/RottnestContainer.module.css';


/**
 * This is the rewrite of the rottnest container
 * It has removed all the significant dependencies it had and will delegate to the
 * the architecture object it has attached
 */
export default class RottnestApplication
	extends React.Component<RottnestProperties, RottnestState>
	implements UpdateTrigger {

	// State object for rottnest
	state: RottnestState = {
		appState: new RottnestApplicationState(this),
	}

	/**
	 * Constructs the application, ensures context has the arch object
	 */
	constructor(props: RottnestProperties) {
		super(props);
	}

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
		this.state.appState
			.getModuleStates()
			.readyAppService(this);

		
	}

	/**
	 * Will perform unmounting operations to ensure that
	 * any side effects don't impact other contexts
	 */
	componentWillUnmount() {
  		if (this.state.appState.modstate.getServices().help.isActive()) {
  			this.state.appState.modstate.getServices().inputs.removeHook('keydown');
  		}
	}

	/**
	 * Gets the UI context of the application
	 */
	getUIContext() {
		return this.state.appState.appContext;
	}

	/**
	 * Gets the application state and associated operations
	 */
	getAppState() {
		return this.state.appState;
	}

	/**
	 * Gets the services from the appstate module
	 */
	getServices() {
		return this.state.appState.modstate.getServices();
	}

	/**
	 * Gets the module states from the appstate object
	 */
	getModuleStates() {
		return this.state.appState.modstate.getStates();
	}

	/**
	 * Gets the settings form for the project
	 */
	getSettingsForm() {
		return this.state.appState
			.getArchitectureObject()
			.getProjectSettingsForm();
	}

	/**
	 * TODO: Fix this all
	 */
	render() {
		//SettingsForm is a dynamic component
		const SettingsForm = this.getSettingsForm();
		const rottContainer = this;
		const updateables = new Map();
		const zoomState = this.getModuleStates().getZoomState();
		const errorState = this.getModuleStates().getErrorState();
		const projectRet = this.getModuleStates().getProjectState();

		const archobj = rottContainer.getAppState().getArchitectureObject();
		
		const notifyService = this.getServices().notify;
		const helpService = this.getServices().help;
		const refservice = this.getServices().refresh;
		const archcontext = this.getUIContext();
		
		const isProjectUsable = projectRet.isReady;
		const isProjVisible = projectRet.visible;
		let isNewProject = isProjVisible;
		const projectState = projectRet.obj;
		

		let settingsForm = <></>;
		if(isProjectUsable && isProjVisible && projectState) {
			const settingsisActive = projectState.isProjectSettingsActive();
			const newProjectActive = projectState.isNewProjectActive();
			isNewProject = (!settingsisActive && newProjectActive);
			settingsForm = <SettingsForm
					isNew={isNewProject}
					isHidden={!isProjVisible}
					projectState={projectState}
				/>
		}
		const zoomValue = zoomState.getZoomValue();
		updateables.set(100, [`${zoomValue}%`, rottContainer]);
		
		const errorComponent = errorState.hasError() ? 
			<ErrorDisplay errorState={errorState}
				refreshService={refservice} /> : <></>;

		// Help Componenet
		const helpComponent = helpService.isActive() ?
  			<HelpContainer 
    				toggleOff={() => helpService.makeHidden()}
    				helpData={helpService.getHelpData()}
  			/> :
  		<></>;

		return (
			<div className={styles.rottnest}>
				<NotifyMessageSpace queue={notifyService.getNotifyQueue()} />
				<GlobalBar componentMap={updateables} container={rottContainer} />
				<ArchWorkspaceContainer
					architecture={archobj}
					archcontext={archcontext} />

				{settingsForm}
				{errorComponent}
				{helpComponent}
			</div>
		)
	}
}
	
