import RottnestApplication from "../container/RottnestApplication"


const leftClick = (rott: RottnestApplication) => {
	const aobj = rott.getAppState().getArchitectureObject();
	if(aobj) {
		aobj.getDesigner().getActionTracker().performUndo();
	}
}

const auxEvent = (_: RottnestApplication) => { }


export default { leftClick, auxEvent }
