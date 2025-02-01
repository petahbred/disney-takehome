import Home from './components/Home';
import './styles/main.scss';

function App() {
  const app = document.getElementById('app');
  const homeComponent = new Home(app);
  app.innerHTML = homeComponent.render();
}

App();
