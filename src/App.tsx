import './App.css';
import { Header } from './components/Header/Header';
import { Markets } from './components/Markets/Markets';

function App() {
  return (
    <div className="mx-auto px-4  py-20 lg:container md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-16 md:gap-36">
          <Header />
          <Markets />
        </div>
      </div>
    </div>
  );
}

export default App;
