import {useEffect , useState} from "react";
import {useNotes} from "../context/NotesContext";
import {summarizeNote, cleanupNote, generateTags, generateTitle} from "../utils/aiHelper";
import {Sparkles, Wand2, Tag, Type, FileText} from "lucide-react";

const NoteEditor = ({ setShowAIPanel , setAiResult, setAiLoading}) =>{
  const { activeNote, updateNote} = useNotes();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // when active note changes , update local state
  useEffect(() =>{
    if(activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
    }
  }, [activeNote?.id]);

  //Auto save on every change

  useEffect(() => {
    if(!activeNote) return;
    const timeout = setTimeout(() =>{
      updateNote(activeNote.id, {title, content});

    }, 500);
    return () => clearTimeout(timeout);
  }, [activeNote, title, content, updateNote]);

  //AI action Handler
  const handleAI = async (action) =>{
    if(!activeNote) return;
    setShowAIPanel(true);
    setAiLoading(true);
    setAiResult("");

    try{
      let result = "";
      if(action === "summarize") result = await summarizeNote(content);
      if(action === "cleanup") result = await cleanupNote(content);
      if(action === "tags"){
        const tags = await generateTags(content);
        updateNote(activeNote.id, {tags});
        result = `Tags added: ${tags.map((t) => "#" + t).join(" , ")}`;

      }
      if(action === "title"){
        const newTitle = await generateTitle(content);
        setTitle(newTitle);
        updateNote(activeNote.id, {title: newTitle});
        result = `Title updated to: "${newTitle}"`;
      }

      setAiResult(result);
    }catch(error){
      setAiResult(`Error: ${error.message}`);
    }finally{
      setAiLoading(false);
    }
  };
    // Empty state when no note selected
  if (!activeNote) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <FileText size={50} className="text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-lg font-semibold text-gray-400 dark:text-gray-500">
          No Note Selected
        </h2>
        <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
          Select a note from the sidebar or create a new one
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* AI Action Buttons */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-wrap">
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1">
          AI Tools:
        </span>

        <button
          onClick={() => handleAI("summarize")}
          className="flex items-center gap-1.5 text-xs bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium"
        >
          <Sparkles size={13} />
          Summarize
        </button>

        <button
          onClick={() => handleAI("cleanup")}
          className="flex items-center gap-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium"
        >
          <Wand2 size={13} />
          Clean Up
        </button>

        <button
          onClick={() => handleAI("tags")}
          className="flex items-center gap-1.5 text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/40 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium"
        >
          <Tag size={13} />
          Auto Tags
        </button>

        <button
          onClick={() => handleAI("title")}
          className="flex items-center gap-1.5 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium"
        >
          <Type size={13} />
          Gen Title
        </button>

      </div>

      {/* Title Input */}
      <div className="px-6 pt-6 pb-2 bg-white dark:bg-gray-900">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-2xl font-bold text-gray-800 dark:text-white bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-600"
        />
      </div>

      {/* Tags Display */}
      {activeNote.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 px-6 pb-3 bg-white dark:bg-gray-900">
          {activeNote.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800 mx-6" />

      {/* Content Textarea */}
      <div className="flex-1 px-6 py-4 bg-white dark:bg-gray-900">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note here..."
          className="w-full h-full text-gray-700 dark:text-gray-300 bg-transparent border-none outline-none resize-none text-base leading-relaxed placeholder-gray-300 dark:placeholder-gray-600"
        />
      </div>

    </div>
  );
};

export default NoteEditor;
