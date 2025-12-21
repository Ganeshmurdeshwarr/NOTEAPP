import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });



  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch , setIsSearch] =useState(false)

  const handleEdit = (noteDetails)=>{
    setOpenAddEditModal({isShown:true , data:noteDetails,type:'edit'})
  }

  //get  user info
  const getUserInfo = async () => {
    try {
      const res = await axiosInstance.get("/get-user");
      if (res.data && res.data.user) {
        setUserInfo(res.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all Notes

  const getAllNotes = async () => {
    try {
      const res = await axiosInstance.get("/get-all-notes");
      if (res.data && res.data.notes) {
        setAllNotes(res.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred .Please try agian.", error);
    }
  };

//DELETE NOTE

const deleteNote = async(data)=>{
    const noteId = data._id

  try{
  const res = await axiosInstance.delete(`/delete-note/${noteId}` ,{
     headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  })
  if(res.data && !res.data.error){
    getAllNotes()
  }
 }catch(error){
   if(error?.response?.data?.message){
    console.log("An unexpected error occurred .Please try agian.")
    console.log(error.response.data.message)
   }
 }

}

//Search for note

const onSearchNote = async (query) => {
  if (!query?.trim()) {
    setIsSearch(false);
    getAllNotes();
    return;
  }

  try {
    const res = await axiosInstance.get('/search-note', {
      params: { query },
    });

    if (res.data?.error === false) {
      setIsSearch(true);
      setAllNotes(res.data.notes);
    }
  } catch (error) {
    console.log(error.response?.data || error);
  }
};


const handleClearSearch = ()=>{
 setIsSearch(false)
 getAllNotes()
}

const updateIsPinned = async(noteData)=>{
  const noteId = noteData._id
  try{
  const res = await axiosInstance.put(`/update-note-pinned/${noteId}`,{
    isPinned :!noteData.isPinned
  })
  if(res.data && res.data.note){
    getAllNotes()
  }
 }catch(error){
 console.log(error)
   }
 }



  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-2 mt-8">
          {allNotes.map((note) => (
            <NoteCard
            key={note._id}
              title={note.title}
              date={note.createdOn}
              content={note.content}
              tags={note.tags}
              isPinned={note.isPinned}
              onEdit={() => handleEdit(note)}
              onDelete={() =>deleteNote(note)}
              onPinNote={() => updateIsPinned(note)}
            />
          ))}
        </div>
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onREquestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.25)",
          },
        }}
        contentLable=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
        />
      </Modal>
        
     
    </>
  );
};

export default Home;
