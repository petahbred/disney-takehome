import Component from './Component';

const TILE_ASPECT_RATIO = 1.78;

export class Item extends Component {
  name: 'MediaItem';

  data: any;

  _itemTypes: Record<string, string> = {
    DmcSeries: 'series',
    DmcVideo: 'program',
    StandardCollection: 'collection',
  };

  itemType?: string;

  constructor(parent: HTMLElement, data: any) {
    super(parent, 'MediaItemComponent');
    this.data = data;

    // Save Item Type for referencing image and text of the item.
    this.itemType = this._itemTypes[data.type];

    this.setTitle();
    this.setImage();
  }

  /**
   * Set the title of the item for accessibility and placeholder.
   */
  setTitle(): void {
    /**
     * All keys are not known at this time, could throw an error if key's value is undefined
     */
    let title;
    try {
      // Add catch block just in case itemType does not exist.
      title = this.data?.text?.title?.full[this.itemType].default?.content;
    } catch (error) {}

    if (!title) {
      throw new Error('Unable to parse title of item');
    }

    this.element.setAttribute('aria-title', title);
    this.element.querySelector('small').innerText = title;
  }

  /**
   * Get the image URL with aspect ratio 1.78 to use for the tile. Adds the image url as
   * a data-src attribute to be later used by the lazy loading IntersectionObserver callback.
   */
  setImage() {
    const itemElement = this.element.querySelector('.media-item__tile');
    // use landscape aspect ratio when retrieving image from the data
    const { url } =
      this.data.image.tile[TILE_ASPECT_RATIO][this.itemType]?.default ||
      this.data.image.tile[TILE_ASPECT_RATIO]?.default?.default;
    itemElement.setAttribute('data-src', url);

    /**
     * lazy load images once they're within view of the page
     */
    const lazyImages = document.querySelectorAll('img.lazy');
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img: HTMLImageElement = entry.target as HTMLImageElement;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.1 }
    );

    lazyImages.forEach((img) => observer.observe(img));
  }

  render() {
    return `
      <div class='media-item'>
        <small class='media-title'></small>
        <img class='lazy media-item__tile'/>
      </div>
    `;
  }
}

export default Item;
