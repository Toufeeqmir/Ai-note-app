import { createContext , useContext, useState, useEffect} from "react";
import {v4 as uuidv4} from "uuid";

const NotesContext = createContext();

export const NotesProvider = ({ children })  =>{
    const [notes, setNotes] = useState(() =>{
        const saved = localStorage.getItem("ai-notes");
        return saved? JSON.parse(saved) :[];

    });
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

       // Save to localStorage Whenever Notes Change

       useEffect(() =>{
        localStorage.setItem("ai-notes", JSON.stringify(notes));
       }, [notes]);
       
       //create new note

       const addNote =() =>{
        const newNote = {


         id: uuidv4(),
         title : "Untitled Note",
         content : "",
         tags : [],
         pinned : false,
         createdAt:  new Date().toISOString(),
         updatedAt : new Date().toISOString()

       };

       setNotes((prev)=> [newNote, ...prev]);
       setActiveNoteId(newNote.id);
};
//update existing note
      const updateNote = (id , updates) =>{
         setNotes((prev) =>
         prev.map((note) =>
            note.id === id
         ? {...note , ...updates, updatedAt: new Date().toISOString()
         }
         : note
        )
    )

      };

      //Delete Note
      const deleteNote = (id) =>{
        setNotes((prev) => prev.filter((note) => note.id !==id));
        if(activeNoteId === id) setActiveNoteId(null);
      };

      //Pin/unpin note
      const togglePin = (id) =>{
        setNotes((prev) =>
        prev.map((note) =>
         note.id === id? {...note, pinned: !note.pinned} : note
        )
    );
      };

      //Get active note
     const activeNote = notes.find((note) => note.id === activeNoteId) || null;

  // Filtered notes based on search
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  //Pinned Notes on top
  const sortedNotes = [
     ...filteredNotes.filter((n) => n.pinned),
     ...filteredNotes.filter((n) => !n.pinned),
  ];

  return(
     <NotesContext.Provider
      value = {{
        notes: sortedNotes,
        activeNote,
        activeNoteId,
        searchQuery,
        setActiveNoteId,
        setSearchQuery,
        addNote,
        updateNote,
        deleteNote,
        togglePin,
      }}
     >
         {children}
     </NotesContext.Provider>
  )

};

export const useNotes = () => useContext(NotesContext);

