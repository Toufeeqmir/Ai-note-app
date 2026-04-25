import { Pin, Trash2, Clock } from "lucide-react";
import { useNotes } from "../context/NotesContext";

const NoteCard = ({ note, onSelect }) => {
  const { activeNoteId, setActiveNoteId, deleteNote, togglePin } = useNotes();

  const isActive = activeNoteId === note.id;

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const contentPreview = note.content
    ? note.content.substring(0, 80) + (note.content.length > 80 ? "..." : "")
    : "No content yet...";

  return (
    <div
      onClick={() => {
        setActiveNoteId(note.id);
        onSelect?.();
      }}
      className={`group relative mb-2 cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
        isActive
          ? "border-violet-300 bg-violet-50 dark:border-violet-600 dark:bg-violet-900/20"
          : "border-slate-200 bg-white hover:border-violet-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-700"
      }`}
    >
      {note.pinned && (
        <span className="absolute top-2 right-2 text-violet-400">
          <Pin size={14} fill="currentColor" />
        </span>
      )}

      <h3 className="truncate pr-6 text-sm font-semibold text-slate-800 dark:text-white">
        {note.title || "Untitled Note"}
      </h3>

      <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
        {contentPreview}
      </p>

      {note.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-600 dark:bg-violet-900/40 dark:text-violet-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <Clock size={11} />
          <span>{formatDate(note.updatedAt)}</span>
        </div>

        <div className="flex items-center gap-1 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin(note.id);
            }}
            className={`rounded-lg p-1.5 transition-colors duration-200 ${
              note.pinned
                ? "bg-violet-100 text-violet-500 dark:bg-violet-900/40"
                : "text-slate-400 hover:bg-violet-50 hover:text-violet-500 dark:hover:bg-violet-900/20"
            }`}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
          >
            <Pin size={13} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNote(note.id);
            }}
            className="rounded-lg p-1.5 text-slate-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
            aria-label="Delete note"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
