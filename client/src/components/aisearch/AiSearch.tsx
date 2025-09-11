"use client";
import { useState, useRef, useEffect } from "react";
import { Search, Mic, Send, MicOff } from "lucide-react";
import AiSearchCard from "./AiSearchCard";
import aiSearch from "@/api/functions/aisearch/aiSearch";
import { Aiearch } from "@/types";
import Loader from "./Loader";

// Add TypeScript type declarations for SpeechRecognition
type SpeechRecognitionType = {
  new (): SpeechRecognitionInstance;
  prototype: SpeechRecognitionInstance;
};

type SpeechRecognitionInstance = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEvent = Event & {
  results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = Event & {
  error: string;
};

type SpeechRecognitionResultList = {
  [index: number]: SpeechRecognitionResult;
  length: number;
};

type SpeechRecognitionResult = {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
};

type SpeechRecognitionAlternative = {
  transcript: string;
  confidence: number;
};

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionType;
    webkitSpeechRecognition: SpeechRecognitionType;
  }
}

const AiSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Aiearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioElement = new Audio("/start.mp3");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setResults([]);
      const getResult = async () => {
        setIsLoading(true);
        await aiSearch(query)
          .then((res) => {
            setResults(res);
            setIsLoading(false);
            setQuery("");
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
            setQuery("");
          })
          .finally(() => {
            setIsLoading(false);
            setQuery("");
          });
      };

      getResult();
    }
  };

  const startListening = () => {
    audioElement.play();
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      audioElement.play();
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto pt-[100px]">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Search anything
        </h1>

        <form
          onSubmit={handleSearch}
          className="relative flex items-center md:px-0 px-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              {isSpeechSupported ? (
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-full cursor-pointer ${
                    isListening
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } transition-colors`}
                  title={isListening ? "Stop listening" : "Start voice search"}
                >
                  {isListening ? (
                    <div className="flex items-center">
                      <div className="animate-pulse mr-1">●</div>
                      <Mic className="h-4 w-4" />
                    </div>
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="p-2 rounded-full bg-gray-100 text-gray-400 cursor-pointer"
                  title="Voice search not supported"
                >
                  <MicOff className="h-4 w-4" />
                </button>
              )}

              <button
                type="submit"
                disabled={!query.trim()}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Search"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center w-full min-h-[550px]">
          <Loader />
        </div>
      )}
      {!isLoading && results.length === 0 && (
        <div className="flex justify-center items-center w-full min-h-[550px]">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Search your course with Ai
          </h1>
        </div>
      )}
      {results && results.length > 0 && (
        <div className="max-w-7xl m-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-20 min-h-[500px]">
          {results.map((card) => (
            <AiSearchCard card={card} key={card._id} />
          ))}
        </div>
      )}
    </>
  );
};

export default AiSearch;
