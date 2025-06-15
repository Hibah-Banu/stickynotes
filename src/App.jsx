import { useState, useEffect } from "react";

function App() {
  const [stickyn, Setstickyn] = useState(() => {
    const savedNotes = localStorage.getItem('sticky-notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [content, Setcontent] = useState('');
  const [heading, Setheading] = useState('');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  // Pastel color for n otes
  const pastelColors = [
    'bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200',
    'bg-purple-200', 'bg-indigo-200', 'bg-teal-200', 'bg-orange-200',
    'bg-red-200', 'bg-amber-200', 'bg-lime-200', 'bg-emerald-200',
    'bg-cyan-200', 'bg-sky-200', 'bg-violet-200', 'bg-fuchsia-200',
    'bg-rose-200'
  ];

  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(stickyn));
  }, [stickyn]);

  // Getting random pastel color
  const getRandomColor = () => {
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
  };

  //enter key
  const enterSave = () => {
    if (!heading && !content) return;

    if (editId !== null) {
      const new_n = stickyn.map(note =>
        note.id === editId ? { ...note, heading, content } : note
      );
      Setstickyn(new_n);
      setEditId(null);
    } else {
      const newNote = {
        id: Date.now(),
        heading: heading,
        content: content,
        color: getRandomColor(),
        datestamp: new Date().toLocaleDateString(),
        timestamp: new Date().toLocaleTimeString(
          "en-GB",{
              hour: "numeric",
              minute: "2-digit",
              hour12: true
          }
        )
      };
      Setstickyn([...stickyn, newNote]);
    }
    Setheading('');
    Setcontent('');
  };

  const onEnter = (e) => {
    if (e.key === "Enter" && (heading.trim() || content.trim())) {
      enterSave();
    }
  };

  //del note
  function delete_n(note_Id) {
    const new_n = stickyn.filter(n => n.id !== note_Id);
    Setstickyn(new_n);
  }

  //search note
  const searchNotes = stickyn.filter(note => {
    return (
      note.heading.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-200">
    <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-cyan-900 font-extrabold text-5xl text-center mb-8">Sticky Notes</h1>
        
        {/* Input*/}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Title</label>
              <input 
                type="text" 
                placeholder="Note title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={heading}
                onChange={(e) => Setheading(e.target.value)}
                onKeyDown={onEnter}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Content</label>
              <textarea
                placeholder="Write your note here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                value={content}
                onChange={(e) => Setcontent(e.target.value)}
              />
            </div>

            <button 
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              onClick={enterSave}
            >
              {editId !== null ? "Update Note" : "Save Note"}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input 
            type="text"
            placeholder="Search notes throughtitle or content"
            className="w-full px-4 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Notes sectn */}
        {searchNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchNotes.map(note => (
              <div 
                key={note.id} 
                className={`${note.color || 'bg-yellow-200'} p-6 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition duration-200 min-h-[200px] flex flex-col`}
              >
                <div className="mb-2">
                  <p className="text-xs text-gray-600">{note.datestamp} • {note.timestamp}</p>
                </div>
                <h2 className="font-bold text-xl mb-2 text-gray-800">{note.heading}</h2>
                <p className="text-gray-700 flex-grow">{note.content}</p>
                
                <div className="mt-4 flex space-x-2">
                  <button 
                    className="bg-teal-500 hover:bg-teal-600 text-white text-sm py-1 px-3 rounded transition duration-200"
                    onClick={() => delete_n(note.id)}
                  > 
                    Delete
                  </button>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded transition duration-200"
                    onClick={() => {
                      setEditId(note.id);
                      Setheading(note.heading);
                      Setcontent(note.content);
                    }}
                  > 
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No notes found. Create your first note above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;