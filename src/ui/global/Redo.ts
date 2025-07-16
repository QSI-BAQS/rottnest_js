import RottnestApplication from "../container/RottnestApplication"


const leftClick = (rott: RottnestApplication) => {
	rott.redoRegion();
}

const auxEvent = (_: RottnestApplication) => {}


export default { leftClick, auxEvent }
