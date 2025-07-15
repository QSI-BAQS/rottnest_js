import React from 'react';
import GlobalBar from '../global/GlobalBar.tsx';

import SettingsForm from './SettingsForm';
import NewProjectForm from './NewProjectForm';
import ErrorDisplay from './ErrorDisplay.tsx';
import HelpWorker from '../help/HelpWorker.tsx';
import { HelpContainer } from './HelpContainer.tsx';
import { NotifyMessageSpace } from '../global/notify/NotifyMessage.tsx';
import { UpdateTrigger } from '../../service/RefreshService.ts';
import { RottnestProperties, RottnestState } from '../schema/global/ApplicationState.ts';
import styles from '../styles/RottnestContainer.module.css';



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
	 *
	 */
	render() {
		const rottContainer = this;
		const updateables = new Map();
		const zoomValue = this.state.appStateData.zoomValue;
		const settingsisActive = !this.state.appStateData.settingsActive;
		const newProjectActive = this.state.appStateData.newProjectActive;


		//const notifyMsg = this.state.notifyQueue.dequeueProxy();
		//const notifyMsgRender = notifyMsg !== null ? notifyMsg.getElement() : <></>;

		updateables.set(100, [`${zoomValue}%`, 
			rottContainer]);
		updateables.set(400, this.getCurrentArch().identifier);
		updateables.set(500, this.getCurrentExe().name);

		const newProjectElement = newProjectActive ? 
			<NewProjectForm rootContainer={rottContainer}/> :
		<></>;

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
				<SettingsForm rootContainer={rottContainer}
						isHidden={settingsisActive} 
						projectDetails={this.state.projectDetails}
				/>

				{newProjectElement}
				{errorComponent}
				{helpComponent}
				
				<NotifyMessageSpace queue={this.state.notifyQueue} />
				<GlobalBar componentMap={updateables} container={rottContainer} />
		
				<WorkspaceContainer container={rottContainer} />
			</div>
		)
	}
}
	
