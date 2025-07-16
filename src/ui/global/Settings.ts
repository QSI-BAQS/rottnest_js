import RottnestApplication from "../container/RottnestApplication"

/**
 * Will show the settings of the current project
 */
const leftClick = (rott: RottnestApplication) => {
	const projectRet = rott.getModuleStates().getProjectState();
	if(projectRet.isReady) {
		const projectState = projectRet.obj;
		if(projectState) {
			projectState.showSettings();
		}
	}
}

const auxEvent = (_: RottnestApplication) => { }

export default { leftClick, auxEvent }
