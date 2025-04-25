import React, { useState } from "react";
import axios from "axios";

const InputComponent = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSentiment = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post(
        " http://127.0.0.1:8000/analyze_single_tweet",
        {
          text,
        }
      );
      setResult(response.data);
    } catch (err) {
      setResult({ error: "Something went wrong. Try again!", message: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-900 to-indigo-800 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-xl text-white">
        <h1 className="text-3xl font-bold text-center mb-6">
          🧠 Sentiment Analyzer
        </h1>

        <textarea
          rows="4"
          placeholder="Type or paste your text here..."
          className="w-full p-4 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-400 text-white placeholder-gray-300 mb-4 transition-all duration-200"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={analyzeSentiment}
          className="w-full py-3 px-6 bg-purple-500 hover:bg-purple-600 transition-all duration-200 rounded-xl text-lg font-semibold shadow-md hover:scale-105"
        >
          {loading ? "Analyzing..." : "Analyze Sentiment"}
        </button>

        {result && (
          <div className="mt-6 p-4 rounded-xl border border-purple-300 bg-purple-100 text-purple-900 shadow-inner transition-all duration-300">
            {result.error ? (
              <p className="text-red-600 font-semibold">{result.error}</p>
            ) : (
              <>
                <p className="italic text-gray-800 mb-2">"{result.tweet}"</p>
                <p className="font-bold text-xl">
                  Sentiment:{" "}
                  <span
                    className={
                      result.sentiment === "Positive"
                        ? "text-green-600"
                        : result.sentiment === "Negative"
                        ? "text-red-600"
                        : "text-gray-700"
                    }
                  >
                    {result.sentiment}
                  </span>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputComponent;
