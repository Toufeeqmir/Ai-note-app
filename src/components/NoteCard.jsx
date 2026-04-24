import {Pin, Trash2 , Clock} from "lucide-react";
import {useNotes} from "../context/NotesContext";

const NoteCard = ({ note }) =>{
    const {activeNoteId, setActiveNoteId, deleteNote, togglePin} = useNotes();

    const isActive = activeNoteId === note.id;

    //format data nicely

    const formatDate = (isoString) =>{
        const date = new Date(isoString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: 'numeric',
        });
    };

    //show preview of content

    const contentPreview = note.content 
    ? note.content.substring(0, 80) + (note.content.length > 80 ? "...": "") : "No content yet ...";

      return (
    <div
      onClick={() => setActiveNoteId(note.id)}
      className={`group relative p-4 rounded-xl cursor-pointer border transition-all duration-200 mb-2
        ${isActive
          ? "bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-600"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-violet-200 dark:hover:border-violet-700 hover:shadow-sm"
        }`}
    >
      {/* Pin Badge */}
      {note.pinned && (
        <span className="absolute top-2 right-2 text-violet-400">
          <Pin size={14} fill="currentColor" />
        </span>
      )}

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate pr-6">
        {note.title || "Untitled Note"}
      </h3>

      {/* Content Preview */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
        {contentPreview}
      </p>

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer — Date & Actions */}
      <div className="flex items-center justify-between mt-3">

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <Clock size={11} />
          <span>{formatDate(note.updatedAt)}</span>
        </div>

        {/* Action Buttons - show on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

          {/* Pin Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePin(note.id);
            }}
            className={`p-1.5 rounded-lg transition-colors duration-200
              ${note.pinned
                ? "text-violet-500 bg-violet-100 dark:bg-violet-900/40"
                : "text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20"
              }`}
          >
            <Pin size={13} />
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNote(note.id);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
          >
            <Trash2 size={13} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default NoteCard
