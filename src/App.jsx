import { useRef, useState } from "react";

const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStreamRef.current = stream;
    const socket = new WebSocket(
      `wss://api.deepgram.com/v1/listen?punctuate=true`,
      ["token", DEEPGRAM_API_KEY]
    );
    wsRef.current = socket;

    socket.onopen = () => {
      setIsRecording(true);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (socket.readyState === 1 && event.data.size > 0) {
          socket.send(event.data);
        }
      };

      mediaRecorder.start(250); // Send audio every 250ms
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.channel?.alternatives[0]?.transcript) {
        setTranscript((prev) => {
          const newText = data.channel.alternatives[0].transcript;
          return newText ? prev + " " + newText : prev;
        });
      }
    };

    socket.onerror = (e) => console.error("WebSocket error:", e);
    socket.onclose = () => console.log("WebSocket closed");
  };

  const stopRecording = () => {
    setIsRecording(false);
    wsRef.current?.close();
    mediaRecorderRef.current?.stop();
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const refreshTranscript = () => {
    setTranscript("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 w-full max-w-2xl rounded-2xl flex flex-col items-center justify-between p-8 shadow-2xl border border-gray-700">
        <div className="w-full text-center mb-6">
          <h1 className="text-4xl font-bold mb-4 text-purple-500 ">
            🎙️ Deepgram Live Transcriber
          </h1>
          <p className="text-gray-400">
            Real-time speech-to-text transcription
          </p>
        </div>

        <div className="w-full mb-6 relative">
          <textarea
            className="w-full bg-gray-700 h-64 p-5 text-lg text-white rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all border border-gray-600 placeholder-gray-500 overflow-y-auto"
            placeholder={transcript ? "" : "Your speech will appear here..."}
            value={transcript}
            readOnly
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`mt-2 p-4 rounded-full text-white font-bold transition-all transform active:scale-95 hover:scale-105 ${
              isRecording
                ? "bg-red-500 hover:bg-red-600 animate-pulse  "
                : "bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700  "
            }`}
          >
            {isRecording ? (
              <span className="flex items-center">
                <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#FFFFFF"
                >
                  <path d="m710-362-58-58q14-23 21-48t7-52h80q0 44-13 83.5T710-362ZM480-594Zm112 112-72-72v-206q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v126l-80-80v-46q0-50 35-85t85-35q50 0 85 35t35 85v240q0 11-2.5 20t-5.5 18ZM440-120v-123q-104-14-172-93t-68-184h80q0 83 57.5 141.5T480-320q34 0 64.5-10.5T600-360l57 57q-29 23-63.5 39T520-243v123h-80Zm352 64L56-792l56-56 736 736-56 56Z" />
                </svg>
              </span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#FFFFFF"
              >
                <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z" />
              </svg>
            )}
          </button>

          <button
            onClick={refreshTranscript}
            className="mt-2 p-4 rounded-full text-white font-bold transition-all transform active:scale-95 hover:scale-105 bg-gradient-to-r from-blue-300 to-blue-400 hover:from-blue-400 hover:to-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M204-318q-22-38-33-78t-11-82q0-134 93-228t227-94h7l-64-64 56-56 160 160-160 160-56-56 64-64h-7q-100 0-170 70.5T240-478q0 26 6 51t18 49l-60 60ZM481-40 321-200l160-160 56 56-64 64h7q100 0 170-70.5T720-482q0-26-6-51t-18-49l60-60q22 38 33 78t11 82q0 134-93 228t-227 94h-7l64 64-56 56Z" />
            </svg>
          </button>
        </div>

        {transcript && (
          <div className="mt-4 text-sm text-gray-500">
            {transcript.split(" ").length} words transcribed
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
