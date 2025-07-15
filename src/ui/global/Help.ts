import RottnestApplication from "../container/RottnestApplication";

const HelpEvent = {
  	leftClick: (container: RottnestApplication) => {
    		container.toggleHelp();
  	},
  	
	auxEvent: (_: RottnestApplication) => {
    		// No-op
  	}
}

export default HelpEvent;
