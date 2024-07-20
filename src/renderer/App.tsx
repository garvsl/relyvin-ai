import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import { useEffect, useState } from 'react';

function Home() {
  const [transcripts, setTranscripts] = useState([]);

  useEffect(() => {
    (async () => {
      setTranscripts(await window.electron.ipcRenderer.getTranscripts());
    })();
  }, []);

  return (
    <div className="flex w-[100vw] h-[100vh]">
      <div className="flex-[0.3] flex flex-col items-center p-12 bg-gray-50">
        <h1 className="text-4xl   text-black">Transcripts</h1>
        <div className="flex flex-col  w-full">
          {transcripts &&
            transcripts.length > 0 &&
            transcripts.map((transcript) => (
              <div
                key={transcript}
                className="bg-gray-200 text-black rounded-lg p-4 mt-4"
              >
                {transcript}
              </div>
            ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center p-12">
        <h1 className="text-4xl items-center  text-black">
          Meeting Follow-Upper
        </h1>
        <div className="Hello">
          <button
            onClick={async () => {}}
            className="flex gap-2 bg-blue-500 p-4"
            type="button"
          >
            <span className="mr-2" role="img" aria-label="books">
              ⏺
            </span>
            Start Recording
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
