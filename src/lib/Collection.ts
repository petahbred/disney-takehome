const BASE_URL = 'https://cd-static.bamgrid.com/dp-117731241344';

export class Collection {
  fetchHome(): Promise<any[]> {
    return fetch(`${BASE_URL}/home.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error fetching data.');
        }

        return response.json();
      })
      .then(({ data }: any) => {
        const { containers } = data?.StandardCollection;
        return containers;
      });
  }

  fetchRef(refId: string) {
    return fetch(`${BASE_URL}/sets/${refId}.json`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(({ data }) => {
        return data;
      });
  }
}

const CollectionInstance = new Collection();
export default CollectionInstance;
