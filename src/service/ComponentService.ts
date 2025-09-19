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
import { useEffect, useRef, useState } from 'react';
import { ArchWorkspaceZone } from '../ui/workspace/WorkspaceZone';
import { ReactComponentExports } from 'rottnest-plugin/schema/ServicesHolder';

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
    useRef, useState, useEffect, ArchWorkspaceZone: AWZ
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
  
}
