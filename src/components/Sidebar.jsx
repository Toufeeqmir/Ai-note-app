import { Search, StickyNote } from "lucide-react";
import { useNotes } from "../context/NotesContext";
import NoteCard from "./NoteCard";

const Sidebar = ({ onSelectNote }) => {
  const { notes, searchQuery, setSearchQuery } = useNotes();

  const pinnedNotes = notes.filter((note) => note.pinned);
  const unpinnedNotes = notes.filter((note) => !note.pinned);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          My Notes
          <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-600 dark:bg-violet-900/40 dark:text-violet-300">
            {notes.length}
          </span>
        </h2>

        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-transparent bg-slate-100 py-2 pr-4 pl-9 text-sm text-slate-700 transition-all duration-200 placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:outline-none dark:bg-slate-800 dark:text-slate-300 dark:focus:border-violet-600 dark:focus:bg-slate-700"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {notes.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <StickyNote size={40} className="mb-3 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
              No notes yet
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">
              Click "New Note" to get started
            </p>
          </div>
        )}

        {notes.length > 0 &&
          searchQuery &&
          pinnedNotes.length === 0 &&
          unpinnedNotes.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <Search size={40} className="mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium text-slate-400 dark:text-slate-500">
                No results found
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-600">
                Try a different search term
              </p>
            </div>
          )}

        {pinnedNotes.length > 0 && (
          <div className="mb-3">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Pinned
            </p>
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} onSelect={onSelectNote} />
            ))}
          </div>
        )}

        {unpinnedNotes.length > 0 && (
          <div>
            {pinnedNotes.length > 0 && (
              <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                All Notes
              </p>
            )}
            {unpinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} onSelect={onSelectNote} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
