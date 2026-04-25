import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import NoteEditor from "./components/NoteEditor.jsx";
import AIPanel from "./components/AIPanel.jsx";
import { NotesProvider } from "./context/NotesContext.jsx";

const App = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAiPanel, setShowAIPanel] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  return (
    <NotesProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
        <Navbar onToggleSidebar={() => setShowSidebar((prev) => !prev)} />

        <div className="relative flex min-h-[calc(100vh-4rem)] pt-16">
          {showSidebar && (
            <button
              type="button"
              aria-label="Close notes panel"
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden"
            />
          )}

          <aside
            className={`fixed inset-y-16 left-0 z-40 w-[88vw] max-w-sm border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:static lg:inset-auto lg:z-0 lg:w-80 lg:max-w-none lg:translate-x-0 lg:shadow-none ${
              showSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar onSelectNote={() => setShowSidebar(false)} />
          </aside>

          <main className="min-w-0 flex-1 overflow-y-auto">
            <NoteEditor
              setShowAIPanel={setShowAIPanel}
              setAiResult={setAiResult}
              setAiLoading={setAiLoading}
            />
          </main>

          {showAiPanel && (
            <>
              <button
                type="button"
                aria-label="Close AI panel"
                onClick={() => setShowAIPanel(false)}
                className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm xl:hidden"
              />
              <aside className="fixed inset-x-0 bottom-0 z-40 h-[78vh] rounded-t-3xl border-t border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 xl:static xl:inset-auto xl:h-auto xl:w-96 xl:min-w-96 xl:rounded-none xl:border-t-0 xl:border-l xl:shadow-none">
                <AIPanel
                  result={aiResult}
                  loading={aiLoading}
                  onClose={() => setShowAIPanel(false)}
                />
              </aside>
            </>
          )}
        </div>
      </div>
    </NotesProvider>
  );
};

export default App;
