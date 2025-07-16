import React, {ReactElement} from 'react';
import { Workspace } from './Workspace';
import { ArchitectureUIContext } from '../schema/arch/ArchContext';
import { ArchWorkspaceData } from '../schema/arch/ArchWorkspace';
import { ArchitectureObject } from '../schema/arch/ArchSchema';
import styles from '../styles/WorkspaceContainer.module.css';

type WorkspaceTabData = {
	selectedTab: string
	tabTitles: Array<string>
	availableTabs: Array<boolean>
	context: ArchitectureUIContext
	container: ArchitectureObject
}

type WorkspaceZoneData = {
	workspaceData: ArchWorkspaceData,
	wsComponent: ReactElement	
}

class WorkspaceTabBar extends React
	.Component<WorkspaceTabData, {}> {
	
	render() {
		const data = this.props;
		const context = data.context;
		const selTab = data.selectedTab;
		
		const avaibilities = data.availableTabs;

		const tabs = data.tabTitles.map((t, idx) => {

			const isSelected = t == selTab;
			const available = avaibilities[idx];
			const updateSelected = () => {
				if(available) {
					context.updateSelectedTab(idx);
				}
			};

			return (
				<span key={`tab_${t}`}
				onClick={updateSelected}
				className={`${styles.workTab}
					${ isSelected ? 
					styles.selectedTab : '' }
					${ available === false ? 
					styles
					.workTabUnavailable:''}`}>
					{t}
				</span>
			)
		});

		return (
			<div className={styles
				.workspaceTabBar}>
			{tabs}
			</div>
		)
	}
}


export class WorkspaceZone 
	extends React.Component<WorkspaceZoneData, {}> 
	implements Workspace {

	render() {

		const data = this.props.workspaceData;
		const meta = data.context.getTabs();
		const selKey = data.context.getCurrent();
		const moduleMeta = data.architecture.getModulesMeta();
		const component = this.props.wsComponent;

		
		const availableTabs = moduleMeta.availability;
		
		return (<div className={styles.workspaceZone}>
				<WorkspaceTabBar 
				tabTitles={meta.keys}
				container={data.architecture}
				context={data.context}
				selectedTab={selKey} 
				availableTabs={availableTabs}
				/>
				{component}
			</div>);
			
	}
}
