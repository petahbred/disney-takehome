const domParser = new DOMParser();

/**
 * Accepts a string that represents an element eg. `<div></div>` and returns a HTMLElement type.
 * @param stringElement 
 * @returns HTMLElement corresponding to the parsed element.
 */
export function getElementFromString(stringElement: string): HTMLElement {
  const doc = domParser.parseFromString(stringElement, 'text/html');
  return doc.body.firstElementChild as HTMLElement;
}
