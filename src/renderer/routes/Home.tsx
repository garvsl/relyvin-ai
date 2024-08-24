export default function Home() {
  return (
    <div>
      <h1>relyvin</h1>
    </div>
  );
}

// const [transcripts, setTranscripts] = useState([]);
//   const [currentTranscript, setCurrentTranscript] = useState('');
//   const [recording, setRecording] = useState(false);
//   const [selected, setSelected] = useState(-1);
//   const [chunks, setChunks] = useState<any>([]);
//   const [mediaRecorder, setMediaRecorder] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [audioBuffers, setAudioBuffers] = useState<any>([]);

//   useEffect(() => {
//     (async () => {
//       setTranscripts(await window.electron.ipcRenderer.getTranscripts());
//     })();
//   }, [loading]);

//   useEffect(() => {
//     return () => {
//       audioBuffers.forEach(URL.revokeObjectURL);
//     };
//   }, [audioBuffers]);

//   const handleRecord = async () => {
//     setLoading(true);
//     console.log('is ', recording);
//     if (recording) {
//       try {
//         await mediaRecorder.stop();

//         const blob = new Blob(chunks, { type: 'audio/webm' });
//         const arrayBuffer = await blob.arrayBuffer();

//         const result = await window.electron.ipcRenderer.saveAudio(arrayBuffer);
//         if (result.success) {
//           console.log('Audio saved to:', result.path);
//           const transcribeResult =
//             await window.electron.ipcRenderer.transcription(result.path);

//           if (transcribeResult.success) {
//             console.log('Transcription complete:', transcribeResult.message);
//           } else {
//             console.error('Transcription failed:', transcribeResult.error);
//           }
//         } else {
//           console.error('Failed to save audio:', result.error);
//         }

//         const audioURL = URL.createObjectURL(blob);
//         setMediaRecorder(null);
//         setAudioBuffers((prev: any) => [...prev, audioURL]);
//         setChunks([]);
//       } catch (e) {
//         console.log(e);
//       }
//     } else {
//       setMediaRecorder(null);
//       const constraints = {
//         audio: {
//           // echoCancellation: true,
//           // noiseSuppression: true,
//           sampleRate: 44100,
//         },
//       };

//       try {
//         const stream = await navigator.mediaDevices.getUserMedia(constraints);
//         const mr = new MediaRecorder(stream);
//         mr.ondataavailable = (event) => {
//           setChunks((chunk: any) => [...chunk, event.data]);
//         };
//         mr.start(1000);
//         setMediaRecorder(mr);
//       } catch (e) {
//         console.log(e);
//       }
//     }
//     setRecording((e) => !e);
//     setLoading(false);
//   };

//   return (
//     <div className="flex w-[100vw] bg-neutral-950 h-[100vh]">
//       <div className="flex-[0.3] flex flex-col items-center p-12 bg-black">
//         <h1 className="text-4xl font-medium mb-4  text-white">Transcripts</h1>
//         <div className="flex flex-col overflow-y-scroll  w-full">
//           {transcripts &&
//             transcripts.length > 0 &&
//             transcripts.map((transcript, index) => (
//               <button
//                 type="button"
//                 key={transcript}
//                 onClick={async () => {
//                   setCurrentTranscript(
//                     await window.electron.ipcRenderer.readTranscript(
//                       transcript,
//                     ),
//                   );
//                   setSelected(index);
//                 }}
//                 className={` text-black rounded-lg p-4 mt-4 ${index === selected ? 'bg-blue-500' : 'bg-white'}`}
//               >
//                 {transcript}
//               </button>
//             ))}
//         </div>
//       </div>
//       <div className="flex-1 p-12">
//         <div className=" flex flex-col items-center ">
//           {/* <h1 className="text-5xl items-center font-medium text-white">
//             Scriber AI Mark I
//           </h1> */}
//           <div className="Hello ">
//             {/* <input type="file" onChange={audioSubmit} /> */}
//             <Button
//               disabled={loading}
//               onClick={async () => {
//                 await handleRecord();
//                 // handleAudioRecord();
//               }}
//               className={`flex rounded-full w-full gap-2 p-4 ${recording ? 'bg-red-500' : 'bg-green-500'}`}
//               type="button"
//             >
//               {loading ? (
//                 <>
//                   <span className="mr-2" role="img" aria-label="books">
//                     ⏳
//                   </span>
//                   <span>Transcribing...</span>
//                 </>
//               ) : (
//                 <>
//                   <span className="mr-2" role="img" aria-label="books">
//                     ⏺
//                   </span>
//                   <span>{recording ? 'Stop' : 'Record'}</span>
//                 </>
//               )}
//             </Button>
//           </div>
//           {audioBuffers.length > 0 && (
//             <div>
//               {audioBuffers.map((audioURL: any) => (
//                 // eslint-disable-next-line jsx-a11y/media-has-caption
//                 <audio
//                   key={audioURL}
//                   controls
//                   src={audioURL}
//                   className="mt-4"
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//         <div className="flex flex-col items-center mt-8">
//           <textarea
//             value={currentTranscript}
//             disabled
//             className="w-full  h-96 p-4 bg-black text-white resize-none rounded-xl"
//           />
//         </div>
//       </div>
//     </div>
//   );
