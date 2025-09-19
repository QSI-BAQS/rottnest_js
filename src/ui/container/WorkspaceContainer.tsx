import React from "react";
import {
	ArchContainerProps,
	ArchStashMap,
	ArchStashMapTrigger,
	ArchWorkspaceProps }
from "rottnest-plugin/schema/ArchWorkspace";

import styles from '../styles/WorkspaceContainer.module.css';


/**
 * Workspace container, holds onto the stash map
 */
export type ArchWorkspaceContainerState = {
	stash: ArchStashMap
}

/**
 * Workspace Container holds the main
 * workspace components, including tools, regions and design space
 */
export class ArchWorkspaceContainer 
	extends React.Component<ArchContainerProps, ArchWorkspaceContainerState> 
	implements ArchStashMapTrigger
	{
	
	state: ArchWorkspaceContainerState = {
		stash: new ArchStashMap(this)
	}

	/**
	 * Refreshes the workspace container
	 */
	refresh() {
		const nState = {...this.state};
		this.setState(nState);
	}

	/**
	 * Selects the grouping, sets up the data
	 * and then renders it
	 */
	render() {
		const data = this.props;
		const architecture = data.architecture;
		const archcontext = data.archcontext;
		const archstash = this.state.stash;
		const archgroups = archcontext.getSwitches();
		const archkey = archcontext.getCurrent();
		const archcomp = archgroups[archkey];

		if(archcomp !== null) {
			
			const archsub = archcomp(architecture, {});
			const wgroup = archsub.makeWorkspaceGroup();
			
			const wdata : ArchWorkspaceProps = { 
				workspaceData: {
					architecture: architecture,
					archcontext: archcontext,
					stash: archstash
				}
			};

			const comps = wgroup.makeGroup(wdata).map((e) => {
				return e;
			});
			return (
				<div className={styles.workspaceContainer}>
					{comps}
				</div>
			)
		} else {
			return <></>
		}
	}
}

