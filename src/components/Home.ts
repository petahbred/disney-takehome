export class Home {
  constructor(parentElement: HTMLElement) {
    parentElement.innerHTML = this.render();
  }

  render() {
    return `
    <main id='main'></main>
    `;
  }
}

export default Home;
