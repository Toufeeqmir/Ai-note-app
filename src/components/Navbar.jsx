import {PenSquare , Moon , Sun, NotebookPen} from "lucide-react";
import {useState} from "react";
import {useNotes} from "../context/NotesContext";

const Navbar = () =>{
    const { addNote } = useNotes();
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () =>{
         setDarkMode(!darkMode);

         document.documentElement.classList.toggle("dark");

    };

    return(
        <nav className="w-full h-16 bg-white dark: bg-gray-900 border-gray-200 dark:-gray-700 flex items-center justify-between px-6 shadow-sm fixed top-0 left-0 z-50">

            {/* Logo */}
            <div className="flex-items-center gap-2">
                <NotebookPen className="tet-violet-500" size={20}/>
                <span className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">AI <span className="text-violet-500">Notes</span>
                </span>
            </div>

            {/* Right Side Actions */}
            <div className="flex-items-center gap-3">

                <button
                onClick={addNote}
                className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"><PenSquare size={16}/> New Note</button>

                  {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

            </div>
        </nav>
    )
};

export default Navbar;