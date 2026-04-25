import { useEffect, useState } from "react";
import { useNotes } from "../context/NotesContext";
import {
  summarizeNote,
  cleanupNote,
  generateTags,
  generateTitle,
} from "../utils/aiHelper";
import { Sparkles, Wand2, Tag, Type, FileText } from "lucide-react";

const NoteEditor = ({ setShowAIPanel, setAiResult, setAiLoading }) => {
  const { activeNote, updateNote } = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
    }
  }, [activeNote?.id]);

  useEffect(() => {
    if (!activeNote) return;

    const timeout = setTimeout(() => {
      updateNote(activeNote.id, { title, content });
    }, 500);

    return () => clearTimeout(timeout);
  }, [activeNote, title, content, updateNote]);

  const handleAI = async (action) => {
    if (!activeNote) return;

    setShowAIPanel(true);
    setAiLoading(true);
    setAiResult("");

    try {
      let result = "";

      if (action === "summarize") result = await summarizeNote(content);
      if (action === "cleanup") result = await cleanupNote(content);
      if (action === "tags") {
        const tags = await generateTags(content);
        updateNote(activeNote.id, { tags });
        result = `Tags added: ${tags.map((tag) => `#${tag}`).join(", ")}`;
      }
      if (action === "title") {
        const newTitle = await generateTitle(content);
        setTitle(newTitle);
        updateNote(activeNote.id, { title: newTitle });
        result = `Title updated to: "${newTitle}"`;
      }

      setAiResult(result);
    } catch (error) {
      setAiResult(`Error: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  if (!activeNote) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
        <FileText size={50} className="mb-4 text-slate-300 dark:text-slate-600" />
        <h2 className="text-lg font-semibold text-slate-400 dark:text-slate-500">
          No Note Selected
        </h2>
        <p className="mt-1 max-w-sm text-sm text-slate-400 dark:text-slate-600">
          Select a note from the sidebar or create a new one
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
        <span className="mr-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          AI Tools:
        </span>

        <button
          onClick={() => handleAI("summarize")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-violet-50 px-3 py-2 text-xs font-medium text-violet-600 transition-all duration-200 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/40"
        >
          <Sparkles size={13} />
          Summarize
        </button>

        <button
          onClick={() => handleAI("cleanup")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600 transition-all duration-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
        >
          <Wand2 size={13} />
          Clean Up
        </button>

        <button
          onClick={() => handleAI("tags")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-green-50 px-3 py-2 text-xs font-medium text-green-600 transition-all duration-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/40"
        >
          <Tag size={13} />
          Auto Tags
        </button>

        <button
          onClick={() => handleAI("title")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-2 text-xs font-medium text-orange-600 transition-all duration-200 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/40"
        >
          <Type size={13} />
          Gen Title
        </button>
      </div>

      <div className="bg-white px-4 pt-5 pb-2 dark:bg-slate-900 sm:px-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full bg-transparent text-2xl font-bold text-slate-800 outline-none placeholder:text-slate-300 dark:text-white dark:placeholder:text-slate-600 sm:text-3xl"
        />
      </div>

      {activeNote.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 bg-white px-4 pb-3 dark:bg-slate-900 sm:px-6">
          {activeNote.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-600 dark:bg-violet-900/40 dark:text-violet-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mx-4 h-px bg-slate-100 dark:bg-slate-800 sm:mx-6" />

      <div className="flex-1 bg-white px-4 py-4 dark:bg-slate-900 sm:px-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note here..."
          className="h-full min-h-[45vh] w-full resize-none bg-transparent text-base leading-relaxed text-slate-700 outline-none placeholder:text-slate-300 dark:text-slate-300 dark:placeholder:text-slate-600"
        />
      </div>
    </div>
  );
};

export default NoteEditor;
