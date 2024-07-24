import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import { useEffect, useState } from 'react';

function Home() {
  const [transcripts, setTranscripts] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [recording, setRecording] = useState(false);
  const [chunks, setChunks] = useState<any>([]);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [audioBuffers, setAudioBuffers] = useState<any>([]);

  useEffect(() => {
    (async () => {
      setTranscripts(await window.electron.ipcRenderer.getTranscripts());
    })();
  }, [loading]);

  useEffect(() => {
    return () => {
      audioBuffers.forEach(URL.revokeObjectURL);
    };
  }, [audioBuffers]);

  const handleRecord = async () => {
    setLoading(true);
    let audioPromise = null;
    console.log('is ', recording);
    if (recording) {
      try {
        await mediaRecorder.stop();

        const blob = new Blob(chunks, { type: 'audio/webm' });
        const arrayBuffer = await blob.arrayBuffer();

        const result = await window.electron.ipcRenderer.saveAudio(arrayBuffer);
        if (result.success) {
          console.log('Audio saved to:', result.path);
          const transcribeResult =
            await window.electron.ipcRenderer.transcription(result.path);

          if (transcribeResult.success) {
            console.log('Transcription complete:', transcribeResult.message);
          } else {
            console.error('Transcription failed:', transcribeResult.error);
          }
        } else {
          console.error('Failed to save audio:', result.error);
        }

        const audioURL = URL.createObjectURL(blob);
        setMediaRecorder(null);
        setAudioBuffers((prev) => [...prev, audioURL]);
        setChunks([]);
      } catch (e) {
        console.log(e);
      }
    } else {
      setMediaRecorder(null);
      const constraints = {
        audio: {
          // echoCancellation: true,
          // noiseSuppression: true,
          sampleRate: 44100,
        },
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const mr = new MediaRecorder(stream);
        mr.ondataavailable = (event) => {
          setChunks((chunk) => [...chunk, event.data]);
        };
        mr.start(1000);
        setMediaRecorder(mr);
      } catch (e) {
        console.log(e);
      }
    }
    setRecording((e) => !e);
    setLoading(false);
  };

  const audioSubmit = (e) => {
    console.log(e.target.files[0]);
    console.log('submit');
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
            <input type="file" onChange={audioSubmit} />
            <button
              disabled={loading}
              onClick={async () => {
                await handleRecord();
                // handleAudioRecord();
              }}
              className={`flex gap-2 p-4 ${recording ? 'bg-red-500' : 'bg-green-500'}`}
              type="button"
            >
              {loading ? (
                <>
                  <span className="mr-2" role="img" aria-label="books">
                    ⏳
                  </span>
                  <span>Transcribing...</span>
                </>
              ) : (
                <>
                  <span className="mr-2" role="img" aria-label="books">
                    ⏺
                  </span>
                  <span>{recording ? 'Stop' : 'Record'}</span>
                </>
              )}
            </button>
          </div>
          {audioBuffers.length > 0 && (
            <div>
              {audioBuffers.map((audioURL, index) => (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <audio key={index} controls src={audioURL} className="mt-4" />
              ))}
            </div>
          )}
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
