import { RefreshService } from "./RefreshService";


/**
 * StyleService, it will load the style data from where
 * it can and then append it to the root document
 */
export class StyleService {

  root: HTMLElement;
  refreshService: RefreshService;

  static service: StyleService | null = null;

  /**
   * Consturctor that will refresh the page but also allow for
   * embedding styles into the document.
   */
  constructor(refreshService:RefreshService) {
    
    let root = document.getElementById('root');
    this.root = root!; //Ensure we get it
    this.refreshService = refreshService;
  }

  /**
   * Singleton Instance for style service, it will be the only
   * place for loading styles
   */
  static GetInstance(refreshService: RefreshService) {
    if(StyleService.service === null) {
      StyleService.service = new StyleService(refreshService);
    }
    return StyleService.service;
  }

  /**
   * Creates a style link based on the format given and where it is loading it from
   */
  createStyleLink(url: string) {
    let linkref = document.createElement('link')
    linkref.href = url;
    linkref.rel = "stylesheet";
    linkref.type = 'text/css';
    return linkref;
  }

  createInlineStyle(data: string) {
    
    let styleref = document.createElement('style')
    styleref.innerText = data;
    return styleref;
  }

  appendToRootInline(data: string) {

    let styleref = this.createInlineStyle(data);
    this.root.appendChild(styleref);
  }

  /**
   * Will append the style url to the root
   * this should be auto-resolved and not require the refresh ervice
   */
  appendToRoot(url: string) {
    let linkref = this.createStyleLink(url);
    this.root.appendChild(linkref);
  }

  
  
}
