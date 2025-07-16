import RottnestApplication from "../container/RottnestApplication"


const leftClick = (rott: RottnestApplication) => {
	rott.zoomOut(25);
}

const auxEvent = (_: RottnestApplication) => { }


export default { leftClick, auxEvent }
