import {
	CloseOutlined,
	EyeOutlined,
	EyeInvisibleOutlined,
	RollbackOutlined,
	CloseSquareFilled,
	CloseSquareOutlined, 
	SelectOutlined,
	ArrowLeftOutlined,
	ArrowUpOutlined,
	ArrowDownOutlined,
	ArrowRightOutlined
} from '@ant-design/icons'
import { useEffect, useRef, useState, useMemo,
  useCallback, useContext, useId, useTransition
} from 'react';
import { ArchWorkspaceZone } from '../ui/workspace/WorkspaceZone';
import { RunChartContainer } from '../ui/runchart/RunChart';
import { RunChartNodeColumn } from '../ui/runchart/RunChartColumn';
import { ReactComponentExports } from 'rottnest-plugin/schema/ServicesHolder';
import { MessageType } from '../net/Protocol';
import { CallGraphSpace } from '../ui/callgraph/CallGraphSpace';
import { CGGraphColumn, CGNodeColumn } from '../ui/callgraph/CallGraphColumn';

const AWZ = ArchWorkspaceZone as any;

/**
 * IconService to expose certain assets over
 * to the plugins themselves
 */
export class ComponentService {

  icons = {
    CloseOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
  	RollbackOutlined,
  	ArrowUpOutlined,
  	ArrowDownOutlined,
  	ArrowLeftOutlined,
  	ArrowRightOutlined,
  	CloseSquareFilled,
  	CloseSquareOutlined, 
  	SelectOutlined
  }

  reactRefs: ReactComponentExports = {
    useRef, useState, useEffect, useMemo, useCallback,
    useId, useContext, useTransition,
    ArchWorkspaceZone: AWZ,
    RunChartContainer: RunChartContainer,
    CallGraphSpace: CallGraphSpace,
    CGGraphColumn: CGGraphColumn,
    CGNodeColumn: CGNodeColumn,
    RunChartNodeColumn: RunChartNodeColumn
  }

  static instance: ComponentService | null = null;

  static GetInstance() {
    if(this.instance === null) {
      this.instance = new ComponentService();
    }
    return this.instance;
  }

  /**
   * Returns the react components
   */
  getReactExports(): ReactComponentExports {
    return this.reactRefs
  }

  /**
   * Simply is a storage service for ant-design icons
   */
  getIcons() {
    return this.icons;
  }

  /**
   * MessageTypes type that is exported
   */
  getMessageTypes() {
    return MessageType;
  }
}
