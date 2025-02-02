import Component from './Component';
import ItemComponent from './Item';

export class Shelf extends Component {
  title = 'Container';

  /**
   * raw data from the server
   */
  data: any;

  /**
   * raw items data from the server
   */
  items: any[];

  /**
   * Reference to each item within the shelf.
   */
  itemComponents: Component[] = [];

  constructor(parent: HTMLElement, data: any) {
    super(parent);
    this.data = data;

    try {
      // Attempt to set the title of the shelf from the data.
      this.title = data.set.text.title.full.set.default.content;
    } catch (error) {
      // do nothing, as default title is defined
    }

    try {
      // try accessing the items of the shelf
      this.items = data.set?.items;
    } catch {
      // show error message within the shelf
      this.title = 'Could not fetch items.';
    }

    this.setTitle();

    // if items are defined, use the items within the dataset.
    if (this.items?.length > 0) {
      this.setItems();
    // if items are dynamic and refid is defined, fetch items from the server
    } else if (data.set?.refId) {
      this.fetchRef();
    }
  }

  /**
   * Fetches the set from the server using the refId defined in this.data. Throws an error
   * if response is not 200. If request is successful, parse through the items and create
   * the appropriate elements.
   * @returns Promise
   */
  fetchRef() {
    const { refId } = this.data.set;
    return fetch(
      `https://cd-static.bamgrid.com/dp-117731241344/sets/${refId}.json`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(({ data }) => {
        this.data = data;
        // Could be empty, keys are not known.
        this.items =
          data.CuratedSet?.items ||
          data.PersonalizedCuratedSet?.items ||
          data.TrendingSet?.items;
        this.setItems();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Set the title of the shelf.
   */
  setTitle() {
    try {
      const titleElement = this.element.querySelector('.set-title');
      titleElement.innerHTML = this.title;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Create and render new item elements based on the dataset.
   */
  setItems() {
    try {
      if (!this.items || !this.items.length) {
        throw new Error(`No items to display for ${this.title}`);
      }

      // Get container for the items.
      const itemsContainer = this.element.querySelector('.items-row');

      this.items.forEach((item: any) => {
        // Create new Item Component element
        const itemComponent = new ItemComponent(
          itemsContainer as HTMLElement,
          item
        );

        // Save reference of ItemCompoment for later use
        this.itemComponents.push(itemComponent);
      });
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return `
      <section class='shelf'>
        <h4 class='set-title'></h4>
        <section class='items-row'>
        </section>
      </section>
    `;
  }
}

export default Shelf;
