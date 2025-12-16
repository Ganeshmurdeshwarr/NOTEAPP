import React, { useState } from "react";
import TagInput from "../../components/Input/Taginput";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({ onClose, noteData , type }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);

const [error , setError] = useState(null);


//add Note

const addNewNote = async ()=>{

}
//edit Note
const editNote = async ()=>{

}

const handleAddNote = () => {
  if(!title){
    setError('Title is required');
    return;
  }
  if(!content){
    setError('Content is required');
    return;
  }

  setError('')

  if(type === 'edit'){
    editNote();
  }else{
    addNewNote();
  }
}



  return (
    <div className="relative">
      
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -right-3 -top-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-lable">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none "
          placeholder="GO TO GYM AT 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-lable">CONTENT</label>
        <textarea
          type="text"
          className="outline-none  text-xs text-slate-950 bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        ></textarea>
      </div>
      <div className="mt-3">
        <label className="input-lable">Tags</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>
{error && <p className="text-red-500 text-xs pt-4">{error}</p>  }
      <button className="btn-primary font-medium mt-5 p-3 " onClick={() => handleAddNote()}>
        ADD
      </button>
    </div>
  );
};

export default AddEditNotes;
