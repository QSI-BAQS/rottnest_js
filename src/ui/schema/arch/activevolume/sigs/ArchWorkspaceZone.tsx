import React from "react";
import { ArchWorkspace, ArchWorkspaceZoneData } from "./ArchWorkspace";
import styles from './styles/WorkspaceContainer.module.css';
import { ArchitectureUIContext } from "./ArchContext";
import { ArchitectureObject } from "./ArchSchema";


/**
 * Tab data, the different tabs
 * and the context, along with the architecture object
 */
type WorkspaceTabData = {
	selectedTab: string
	tabTitles: Array<string>
	availableTabs: Array<boolean>
	context: ArchitectureUIContext
	container: ArchitectureObject
}
/**
 * Workspace Tab Bar, it will list the tabs
 * that it can present
 */
class WorkspaceTabBar extends React
	.Component<WorkspaceTabData, {}> {
	
	render() {
		const data = this.props;
		const context = data.context;
		const selTab = data.selectedTab;
		
		const avaibilities = data.availableTabs;
		const tabs = data.tabTitles.map((t, idx) => {

			const isSelected = t.toLowerCase() === selTab;
			const ctxdata = context.getData();
			const available = avaibilities[idx];
			const ctxkey = data.container.getModulesMeta()
				.getMetaKey(idx) || 'default';
			const refservice = this.props.container
				.getServices()
				.getRefreshService();
			const updateSelected = () => {
				if(available) {
					context.move(ctxkey, ctxdata);
					refservice.triggerRefresh();					
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


export class ArchWorkspaceZone 
	extends React.Component<ArchWorkspaceZoneData, {}> 
	implements ArchWorkspace {

	render() {

		const data = this.props.workspaceData;
		const selKey = data.archcontext.getCurrent();
		const moduleMeta = data.architecture.getModulesMeta();
		const component = this.props.wsComponent;
		
		const availableTabs = moduleMeta.availability;
		
		return (<div className={styles.workspaceZone}>
				<WorkspaceTabBar 
				tabTitles={moduleMeta.modules}
				container={data.architecture}
				context={data.archcontext}
				selectedTab={selKey} 
				availableTabs={availableTabs}
				/>
				{component}
			</div>);
			
	}
}

