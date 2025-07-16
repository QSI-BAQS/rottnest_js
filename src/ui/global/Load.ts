import RottnestApplication from "../container/RottnestApplication"


const leftClick = (_: RottnestApplication) => { }

const auxEvent = (_: RottnestApplication) => { }


export default { leftClick, auxEvent }

export const hiddenInputProc = (e: any, rott: RottnestApplication) => {
	const reader = new FileReader();
	let toLoad = e.target.files.item(0);
	
	reader.addEventListener('load', () => 
		{ rott.parseLoadedFile(reader.result); }, false);
	
	if(toLoad) {
		reader.readAsText(toLoad);
	}


}
