
//
// This is a test class just to show that the visualiser is able to work and fix things
// as they come rather than supplying a full implementation

import React from "react";
import { ArchWorkspace, ArchWorkspaceData } from "../sigs/ArchWorkspace";
import { AVDesignObject, AVDesignProps } from "./ActiveVolumeDesignObject";

export type AVDesignSpaceProps = {
	workspaceData: ArchWorkspaceData
}

// 
export class AVDesignSpace extends React.Component<AVDesignSpaceProps,
	{}> implements ArchWorkspace {


	getProjectData(): AVDesignProps {
		
		let obj = this.props.workspaceData
			.architecture.getProject().body
		const retobj = {
				nregisters: obj.object.registers,
				nancilla: obj.object.ancilla,
				nfactories: obj.object.factories
		}
		return retobj;
	}

	render() {
		const importedData = this.getProjectData();
		const frame = <AVDesignObject {...importedData} />

		return (
			<>
				{frame}
			</>
		)
	}


}

