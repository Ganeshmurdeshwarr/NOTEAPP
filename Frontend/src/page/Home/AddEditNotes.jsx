import React, { useState } from "react";
import TagInput from "../../components/Input/Taginput";
import { MdClose } from "react-icons/md";
import  axiosInstance  from '../../utils/axiosInstance'


const AddEditNotes = ({ onClose, noteData ,getAllNotes, type }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);

const [error , setError] = useState(null);


//add Note

const addNewNote = async () => {
  console.log("addNewNote CALLED");

  try {
    console.log("SENDING NOTE DATA", { title, content, tags });

    const response = await axiosInstance.post(
      "/add-note",
      {
        title,
        content,
        tags: Array.isArray(tags) ? tags : [],
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data?.note) {
      getAllNotes();
      onClose();
    }
  } catch (error) {
    console.error("ADD NOTE ERROR:", error);
    setError(error.response?.data?.message || "Add note failed");
  }
};



//edit Note
const editNote = async ()=>{
  const noteId = noteData._id
try{
  const res = await axiosInstance.put(`/edit-note/${noteId}`,{
    title,
    content,
    tags,
  })
  if(res.data && res.data.note){
    getAllNotes()
    onClose()
  }
 }catch(error){
   if(error.res && error.res.data && error.res.data.message){
    setError(error.res.data.message)
   }
 }
}

const handleAddNote = () => {
  console.log('clicked')
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
      <button className="btn-primary font-medium mt-5 p-3 " onClick={ handleAddNote}>
        {type === 'edit' ? 'UPDATE' : 'ADD'}
      </button>
    </div>
  );
};

export default AddEditNotes;
