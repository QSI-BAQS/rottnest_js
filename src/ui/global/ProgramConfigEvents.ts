

import RottnestApplication from "../container/RottnestApplication.tsx"

const leftClick = (rott: RottnestApplication) => {
  //To implement
  const plgmod = rott.getModuleStates().getProgramState();
  plgmod.showProgramSettings();
}

const auxEvent = (_: RottnestApplication) => {}

export default { leftClick, auxEvent };
