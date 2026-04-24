import { useState } from 'react'
import Navbar from "./components/Navbar.jsx";
import Sidebar from './components/Sidebar.jsx';
import NoteEditor from './components/NoteEditor.jsx';
import AIPanel from './components/AIPanel.jsx';
import { NotesProvider } from './context/NotesContext.jsx';

const App = () => {
  const [showAiPanel, setShowAIPanel] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  return (
    <NotesProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
        
        {/* Top Navbar */}
        <Navbar />

        {/* Main Layout */}
        <div className="flex pt-16 h-screen">

          {/* Left Sidebar */}
          <div className="w-72 min-w-72 h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto">
            <Sidebar />
          </div>

          {/* Middle - Note Editor */}
          <div className="flex-1 h-full overflow-y-auto">
            <NoteEditor
              setShowAIPanel={setShowAIPanel}
              setAiResult={setAiResult}
              setAiLoading={setAiLoading}
            />
          </div>

          {/* Right - AI Panel */}
          {showAiPanel && (
            <div className="w-80 min-w-80 h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto">
              <AIPanel
                result={aiResult}
                loading={aiLoading}
                onClose={() => setShowAIPanel(false)}
              />
            </div>
          )}

        </div>
      </div>
    </NotesProvider>
  );
};

export default App;