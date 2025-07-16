import RottnestApplication from "../container/RottnestApplication"


const leftClick = (rott: RottnestApplication) => {
	const aobj = rott.getAppState().getArchitectureObject();
	if(aobj) {
		aobj.getDesigner().getActionTracker().performRedo();
	}
}

const auxEvent = (_: RottnestApplication) => {}


export default { leftClick, auxEvent }
