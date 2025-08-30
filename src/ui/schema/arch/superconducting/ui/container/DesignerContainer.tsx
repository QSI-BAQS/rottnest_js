import React from "react";

import { ArchWorkspaceGroup, ArchWorkspaceProps} 
	from "../../../ArchWorkspace.ts";
import {ArchStashMapTrigger, ArchStashMap} from "../../../ArchWorkspace.ts";
import styles from '../styles/WorkspaceContainer.module.css';
import { SuperconductingDesignUIGroup } from "../../groups/DesignGroup.tsx";
import { CallGraphGroup } from "../../groups/CallGraphGroup.tsx";
import { VisualiserGroup } from "../../groups/VisualiserGroup.tsx";
import { RunChartGroup } from "../../groups/RunChartGroup.tsx";


type WorkspaceContainerState = {
	bufferMap: ArchStashMap
}

type WorkspaceGroupData = {
	[key: string]: ArchWorkspaceGroup
}

/**
 * Workspace Container holds the main
 * workspace components, including tools, regions and design space
 */
class WorkspaceContainer 
	extends React.Component<ArchWorkspaceProps, 
		WorkspaceContainerState> 
	implements ArchStashMapTrigger
	{
	
	state: WorkspaceContainerState = {
		bufferMap: new ArchStashMap(this)
	}

	workspaceGroups: WorkspaceGroupData = {
		"Designer": new SuperconductingDesignUIGroup(),
		"CallGraph": new CallGraphGroup(),
		"Visualiser": new VisualiserGroup(),
		"Chart": new RunChartGroup(),
	}
	
	refresh() {
		const nState = {...this.state};
		this.setState(nState);
	}


	render() {
		const data = this.props;
		const context = data.workspaceData.archcontext.getCurrent();
		// const ctxObj = data.workspaceData.archcontext.move(context, {});
		const group = this.workspaceGroups[context];
		
		const wdata : ArchWorkspaceProps = { 
			workspaceData: data.workspaceData
		};

		const comps = group.makeGroup(wdata);

		return (
			<div className={styles.workspaceContainer}>
				{comps}
			</div>
		)
	}
}

export default WorkspaceContainer;
