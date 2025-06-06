import React, { useState } from "react";
import {
  Brain,
  Zap,
  BookOpen,
  Lightbulb,
  Send,
  Loader,
  Sparkles,
} from "lucide-react";

const ConceptExplainer = () => {
  const [concept, setConcept] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  const explainConcept = async () => {
    if (!concept.trim()) return;

    setLoading(true);

    // Add user message to conversation
    const userMessage = {
      type: "user",
      content: concept,
      timestamp: Date.now(),
    };
    setConversationHistory((prev) => [...prev, userMessage]);

    // Simulate AI explanation (replace with actual API call later)
    setTimeout(() => {
      const mockExplanations = {
        convolution: {
          definition:
            "Convolution is a mathematical operation that combines two functions to produce a third function. In signal processing, convolution describes how the shape of one signal is modified by another signal.",
          explanation:
            'Think of convolution as a "blending" process. When you convolve two signals, you\'re essentially sliding one signal over another and calculating the overlap at each position. This is fundamental in understanding how linear systems modify input signals.',
          applications: [
            "Digital filters",
            "Echo and reverb effects",
            "Image processing",
            "System analysis",
          ],
          formula: "y(t) = ∫ x(τ)h(t-τ)dτ",
        },
        "fourier transform": {
          definition:
            "The Fourier Transform decomposes a signal into its constituent frequencies. It transforms a signal from the time domain to the frequency domain.",
          explanation:
            "Imagine a musical chord - the Fourier Transform tells you exactly which individual notes (frequencies) make up that chord. It's like having perfect pitch for any signal!",
          applications: [
            "Spectrum analysis",
            "Digital communication",
            "Audio compression",
            "Medical imaging",
          ],
          formula: "X(ω) = ∫ x(t)e^(-jωt)dt",
        },
        "impulse response": {
          definition:
            "The impulse response is the output of a system when presented with a brief input signal called an impulse.",
          explanation:
            "Think of it like clapping your hands in a cathedral - the echo you hear is the impulse response of the building. It completely characterizes how any linear system will respond to any input.",
          applications: [
            "System identification",
            "Filter design",
            "Room acoustics",
            "Control systems",
          ],
          formula: "h(t) = system response to δ(t)",
        },
        "laplace transform": {
          definition:
            "The Laplace Transform is a generalization of the Fourier Transform that converts a function of time into a function of complex frequency.",
          explanation:
            "The Laplace Transform is like the Fourier Transform's more versatile cousin. It can handle signals that grow exponentially and is incredibly useful for solving differential equations in engineering.",
          applications: [
            "Control system design",
            "Circuit analysis",
            "Differential equations",
            "Stability analysis",
          ],
          formula: "X(s) = ∫₀^∞ x(t)e^(-st)dt",
        },
      };

      const key = concept.toLowerCase();
      const result = mockExplanations[key] || {
        definition: `"${concept}" is an important concept in signal processing.`,
        explanation:
          "This is where the AI would provide a detailed explanation based on the trained model and course materials. The explanation would be tailored to CPUT curriculum.",
        applications: [
          "Various engineering applications",
          "Signal analysis",
          "System design",
        ],
        formula: "Mathematical representation would be shown here",
      };

      // Add AI response to conversation
      const aiMessage = { type: "ai", content: result, timestamp: Date.now() };
      setConversationHistory((prev) => [...prev, aiMessage]);
      setExplanation(result);
      setLoading(false);
      setConcept("");
    }, 2000);
  };

  const popularConcepts = [
    { term: "Convolution", icon: "🔄", color: "blue" },
    { term: "Fourier Transform", icon: "🌊", color: "purple" },
    { term: "Impulse Response", icon: "⚡", color: "green" },
    { term: "Laplace Transform", icon: "🧮", color: "orange" },
    { term: "Z-Transform", icon: "🔢", color: "red" },
    { term: "Sampling", icon: "📊", color: "indigo" },
    { term: "Aliasing", icon: "👥", color: "pink" },
    { term: "DFT", icon: "🔍", color: "teal" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Concept Explainer
          </h2>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Get instant, clear explanations of Signal Processing concepts powered
          by AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chat Interface */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold">CPUT Signal Processing AI</h3>
                  <p className="text-purple-100 text-sm">
                    Ready to explain any concept
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {conversationHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-purple-500" />
                  </div>
                  <p className="text-gray-500">
                    Ask me about any Signal Processing concept!
                  </p>
                </div>
              ) : (
                conversationHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type === "user" ? (
                      <div className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-xs">
                        {message.content}
                      </div>
                    ) : (
                      <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm max-w-md">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              Definition:
                            </h4>
                            <p className="text-gray-700 text-sm">
                              {message.content.definition}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              Simple Explanation:
                            </h4>
                            <p className="text-gray-700 text-sm">
                              {message.content.explanation}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                              Formula:
                            </h4>
                            <code className="bg-white px-2 py-1 rounded text-sm font-mono">
                              {message.content.formula}
                            </code>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 animate-spin text-purple-500" />
                      <span className="text-gray-600 text-sm">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Ask about any Signal Processing concept..."
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && explainConcept()}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  onClick={explainConcept}
                  disabled={!concept.trim() || loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Concepts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span>Popular Concepts</span>
            </h3>
            <div className="space-y-2">
              {popularConcepts.map((item) => (
                <button
                  key={item.term}
                  onClick={() => setConcept(item.term)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all duration-300 hover:scale-105 ${
                    item.color === "blue"
                      ? "bg-blue-50 hover:bg-blue-100 text-blue-700"
                      : item.color === "purple"
                      ? "bg-purple-50 hover:bg-purple-100 text-purple-700"
                      : item.color === "green"
                      ? "bg-green-50 hover:bg-green-100 text-green-700"
                      : item.color === "orange"
                      ? "bg-orange-50 hover:bg-orange-100 text-orange-700"
                      : item.color === "red"
                      ? "bg-red-50 hover:bg-red-100 text-red-700"
                      : item.color === "indigo"
                      ? "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                      : item.color === "pink"
                      ? "bg-pink-50 hover:bg-pink-100 text-pink-700"
                      : "bg-teal-50 hover:bg-teal-100 text-teal-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.term}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>Pro Tips</span>
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 mt-0.5"></span>
                <p>Ask specific questions for better explanations</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 bg-purple-500 rounded-full flex-shrink-0 mt-0.5"></span>
                <p>Use technical terms from your textbook</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-4 h-4 bg-pink-500 rounded-full flex-shrink-0 mt-0.5"></span>
                <p>Follow up with related questions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptExplainer;
