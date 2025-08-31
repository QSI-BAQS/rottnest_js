import {ReactElement} from "react";

import { ArchWorkspaceGroup, ArchWorkspaceProps } from "../../ArchWorkspace";
import { NoArchColumn } from "../ui/NoArchColumn.tsx";
import { NoArchSpace } from "../ui/NoArchSpace.tsx";
import { ArchWorkspaceZone }
  from "../../../../workspace/WorkspaceZone.tsx";

/**
 * Constructs a Visualiser UI group that can be used
 */	
export class ActiveVolumeVisualiserGroup implements ArchWorkspaceGroup {
	
	makeGroup(data: ArchWorkspaceProps): Array<ReactElement> {

		const desSpace = <NoArchSpace {...data} />;
		const group = [
			<NoArchColumn key={"noarch_column_1"} 
				{...data} disptext={"Not Selected"}/>,
			<ArchWorkspaceZone
				key={"widget_wz_design_space"}
				wsComponent={desSpace}
				workspaceData={{
					architecture: data.workspaceData.architecture,
					archcontext: data.workspaceData.archcontext,
					stash: data.workspaceData.stash
				}}
				/>,
			<NoArchColumn
				key={"noarch_column_2"}
				{...data} disptext="" />,
		];	
		return group;
	}

}
