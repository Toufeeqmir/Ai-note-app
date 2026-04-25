import { Menu, PenSquare, Moon, Sun, NotebookPen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotes } from "../context/NotesContext";

const Navbar = ({ onToggleSidebar }) => {
  const { addNote } = useNotes();
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <nav className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open notes"
        >
          <Menu size={18} />
        </button>

        <div className="flex items-center gap-2">
          <NotebookPen className="text-violet-500" size={20} />
          <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white sm:text-xl">
            AI <span className="text-violet-500">Notes</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={addNote}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-violet-600 hover:shadow-md sm:px-4"
        >
          <PenSquare size={16} />
          <span className="hidden sm:inline">New Note</span>
        </button>

        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all duration-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
