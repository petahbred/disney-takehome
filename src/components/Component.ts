import { getElementFromString } from '../utils';

/**
 * Interface to enforce instance methods
 */
export interface ComponentImpl {
  mounted(): void;
  render(): string;
}

/**
 * Component class to facilitate separation of concerns and modularity.
 */
export class Component implements ComponentImpl {
  /**
   * Component's name
   */
  name: string;
  /**
   *  parent in which the component is rendered in
   */
  parent: HTMLElement;

  /**
   * Component root element
   */
  element: HTMLElement = null;

  /**
   *
   * @param parent Parent Element to which the Component's element will be injected into.
   * @param name Name of the component
   */
  constructor(parent: HTMLElement, name = 'MyComponent') {
    this.parent = parent;
    this.element = getElementFromString(this.render());
    this.parent.appendChild(this.element);
    requestAnimationFrame(() => {
      this.mounted();
    });
  }

  /**
   * A pseudo lifecycle function to be called after the component's HTML string is added to the DOM. Note, it will not be rendered when this is called.
   */
  mounted(): void {}

  /**
   * Render function to be called with initialization of the class instance.
   * The core static HTML of the component should be defined here.
   * @returns string representation of HTML
   */
  render(): string {
    return '';
  }
}

export default Component;
