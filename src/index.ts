import Home from './components/Home';
import './styles/index.scss';

function App() {
  const app = document.getElementById('app');
  const homeComponent = new Home(app);
  app.innerHTML = homeComponent.render();
}

window.addEventListener('load', () => {
  App();
});
