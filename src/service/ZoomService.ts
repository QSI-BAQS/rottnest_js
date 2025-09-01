

/**
 * Zoom Service so it can be exposed and retrieve the information related
 * to the zoom state
 * This is simply a copy service when zoom state gets updated
 */
export class ZoomService {

  zoomValue: number;

  /**
   * Constructs the zoom service
   */
  constructor(zoomValue: number = 100) {
    this.zoomValue = zoomValue;
  }

  /**
   * Updates the zoom value given
   */
  updateZoomValue(value: number) {
    this.zoomValue = value;
  }

  /**
   * Simple getter that will retrievable
   */
  getZoomValue(): number {
    return this.zoomValue;
  }
  
}
