import AppServiceModule from "../../net/AppServiceModule"
import RottnestApplication from "../container/RottnestApplication"

const leftClick = (_: RottnestApplication) => { 
	const appService = AppServiceModule.GetAppServiceInstance();
	appService.reconnect();
}

const auxEvent = (_: RottnestApplication) => { }


export default { leftClick, auxEvent }
