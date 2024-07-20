import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import { useEffect, useState } from 'react';

function Home() {
  const [transcripts, setTranscripts] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [recording, setRecording] = useState(false);
  const [screens, setScreens] = useState([]);
  const [screen, setScreen] = useState(null);

  useEffect(() => {
    (async () => {
      setTranscripts(await window.electron.ipcRenderer.getTranscripts());
      const theScreens = await window.electron.ipcRenderer.listScreens();
      if (theScreens && theScreens.error) {
        alert(theScreens.error);
        setScreens([]);
      } else {
        const storeScreens = theScreens.trim().split(' ');
        console.log(storeScreens);
        setScreens(storeScreens);
        setScreen(storeScreens[0]);
      }
    })();
  }, []);

  const handleRecord = async () => {
    setRecording((e) => !e);
    console.log('recording');
    if (recording) {
      const vidPath = await window.electron.ipcRenderer.stopRecording();
      alert(`Recording saved to: ${vidPath}`);
    } else {
      const options = {
        screenId: Number(screens[0]),
        framesPerSecond: 30,
        showCursor: true,
        destination:
          '/Users/goofyahhgarv/Desktop/Projects/meeting-followupper/src/store/audio/recording1.mp4',
        highlightClicks: false,
        videoCodec: 'h264',
      };
      await window.electron.ipcRenderer.startRecording(options);
    }
  };

  return (
    <div className="flex w-[100vw] h-[100vh]">
      <div className="flex-[0.3] flex flex-col items-center p-12 bg-gray-50">
        <h1 className="text-4xl   text-black">Transcripts</h1>
        <div className="flex flex-col  w-full">
          {transcripts &&
            transcripts.length > 0 &&
            transcripts.map((transcript) => (
              <button
                type="button"
                key={transcript}
                onClick={async () => {
                  setCurrentTranscript(
                    await window.electron.ipcRenderer.readTranscript(
                      transcript,
                    ),
                  );
                }}
                className="bg-gray-200 text-black rounded-lg p-4 mt-4"
              >
                {transcript}
              </button>
            ))}
        </div>
      </div>
      <div className="flex-1 p-12">
        <div className=" flex flex-col items-center ">
          <h1 className="text-4xl items-center  text-black">
            Meeting Follow-Upper
          </h1>
          <div className="Hello">
            {screens && screens.length > 0 ? (
              <>
                <select className="bg-gray-100 rounded-full text-black p-2 m-2">
                  {screens.map((s) => {
                    return (
                      <option onClick={() => setScreen(s)} key={s} value={s}>
                        {s}
                      </option>
                    );
                  })}
                </select>
                <button
                  disabled={screen == null}
                  onClick={async () => {
                    handleRecord();
                  }}
                  className={`flex gap-2 p-4 ${recording ? 'bg-red-500' : 'bg-green-500'}`}
                  type="button"
                >
                  <span className="mr-2" role="img" aria-label="books">
                    ⏺
                  </span>
                  {recording ? 'Stop Recording' : 'Start Recording'}
                </button>
              </>
            ) : (
              <div>
                <p className="text-black">No screens found</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center mt-8">
          <textarea
            value={currentTranscript}
            disabled
            className="w-full text-black h-96 p-4 bg-gray-50 resize-none rounded-xl"
          />
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
