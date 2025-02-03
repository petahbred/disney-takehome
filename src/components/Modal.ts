import Component from './Component';
import Item from './Item';

const HD_WIDTH = 1280;

export class Modal extends Component {
  /**
   * Item component class
   */
  item: Item;

  /**
   * raw data from server
   */
  data: any;

  /**
   * Initializes all the elements using the data retrieved from the server.
   * @param item Item component to retrieve details of
   * @returns
   */
  showModal(item: Item) {
    if (!item) {
      return;
    }
    this.item = item;
    this.data = item.data;

    // show modal by removing the hidden class
    this.element.classList.remove('hidden');

    this.setTitle();
    this.setLogo();
    this.setBackgroundHeroImage();
    this.setSecondaryText();
    this.setVideo();
  }

  /**
   * Sets the title of the item as a fallback if image does not load.
   * @returns void
   */
  setTitle() {
    const title = (Object.values(this.data?.text?.title?.full)?.[0] as any)
      ?.default?.content;

    if (!title) {
      return;
    }

    const logoElement = this.element.querySelector(
      '.item-display__title'
    ) as HTMLElement;
    logoElement.innerText = title;
  }

  /**
   * Sets the logo image. Attempts to retrieve all known avialable keys to parse through the dataset. Any error occurs fetching the logo image, display the text title instead.
   */
  setLogo() {
    const showTitle = () => {
      this.element
        .querySelector('.item-display__title')
        .classList.remove('hidden');
    };

    try {
      const imageObject =
        this.data.image?.title_treatment?.['1.78'] ||
        this.data.image?.logo?.['2.00'];

      if (!imageObject) {
        throw new Error('imageObject is undefined');
        return;
      }

      const logoURL = (Object.values(imageObject).pop() as any).default?.url;
      const logoImage = this.element.querySelector(
        '.item-display__logo img'
      ) as HTMLImageElement;

      logoImage.addEventListener('error', () => {
        showTitle();
      });
      logoImage.src = logoURL;
    } catch (error) {
      console.error(error);
      showTitle();
    }
  }

  /**
   * Fetches and sets the main background image using a landscape aspect ratio. Does not
   * display anything if error occurs.
   */
  setBackgroundHeroImage() {
    try {
      // parse known keys for a background image
      const imageObject =
        this.data.image?.background?.['1.78'] ||
        this.data.image?.hero_collection?.['1.78'];
      const backgroundImageURL = (Object.values(imageObject).pop() as any)
        .default?.url;
      const display = this.element.getElementsByClassName(
        'item-display__main'
      )[0] as HTMLElement;
      // increase the quality from the API
      const imageURL = new URL(backgroundImageURL);
      imageURL.searchParams.set('width', HD_WIDTH.toString());
      // set the background image url
      display.style.background = `center / cover url('${imageURL.toString()}') no-repeat`;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Sets the secondary text under the logo/title.
   */
  setSecondaryText() {
    const secondaryEl = this.element.querySelector(
      '.item-display__secondary'
    ) as HTMLElement;
    const rating = document.createElement('p');
    rating.innerText = `${this.data?.ratings?.[0]?.value || ''} ${
      this.data?.releases?.[0]?.releaseYear || ''
    }`;
    secondaryEl.append(rating);
  }

  /**
   * checks if dataset has videoArt available. Load and play video if avaialble after 5 seconds.
   */
  setVideo() {
    const url = this.data?.videoArt?.[0]?.mediaMetadata?.urls?.[0]?.url;
    if (!url) {
      return;
    }

    console.log('hasVideo');

    const videoEl = this.element.querySelector('#videoArt') as HTMLVideoElement;
    setTimeout(() => {
      const sourceEl = document.createElement('source');
      sourceEl.setAttribute('src', url);
      videoEl.classList.remove('hidden');
      videoEl.appendChild(sourceEl);
      videoEl.load();
      videoEl.play();
    }, 5000);

    videoEl.addEventListener('ended', (event) => {
      videoEl.classList.add('hidden');
    });
  }

  /**
   * Hides modal using display: none, CSS
   */
  hideModal() {
    this.element.classList.add('hidden');
  }

  /**
   * Removes the element from the DOM tree.
   */
  remove() {
    this.element.remove();
  }

  render() {
    return `
      <article id='itemDisplay' class='hidden'>
        <section class='item-display__main'>
          <div class='item-display__overlay'></div>
          <video id='videoArt' class='hidden'></video>
          <div class='item-display__content'>
            <div class='item-display__logo'>
              <h3 class='item-display__title hidden'></h3>
              <img class='logo' />
            </div>
            <div class='item-display__secondary'></div>
            <div class='item-display__buttons'></div>
          </div>
        </section>
      </article>
    `;
  }
}

export default Modal;
