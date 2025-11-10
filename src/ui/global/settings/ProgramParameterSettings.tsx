import React, { ChangeEvent, MouseEvent } from "react"
import { ProgramParam } from "../../../obj/plugin/Program"
import { Services } from "../../../service/Services";
import style from '../../styles/PluginSettingsForm.module.css';
import paramStyle from '../../styles/ProgramParameterSettings.module.css';
import { MessageType } from "../../../net/Protocol";
/**
 * Displays and allows the data to be edited
 */
export type NumericParamterData = {
  name: string
  kind: string
  value: number
  isFloat: boolean
  updateFn: (n: number) => void;
  hasChanged: boolean
}

/**
 * Class component for a parameter container
 * will need to expand for string and others
 */
export class NumericParameterContainer
  extends React.Component<NumericParamterData, {}> {


  render() {


    const isFloat = this.props.isFloat;
    const name = this.props.name;
    const kind = this.props.kind;
    const value = this.props.value;
    const updateFn = this.props.updateFn;
    const convertFn = isFloat ? Number.parseFloat : Number.parseInt;
    const hasChanged = this.props.hasChanged;
    
    const inputUpdateFn = (e: ChangeEvent<HTMLInputElement>) => {
      
      const newValue = convertFn(e.target.value);
      updateFn(newValue);
    }

    return (
      <div key={`param_${name}`} className={paramStyle.numericContainer}
          style={{backgroundColor: hasChanged ? '#ff000066' : '#00000000',
            borderRadius: '5px'}}>
        <label htmlFor={name}>{`${name} - ${kind}`}</label>
        <input onChange={inputUpdateFn} name={name} type="text" value={value}></input>
      </div>
    )
    
  }
}


/**
 * Services and params are passed, params are the parameters for
 * the container, services are focused on updating
 */
export type ProgramParameterData = {
  services: Services,
  params: Array<ProgramParam>
}

/**
 * ProgramParameterState, holds a map
 */
export type ProgramParameterState = {
  oldState: Map<string, ProgramParam>
  params: Map<string, ProgramParam>
}

/**
 * Program parameterisation container
 * Will break it down into what parameters it can set
 */
export class ProgramParametersContainer extends React.Component<ProgramParameterData, ProgramParameterState> {

  generateParamMap() {
    return (() => {
        const map: Map<string, ProgramParam> = new Map();
        this.props.params.forEach(e => {
          map.set(e[0], [...e]);
        })
        return map; 
      })()
  }

  state: ProgramParameterState = {
    oldState: this.generateParamMap(),
    params: this.generateParamMap()
  }

  updateState() {
    const nstate = {...this.state};
    this.setState(nstate);
  }

  render() {

    const self = this;
    const services = this.props.services;

    const validateChanges = (): [Map<string, boolean>, boolean] => {
      const params = new Array(...self.state.params.entries());
      const oldParams = self.state.oldState;
      const valMap = new Map();
      let notSame = false;
      for(let i = 0; i < params.length; i++) {
        const pEntry = params[i];

        const [ pKey, pValue ] = pEntry;
        const oValue = oldParams.get(pKey);
        notSame = notSame || (oValue ? oValue[2] !== pValue[2] : true);
        valMap.set(pKey, oValue ? oValue[2] !== pValue[2] : true)
      }

      return [valMap, notSame];
    }

    const [valMap, notSame] = validateChanges();
    console.log(notSame);
    const renderedContainers = new Array(...this.state
      .params.entries().map(entry => {
        const [k, e] = entry;

        const updateFn = (n: number) => {
          const ent = self.state.params.get(k);
          if(ent) {
            ent[2] = n;
            self.state.params.set(k, ent);
            const nstate = {...self.state};
            self.setState(nstate);
          }
        }
        
        return <NumericParameterContainer
          key={`numparam_${e[0]}`} name={e[0]} kind={e[1]}
          hasChanged={valMap.get(e[0])!}
          value={Number(e[2])}
          isFloat={e[1] === 'float'}
          updateFn={updateFn}
          />
      }));


    const argsUpdate = (_: MouseEvent<HTMLButtonElement>) => {
      const notifyserv = services.getNotifyService();
      const refserv = services.getRefreshService();
      const paramsGroup = self.state.params.entries().map(kv => {
            const [_, v] = kv;
            return v;
          })
      services.getNetworkService()
        .getNetworkService().sendObj(MessageType.Executable.SetConfig,
          paramsGroup);
      self.state.oldState = this.state.params;
      notifyserv.makeMessageWithId('param-set-notify', "Program Parameters",
        "Program parameters have been set");

      refserv.triggerRefresh();
    }

    return (
      <>
      <div className={paramStyle.paramContainer}>
        {renderedContainers}
        {notSame ? <div style={{textAlign: "center",
          color: '#ff0000ff', paddingTop: '0.5em'}}>Changes are not saved</div> : <></>}
      </div>
      <div style={{display: 'flex'}}>
      <button className={style.pluginApply}
        onClick={argsUpdate}>Save</button>
      <div className={style.pluginSep}></div>
      </div>
      </>
    )
  }
}
