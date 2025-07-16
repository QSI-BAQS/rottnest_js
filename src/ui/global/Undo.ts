import RottnestApplication from "../container/RottnestApplication"


const leftClick = (rott: RottnestApplication) => {
	rott.undoRegion()
}

const auxEvent = (_: RottnestApplication) => { }


export default { leftClick, auxEvent }
