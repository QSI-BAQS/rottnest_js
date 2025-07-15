import { RefreshService } from "../../../../service/RefreshService";


/**
 * Is the state of the zoom over the entire application
 * It will also outline the state of zoom and if it is able to be
 * changed or not.
 */
export class ZoomeState {

  zoomValue: number = 100;
  enabled: boolean = true;
  refservice: RefreshService;

  constructor(initialValue: number, refservice: RefreshService) {
    this.zoomValue = initialValue;
    this.refservice = refservice;
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
			this.refservice.triggerRefresh();
		}
	}

	/**
	 * Modifies the zoomIn and zoomOut
	 */
	zoomOut(perc: number) {
		if((this.zoomValue - perc) > 0) {
			this.zoomValue -= perc;	
			this.refservice.triggerRefresh();
		}
	}
  
}
