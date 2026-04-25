import { X, Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";

const AIPanel = ({ result, loading, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-violet-500" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-white">
            AI Result
          </h2>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            <p className="text-sm text-slate-400 dark:text-slate-500">
              AI is thinking...
            </p>
          </div>
        )}

        {!loading && result && (
          <div>
            <div className="mb-2 flex justify-end">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-slate-400 transition-colors duration-200 hover:text-violet-500"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    Copy
                  </>
                )}
              </button>
            </div>

            <div className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {result}
            </div>
          </div>
        )}

        {!loading && !result && (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <Sparkles size={40} className="mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
              No AI result yet
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">
              Use the AI tools in the editor to get results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPanel;
