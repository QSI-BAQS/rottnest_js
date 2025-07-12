import { NotifyQueue } from "../ui/global/notify/NotifyMessage";



/**
 * NotifyService, this acts as a wrapper on the NotifyQueue
 */
export class NotifyService {
  _notifyQueue: NotifyQueue = new NotifyQueue();

  /**
   * Constructs the notify queue, simple wrapper that
   * doesn't require much more than that
   */
  constructor() {
    this._notifyQueue = new NotifyQueue();
  }

  /**
   * Gets the notify queue
   */
  getNotifyQueue() {
    return this._notifyQueue;
  }
}
