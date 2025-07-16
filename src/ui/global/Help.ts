import RottnestApplication from "../container/RottnestApplication";

/**
 * HelpEvent that will
 * hold the event functions that are needed when a user presses click
 */
const HelpEvent = {
	leftClick: (container: RottnestApplication) => {
  		container.getServices().help.toggleHelp();
	},
  	
	auxEvent: (_: RottnestApplication) => {
  		// No-op
	}
}

export default HelpEvent;
