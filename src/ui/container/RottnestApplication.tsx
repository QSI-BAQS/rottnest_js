import React from 'react';
import GlobalBar from '../global/GlobalBar.tsx';

import SettingsForm from './SettingsForm';
import ErrorDisplay from './ErrorDisplay.tsx';
import { HelpContainer } from './HelpContainer.tsx';
import { NotifyMessageSpace } from '../global/notify/NotifyMessage.tsx';
import { UpdateTrigger } from '../../service/RefreshService.ts';
import { RottnestApplicationState, RottnestProperties, RottnestState }
	from '../schema/global/ApplicationState.ts'
import styles from '../styles/RottnestContainer.module.css';
import { ArchitectureUIContext } from '../schema/arch/ArchContext.ts';
import { ArchWorkspaceContainer } from './WorkspaceContainer.tsx'


/**
 * This is the rewrite of the rottnest container
 * It has removed all the significant dependencies it had and will delegate to the
 * the architecture object it has attached
 */
export default class RottnestApplication extends React.Component<RottnestProperties, RottnestState>
	implements UpdateTrigger {


	state: RottnestState = {
		appState: new RottnestApplicationState(this),
		appContext: new ArchitectureUIContext()
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
		//this.state.appState.readyAppService();
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
		return this.state.appContext;
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
	 * TODO: Fix this all
	 */
	render() {
		const rottContainer = this;
		const updateables = new Map();
		const zoomState = this.getModuleStates().getZoomState();
		const errorState = this.getModuleStates().getErrorState();
		const projectRet = this.getModuleStates().getProjectState();

		const archobj = rottContainer.getAppState().getArchitectureObject();
		
		const notifyService = this.getServices().notify;
		const helpService = this.getServices().help;
		const refservice = this.getServices().refresh;
		const archcontext = this.state.appContext;
		
		const isProjVisible = projectRet.isReady;
		let isNewProject = isProjVisible;
		let settingsForm = <></>;
		const projectState = projectRet.obj;
		
		if(isProjVisible && projectState) {
			const settingsisActive = projectState.isProjectSettingsActive();
			const newProjectActive = projectState.isNewProjectActive();
			isNewProject = (!settingsisActive && newProjectActive);
			settingsForm = <SettingsForm
					isNew={isNewProject}
					isHidden={isProjVisible}
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
    				toggleOff={() => helpService.handleEscKey}
    				helpData={helpService.getHelpData()}
  			/> :
  		<></>;

		return (
			<div className={styles.rottnest}>
				<NotifyMessageSpace queue={notifyService.getNotifyQueue()} />
				<GlobalBar componentMap={updateables} container={rottContainer} />
				<ArchWorkspaceContainer architecture={archobj}
					archcontext={archcontext} />

				{settingsForm}
				{errorComponent}
				{helpComponent}
			</div>
		)
	}
}
	
