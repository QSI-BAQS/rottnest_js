import { RefreshService } from "../../../../service/RefreshService";
import { ZoomService } from "../../../../service/ZoomService";


/**
 * Is the state of the zoom over the entire application
 * It will also outline the state of zoom and if it is able to be
 * changed or not.
 */
export class ZoomState {

  zoomValue: number = 100;
  enabled: boolean = true;
  refservice: RefreshService;
  zoomService:ZoomService;

  constructor(initialValue: number, refservice: RefreshService,
    zoomService: ZoomService) {
    this.zoomValue = initialValue;
    this.refservice = refservice;
    this.zoomService = zoomService;
  }

  /**
   * Gets the zoom value
   */
  getZoomValue(): number {
    return this.zoomValue
  }

  /**
   * Will enable the zoom functionality
   */
  enableZoom() {
    this.enabled = true;
  }


  /**
   * Will disable the zoom functionality
   */
  disableZoom() {
    this.enabled = false;
  }

  /**
   * Will check to see if the zoom functionality is disabled
   */
  isDisabled() {
    return !this.enabled;
  }

  /**
   * Will check to see if the zoom functionality is enabled
   */
  isEnabled() {
    return this.enabled;
  }

  
	/**
	 * Modifies the zoomIn and zoomOut
	 */
	zoomIn(perc: number) {
		if((this.zoomValue + perc) <= 400) {
			this.zoomValue += perc;
			this.zoomService.updateZoomValue(this.zoomValue);
			this.refservice.triggerRefresh();
		}
	}

	/**
	 * Modifies the zoomIn and zoomOut
	 */
	zoomOut(perc: number) {
		if((this.zoomValue - perc) > 0) {
			this.zoomValue -= perc;	
			this.zoomService.updateZoomValue(this.zoomValue);
			this.refservice.triggerRefresh();
		}
	}
  
}
