import { getElementFromString } from '../utils';
import Component from './Component';
import Item from './Item';

const HD_WIDTH = 1920;

export class Modal extends Component {
  item: Item;

  data: any;

  showModal(item: Item) {
    if (!item) {
      return;
    }
    this.item = item;
    console.log(item.data);
    this.data = item.data;
    // show modal by removing the hidden class
    this.element.classList.remove('hidden');

    this.setTitle();
    this.setLogo();
    this.setBackgroundHeroImage();
    this.setSecondaryText();
    this.setVideo();
  }

  setTitle() {
    const title =
      this.data?.text?.title?.full[this.item.itemType]?.default?.content;
    if (!title) {
      return;
    }
    const logoElement = this.element.querySelector(
      '.item-display__title'
    ) as HTMLElement;
    logoElement.innerText = title;
  }

  setLogo() {
    try {
      const imageObject =
        this.data.image?.title_treatment?.['1.78'] ||
        this.data.image?.logo?.['2.00'];

      console.log('logo', imageObject);
      const logoURL = (Object.values(imageObject).pop() as any).default?.url;
      const logoImage = this.element.querySelector(
        '.item-display__logo img'
      ) as HTMLImageElement;
      logoImage.src = logoURL;
    } catch (error) {
      console.error(error);
    }
  }

  setBackgroundHeroImage() {
    try {
      const imageObject =
        this.data.image?.background?.['1.78'] ||
        this.data.image?.hero_collection?.['1.78'];
      const backgroundImageURL = (Object.values(imageObject).pop() as any)
        .default?.url;
      const display = this.element.getElementsByClassName(
        'item-display__main'
      )[0] as HTMLElement;
      const imageURL = new URL(backgroundImageURL);
      imageURL.searchParams.set('width', HD_WIDTH.toString());
      display.style.backgroundRepeat = 'no-repeat';
      display.style.backgroundSize = 'cover';
      display.style.background = `url('${imageURL.toString()}')`;
    } catch (error) {
      console.error(error);
    }
  }

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

  hideModal() {
    this.element.classList.add('hidden');
  }

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
              <h3 class='item-display__title'></h3>
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
