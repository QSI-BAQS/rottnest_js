import RottnestApplication from "../container/RottnestApplication"


const leftClick = (rott: RottnestApplication) => {
	rott.showSettings();
}

const auxEvent = (_: RottnestApplication) => { }

export default { leftClick, auxEvent }
