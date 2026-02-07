import { RottnestApplicationComponentStates } from "../ui/context/global/ApplicationState";


export interface ZoomModuleParent {
  getModuleStates(): RottnestApplicationComponentStates
}

/**
 * Zoom Service so it can be exposed and retrieve the information related
 * to the zoom state
 * This is simply a copy service when zoom state gets updated
 */
export class ZoomService {

  zoomValue: number;
  moduleParent: ZoomModuleParent;

  /**
   * Constructs the zoom service
   */
  constructor(zoomValue: number = 100, moduleParent: ZoomModuleParent) {
    this.zoomValue = zoomValue;
    this.moduleParent = moduleParent;
  }

  /**
   * Updates the zoom value given
   */
  updateZoomValue(value: number) {
    this.zoomValue = value;
    const zstate = this.moduleParent
      .getModuleStates()
      .getZoomState();
    zstate.zoomValue = this.zoomValue;
  }

  /**
   * Simple getter that will retrievable
   */
  getZoomValue(): number {
    return this.zoomValue;
  }
  
}
