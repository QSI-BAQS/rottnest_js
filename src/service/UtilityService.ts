import { NotifyTuple } from "./NotifyService";
import { Services } from "./Services";



/**
  * UtilityService
  * Class that is constructed to simplify a number of operations
  * where one can throw reuse logic rather than expanding out excessively.
  */
export class UtilityService {

  services: Services;

  constructor(services: Services) {
    this.services = services;
  }

  isConnected() {
    const netService = this.services.getNetworkService();
    return netService.isConnected();
  }

  notifyUI(notifyBlock: NotifyTuple) {
    const refreshService = this.services.getRefreshService();
    const notifyService = this.services.getNotifyService();
    const { ID, title, message } = notifyBlock;
    notifyService.makeMessageWithId(ID, title, message);
    refreshService.triggerRefresh();
  }
  
}
