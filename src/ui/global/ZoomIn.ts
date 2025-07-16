import RottnestApplication from "../container/RottnestApplication"


const leftClick = (rott: RottnestApplication) => {
	const zoomState = rott.getModuleStates().getZoomState();
	zoomState.zoomIn(25);
}

const auxEvent = (_: RottnestApplication) => { }


export default { leftClick, auxEvent }
