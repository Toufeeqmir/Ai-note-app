import {X , Sparkles , Copy , Check} from "lucide-react";
import { useState } from "react";

const AIPanel = ({result , loading, onClose}) =>{
    const [copied , setCopied] = useState(false);

    //copy result to copyboard
    const handleCopy = () =>{
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

   
  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-violet-500" />
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
            AI Result
          </h2>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              AI is thinking...
            </p>
          </div>
        )}

        {/* Result */}
        {!loading && result && (
          <div>
            {/* Copy Button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-violet-500 transition-colors duration-200"
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

            {/* Result Text */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !result && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Sparkles size={40} className="text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
              No AI result yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Use the AI tools in the editor to get results
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AIPanel;