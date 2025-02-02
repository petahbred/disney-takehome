const domParser = new DOMParser();

/**
 * Accepts a string that represents an element eg. `<div></div>` and returns a HTMLElement type.
 * @param stringElement - string representation of element
 * @returns HTMLElement corresponding to the parsed element.
 */
export function getElementFromString(stringElement: string): HTMLElement {
  const doc = domParser.parseFromString(stringElement, 'text/html');
  return doc.body.firstElementChild as HTMLElement;
}

/**
 * Checks if the element is within the viewport.
 * @param element HTMLElement to check if in view
 * @returns boolean
 */
export function isElementInView(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}
