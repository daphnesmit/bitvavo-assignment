import './App.css';
import { AssetsTable } from './components/AssetsTable/AssetsTable';
import { Header } from './components/Header/Header';

function App() {
  return (
    <div className="container mx-auto px-8 py-20 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-16 md:gap-36">
          <Header />
          <AssetsTable />
        </div>
      </div>
    </div>
  );
}

export default App;
