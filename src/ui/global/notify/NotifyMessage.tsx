
import { MouseEvent, Component } from "react";
import styles from '../../styles/NotifyView.module.css';
import { CloseOutlined } from "@ant-design/icons";

export type NotifyMessage = {
  header: string
  body: string
}

export class NotifyQueue {

  messageQueue: Array<NotifyMessage> = []

  enqueueMessage(msg: NotifyMessage) {
    this.messageQueue.push(msg);
  }

  dequeueMessage(): NotifyMessage | null {
    const msg = this.messageQueue.shift();
    if(msg) {
      return msg;
    } else {
      return null;
    }
  }

  dequeueProxy() {
    const queue = this;
    const m = this.dequeueMessage();
    if(m === null) { return null }
    else {
      return new NotifyMessageViewProxy(queue, m);
    }
  }

  isEmpty() {
    return this.messageQueue.length === 0;
  }

}

export type NotifySpaceData = {
  activeView: NotifyMessageViewProxy | null
}

export type NotifyQueueProps = {
  queue: NotifyQueue
}

export class NotifyMessageSpace extends Component<NotifyQueueProps, NotifySpaceData> {

  state:NotifySpaceData = {
    activeView: null
  };

  checkQueueAndPop() {
    
    const av = this.state.activeView;
    const queue = this.props.queue;
    if(av === null) {
      if(!queue.isEmpty()) {
        const nstate = {...this.state};
        const ref = this;
        nstate.activeView = queue.dequeueProxy();
        nstate.activeView?.attachDeactivate(() => {
          const bstate = {...ref.state};
          bstate.activeView = null;
          ref.setState(bstate);
        })
        this.setState(nstate);
        
      }
    }
  }

  componentDidMount(): void {
    this.checkQueueAndPop()
  }

  componentDidUpdate(): void {
    this.checkQueueAndPop()
  }

  
  render() {
    const av = this.state.activeView;
    if(av !== null) {
      const view = av.getElement();
      return (<>{view}</>);
    } else {
      return <></>
    }
  }
}


export class NotifyMessageViewProxy {

  queue: NotifyQueue;
  message: NotifyMessage
  finished: boolean = false;
  finFn: () => void = () => {}

  constructor(queue: NotifyQueue, message: NotifyMessage) {
    this.queue = queue;
    this.message = message;
    this.finished = false;
    this.finFn = () => {};
  }

  setFinished() {
    this.finished;
    this.finFn();
  }

  isFinished() {
    return this.finished;
  }

  attachDeactivate(fn: () => void) {
    this.finFn = fn;
  }

  getElement() {
    const proxy = this;
    const message = this.message;
    const finFn = this.finFn;
    return <NotifyMessageView proxy={proxy} message={message} deactivate={finFn} />
  }
}

export type NotifyViewProps = {
  proxy: NotifyMessageViewProxy
  message: NotifyMessage
  deactivate: () => void
}

export type NotifyViewState = {
  toShow: boolean
}

export class NotifyMessageView extends Component<NotifyViewProps, NotifyViewState> {

  state: NotifyViewState = {
    toShow: true
  }

  render() {
    const proxy = this.props.proxy;
    const hmsg = this.props.message.header;
    const bmsg = this.props.message.body;
    //const toShow = this.state.toShow;
    const deactivate = this.props.deactivate;

    const toClose = (_e: MouseEvent<HTMLButtonElement>) => {
      proxy.setFinished();
      deactivate()
    }    

    return (
      <div className={styles.messageView}>
        <header className={styles.messageViewHeader}>
          {hmsg}
          <button className={styles.messageViewExit} onClick={toClose}><CloseOutlined /></button>
        </header>
        <section className={styles.messageViewBody}>{bmsg}</section>
      </div>)
  }
  
}
