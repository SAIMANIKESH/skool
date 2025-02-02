import React, { useState } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import {
  SendHorizontal,
  Settings,
  KeyRound,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import CodeDisplay from "../Code";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const PythonTutor = () => {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState("python_pal");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const characters = {
    python_pal: {
      name: "Python Pal",
      description: "A friendly snake who loves to code!",
      greeting: "Hi! I'm Python Pal! Let's learn coding together! 🐍",
    },
    robo_teacher: {
      name: "Robo Teacher",
      description: "A smart robot who makes coding fun!",
      greeting: "Beep boop! Ready to learn some cool programming? 🤖",
    },
    code_wizard: {
      name: "Code Wizard",
      description: "A magical mentor for your coding journey!",
      greeting: "Welcome young coder! Let's create some magic! ✨",
    },
  };

  const extractCodeFromResponse = (text) => {
    const codeMatch = text.match(/```python([\s\S]*?)```/);
    // console.log(codeMatch);
    return codeMatch ? codeMatch[1].trim() : null;
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fillLikeColor = (index) => {
    setConversation((prev) =>
      prev.map((msg, i) =>
        i === index
          ? {
              ...msg,
              likes: !msg.likes,
              dislikes: msg.dislikes ? false : msg.dislikes,
            }
          : msg
      )
    );
  };

  const fillDislikeColor = (index) => {
    setConversation((prev) =>
      prev.map((msg, i) =>
        i === index
          ? {
              ...msg,
              dislikes: !msg.dislikes,
              likes: msg.likes ? false : msg.likes,
            }
          : msg
      )
    );
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    // document.title =
    //   message[0].toUpperCase() + message.slice(1, message.length);
    setLoading(true);
    const newConversation = [
      ...conversation,
      { role: "user", content: message },
    ];
    setConversation(newConversation);
    setMessage("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/chat`,
        {
          apiKey,
          message,
          conversation,
        }
      );

      const code = extractCodeFromResponse(response.data.response);

      setConversation([
        ...conversation,
        { role: "user", content: message },
        {
          role: "assistant",
          content: response.data.response,
          code: code,
          likes: false,
          dislikes: false,
        },
      ]);
      //   console.log(response.data.response);
    } catch (error) {
      //   console.error("Error:", error.response);
      alert(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      {/* Welcome Banner */}
      <Card className="mb-4 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-purple-700">
            🌟 Python Adventure for Kids! 🚀
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Welcome to your magical journey into Python programming! This
            interactive tutor helps you learn coding through fun conversations
            and challenges. Choose your favorite character guide, try out real
            Python code, and earn achievements as you learn!
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 rounded-lg bg-purple-100 px-4 py-2 text-purple-700 hover:bg-purple-200"
            >
              <Settings size={16} />
              Settings
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="mb-4 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg text-purple-700">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 block text-md ml-1 font-medium text-gray-700">
                  API Key <KeyRound size={16} className="mt-1" />
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 p-2 outline-green-300"
                    placeholder="Enter your API key"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Choose Your Guide
                </label>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {Object.entries(characters).map(([id, char]) => (
                    <div
                      key={id}
                      onClick={() => setSelectedCharacter(id)}
                      className={`cursor-pointer rounded-lg border p-4 ${
                        selectedCharacter === id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200"
                      }`}
                    >
                      <h3 className="font-medium">{char.name}</h3>
                      <p className="text-sm text-gray-500">
                        {char.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 h-[400px] overflow-y-auto rounded-lg bg-white p-4 shadow-lg">
          {conversation.length === 0 && (
            <div className="flex h-full items-center justify-center text-center text-gray-500">
              <div>
                <p className="mb-2 text-xl font-medium">
                  {characters[selectedCharacter].greeting}
                </p>
                <p>Ask me anything about Python programming!</p>
              </div>
            </div>
          )}
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 mt-3 ${
                  msg.role === "user" ? "bg-purple-100" : "bg-white"
                }`}
              >
                {msg.role === "user" && (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
                {msg.role === "assistant" && (
                  <div className="flex-col">
                    {msg.code === null ? (
                      <div className="whitespace-pre-wrap bg-gray-100 p-2 pl-4 pr-3 rounded-lg text-left">
                        {msg.content}
                      </div>
                    ) : (
                      <CodeDisplay
                        key={idx}
                        code={msg.code}
                        handleCopy={handleCopy}
                      />
                    )}
                    <div className="mt-3 ml-1 flex items-center justify-between">
                      <div className="flex gap-3">
                        <button
                          onClick={() => fillLikeColor(idx)}
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500"
                          title="Like"
                        >
                          {conversation[idx].likes ? (
                            <BiSolidLike size={16} color="#8c8c8c" />
                          ) : (
                            <ThumbsUp size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => fillDislikeColor(idx)}
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500"
                          title="Dislike"
                        >
                          {conversation[idx].dislikes ? (
                            <BiSolidDislike size={16} color="#8c8c8c" />
                          ) : (
                            <ThumbsDown size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-white p-4">
                <div className="flex items-center bg-gray-100 p-2 pl-3 pr-3 rounded-lg space-x-2">
                  <BeatLoader
                    color="gray"
                    margin={4}
                    size={9}
                    speedMultiplier={0.8}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about Python..."
            className="flex-1 rounded-lg border border-gray-300 p-4 shadow-sm focus:border-purple-500 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            <SendHorizontal size={24} />
          </button>
        </div>
      </div>

      {copied && (
        <Alert className="fixed bottom-4 right-4 bg-green-100">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Code copied to clipboard!</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PythonTutor;
