import { Share2, Copy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

const CodeDisplay = ({ code, handleCopy }) => {
  const handleShare = (code) => {
    navigator
      .share({
        title: "Python Code",
        text: code,
      })
      .catch(() => {
        handleCopy(code);
      });
  };

  return code ? (
    <div className="mt-4 space-y-4">
      <Card className="bg-gray-50">
        <CardHeader className="flex flex-row items-center justify-between bg-gray-100 p-4">
          <CardTitle className="text-sm font-medium">Python Code</CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(code)}
              className="rounded-full p-2 hover:bg-gray-200"
              title="Copy code"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={() => handleShare(code)}
              className="rounded-full p-2 hover:bg-gray-200"
              title="Share code"
            >
              <Share2 size={16} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-white">
            <code>{code}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  ) : null;
};

export default CodeDisplay;
