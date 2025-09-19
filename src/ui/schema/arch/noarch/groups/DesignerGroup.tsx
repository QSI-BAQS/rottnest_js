import { NoArchSpace } from "../ui/NoArchSpace.tsx";
import { NoArchColumn } from "../ui/NoArchColumn.tsx";
import { ReactElement } from "react";
import { ArchWorkspaceZone }
  from "../../../../workspace/WorkspaceZone.tsx";
import { ArchWorkspaceGroup, ArchWorkspaceProps } from "rottnest-plugin/schema/ArchWorkspace";

/**
 * Constructs the workspace group that will be used by the workspace component
 * within rottnest
 */
export class NoArchDesignGroup implements ArchWorkspaceGroup {

	/**
	* Constructs an architecture design group
	*/
	makeGroup(data: ArchWorkspaceProps): Array<ReactElement> {

		const desSpace = <NoArchSpace {...data} />;

		const group = [
			<NoArchColumn key={"noarch_column_1"} 
				{...data} disptext={"Not Selected"}/>,
			<ArchWorkspaceZone
				key={"arch_wz_design_space"}
				wsComponent={desSpace}
				workspaceData={{
					architecture: data.workspaceData.architecture,
					archcontext: data.workspaceData.archcontext,
					stash: data.workspaceData.stash
				}} />,
			<NoArchColumn
				key={"noarch_column_2"}
				{...data} disptext="" />,
		];	

		return group;
	}

}
