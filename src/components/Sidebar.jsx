import { Search, StickyNote } from "lucide-react";
import { useNotes } from "../context/NotesContext";
import NoteCard from "../components/NoteCard";

const Sidebar = () => {
  const { notes, searchQuery, setSearchQuery } = useNotes();

  const pinnedNotes = notes.filter((note) => note.pinned);
  const unpinnedNotes = notes.filter((note) => !note.pinned);

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
          My Notes
          <span className="ml-2 bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 text-xs px-2 py-0.5 rounded-full font-medium">
            {notes.length}
          </span>
        </h2>

        {/* Search Bar */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 placeholder-gray-400 rounded-lg border border-transparent focus:border-violet-300 dark:focus:border-violet-600 focus:outline-none focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-3">

        {/* Empty State */}
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <StickyNote size={40} className="text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
              No notes yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Click "New Note" to get started
            </p>
          </div>
        )}

        {/* No Search Results */}
        {notes.length > 0 && searchQuery && pinnedNotes.length === 0 && unpinnedNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Search size={40} className="text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
              No results found
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Try a different search term
            </p>
          </div>
        )}

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">
              📌 Pinned
            </p>
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}

        {/* All Notes */}
        {unpinnedNotes.length > 0 && (
          <div>
            {pinnedNotes.length > 0 && (
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">
                 All Notes
              </p>
            )}
            {unpinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Sidebar;