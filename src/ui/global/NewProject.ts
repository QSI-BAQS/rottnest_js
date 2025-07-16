import RottnestApplication from "../container/RottnestApplication"

/**
 * Shows the settings menu for a project with new project properties
 */
const leftClick = (rott: RottnestApplication) => {
	const projectRet = rott.getModuleStates().getProjectState();
	if(projectRet.isReady) {
		const projectState = projectRet.obj;
		if(projectState) {
			projectState.showNewProject();
		}
	}
}

const auxEvent = (_: RottnestApplication) => { }

export default { leftClick, auxEvent }
