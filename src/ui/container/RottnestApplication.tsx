import React from 'react';
import GlobalBar from '../global/GlobalBar.tsx';

import SettingsForm from './SettingsForm';
import ErrorDisplay from './ErrorDisplay.tsx';
import { HelpContainer } from './HelpContainer.tsx';
import { NotifyMessageSpace } from '../global/notify/NotifyMessage.tsx';
import { UpdateTrigger } from '../../service/RefreshService.ts';
import { RottnestApplicationState, RottnestProperties, RottnestState }
	from '../schema/global/ApplicationState.ts
import styles from '../styles/RottnestContainer.module.css';
import { ArchitectureUIContext } from '../schema/arch/ArchContext.ts';



/**
 * This is the rewrite of the rottnest container
 * It has removed all the significant dependencies it had and will delegate to the
 * the architecture object it has attached
 */
export default class RottnestApplication extends React.Component<RottnestProperties, RottnestState>
	implements UpdateTrigger {


	state: RottnestState = {
		appState: new RottnestApplicationState(),
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

		HelpWorker.loadHelpData('en')
			.then((_data: any) => { })
			.catch((err: any) => { console.error("Failed to load help data: ", err)})
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
		const notifyService = this.getServices().notify;
		const helpService = this.getServices().help;
		const refservice = this.getServices().refresh;
		//const settingsisActive = !this.state.appStateData.settingsActive;
		//const newProjectActive = this.state.appStateData.newProjectActive;


		//const notifyMsg = this.state.notifyQueue.dequeueProxy();
		//const notifyMsgRender = notifyMsg !== null ? notifyMsg.getElement() : <></>;

		const zoomValue = zoomState.getZoomValue();
		updateables.set(100, [`${zoomValue}%`, rottContainer]);

		//updateables.set(400, this.getCurrentArch().identifier);
		//updateables.set(500, this.getCurrentExe().name);

		//TODO: New Project Element is to be active
		/*
		const newProjectElement = newProjectActive ? 
			<NewProjectForm rootContainer={rottContainer}/> :
		<></>;
		*/
		
		const errorComponent = errorState.hasError() ? 
			<ErrorDisplay errorState={errorState}
				refreshService={refservice} /> :
			
			<></>;

		// Help Componenet
		const helpComponent = helpService.isActive() ?
  			<HelpContainer 
    				toggleOff={() => helpService.handleEscKey}
    				helpData={helpService.getHelpData()}
  			/> :
  		<></>;

		return (
			<div className={styles.rottnest}>
				<SettingsForm rootContainer={rottContainer}
						isHidden={settingsisActive} 
						projectDetails={this.state.projectDetails}
				/>

				{newProjectElement}
				{errorComponent}
				{helpComponent}
				
				<NotifyMessageSpace queue={notifyService.getNotifyQueue()} />
				<GlobalBar componentMap={updateables} container={rottContainer} />
		
				<WorkspaceContainer container={rottContainer} />
			</div>
		)
	}
}
	
