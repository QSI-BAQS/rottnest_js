import { NotifyQueue, NotifyMessage } from "../ui/global/notify/NotifyMessage";



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

  /**
   * Enqueues a message to be consumed and utilised
   * by other components
   */
  makeNotification(msg: NotifyMessage) {
  	this._notifyQueue.enqueueMessage(msg);
  }
}
