import RottnestApplication from "../container/RottnestApplication"


const leftClick = (rott: RottnestApplication) => {
	rott.showNewProject();
}

const auxEvent = (_: RottnestApplication) => { }

export default { leftClick, auxEvent }
