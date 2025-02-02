import Component from './Component';
import Shelf from './Shelf';

/**
 * Home Component and main container for the application.
 */
export default class Home extends Component {
  // Keep reference of each shelf
  shelves: Shelf[] = [];

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

        containers.forEach((container: any) => {
          const shelf = new Shelf(main, container);
          this.shelves.push(shelf);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * After initial render, fetch data from the server.
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
