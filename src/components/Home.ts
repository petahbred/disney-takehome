import { isElementInView } from '../utils';
import Component from './Component';
import ItemComponent from './Item';
import Shelf from './Shelf';

/**
 * Home Component and main container for the application.
 */
export default class Home extends Component {
  // Keep reference of each shelf
  shelves: Shelf[] = [];

  /**
   * row and col - references to which item to select when using keyboard navigation
   */
  row = -1;
  col = -1;

  selectedItem?: ItemComponent = null;

  /**
   * Fetches data from the server to populate the homepage.
   * @returns Empty Promise
   */
  getData(): Promise<void> {
    return fetch('https://cd-static.bamgrid.com/dp-117731241344/home.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching data.');
        }

        return response.json();
      })
      .then(({ data }: any) => {
        const main = document.getElementById('main');
        const { containers } = data?.StandardCollection;

        // populate the shelves
        containers.forEach((container: any) => {
          const shelf = new Shelf(main, container);
          this.shelves.push(shelf);
        });

        // Call registration of remote navigation after tiles are loaded in the DOM.
        this.registerRemoteNavigation();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Updates the active state of the media-item element to show to the user which one is in focus.
   */
  updateSelection() {
    // clear all active classes from the media tiles
    document
      .querySelectorAll('.media-item.active')
      .forEach((mediaItem: HTMLElement) =>
        mediaItem.classList.remove('active')
      );

    try {
      if (this.col === -1 || this.row === -1) {
        throw new Error('selection out of bounds');
      }
      // add active class to element being selected to style differently
      const itemCompoment = this.shelves[this.row].itemComponents[this.col];
      itemCompoment.element.classList.add('active');
      this.selectedItem = itemCompoment;

      // check if element is in view, if not, scroll to it.
      if (!isElementInView(itemCompoment.element)) {
        itemCompoment.element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
        // selecting the very first item should make sure the scroll x position is 0
        if (this.col === 0) {
          this.shelves[this.row].element.scrollTo({
            behavior: 'smooth',
            left: 0,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Traps ArrowUp, ArrowDown, ArrowLeft, and ArrowRight keydown events to perform tile
   * navigation. ArrowUp and ArrowDown traverses each shelf, whilst ArrowLeft and
   * ArrowRight traverses each item within the shelf. UpdateSelection is then called to
   * update the active styling of the selected item
   * @param event KeyboardEvent
   */
  handleKeydown(event: KeyboardEvent) {
    const keyPresses = [
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'Enter',
      'Escape',
    ];
    if (keyPresses.includes(event.key)) {
      // initial base case to start keyboard navigation
      if (this.col === -1 && this.row === -1) {
        this.col = 0;
        this.row = 0;
      } else {
        if (event.key === 'ArrowUp' && this.row > 0) {
          this.row--;
        } else if (
          event.key === 'ArrowDown' &&
          this.row < this.shelves.length - 1
        ) {
          this.row++;
        } else if (event.key === 'ArrowLeft') {
          this.col--;
          if (this.col < 0) {
            this.col = this.shelves[this.row].itemComponents.length - 1;
          }
        } else if (event.key === 'ArrowRight') {
          this.col++;

          if (this.col > this.shelves[this.row].itemComponents.length - 1) {
            this.col = 0;
          }
        }
      }

      if (event.key === 'Enter') {
        console.log('selected', this.selectedItem);
      }

      event.preventDefault();
      this.updateSelection();
    }
  }

  // register the keydown event handler for keyboard tile navigation
  registerRemoteNavigation() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  /**
   * after initial render, fetch data from the server.
   */
  mounted() {
    this.getData();
  }

  render(): string {
    return `
      <main id='main'>
      </main>
    `;
  }
}
