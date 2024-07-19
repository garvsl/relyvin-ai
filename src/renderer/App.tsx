import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';

function Hello() {
  return (
    <div>
      <h1 className="text-4xl items-center  text-black">
        Meeting Follow-Upper
      </h1>
      <div className="Hello">
        <button className="flex gap-2 bg-blue-500 p-4" type="button">
          <span className="mr-2" role="img" aria-label="books">
            ⏺
          </span>
          Start Recording
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
