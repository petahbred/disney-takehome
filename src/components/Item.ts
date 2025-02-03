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

  handleImageLoadError(event: ErrorEvent) {
    (event.target as HTMLImageElement).classList.add('hidden');
    this.element.querySelector('.media-item__title').classList.remove('hidden');
  }

  /**
   * Get the image URL with aspect ratio 1.78 to use for the tile. Adds the image url as
   * a data-src attribute to be later used by the lazy loading IntersectionObserver callback.
   */
  setImage() {
    const img = this.element.querySelector('.media-item__img');
    // use landscape aspect ratio when retrieving image from the data
    const { url } =
      this.data.image.tile[TILE_ASPECT_RATIO][this.itemType]?.default ||
      this.data.image.tile[TILE_ASPECT_RATIO]?.default?.default;
    const imageURL = new URL(url);
    // Attempt to progressive image load the tiles
    imageURL.searchParams.set('quality', '10');
    imageURL.searchParams.set('width', '320');
    const lowRes = imageURL.toString();
    img.setAttribute('data-src', lowRes);

    imageURL.searchParams.set('quality', '50');
    const highRes = imageURL.toString();
    img.setAttribute('data-high-res', highRes)

    img.addEventListener('error', this.handleImageLoadError.bind(this));

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
            const higherRes = new Image();
            higherRes.src = img.dataset?.highRes;
            higherRes.onload = () => {
              img.src = higherRes.src;
              img.classList.remove('lazy', 'blur');
            }
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
        <small class='media-item__title hidden'></small>
        <img class='lazy media-item__img blur'/>
      </div>
    `;
  }
}

export default Item;
