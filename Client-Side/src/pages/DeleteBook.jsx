import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BackButton from "../components/Backbutton";
import Spinner from "../components/Spinner";

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteBook = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:5555/books/${id}`)
      .then(() => {
        setLoading(false);
        alert("Book deleted");
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        alert("An error happened. Please check console to check the error.");
        console.log(error);
      });
  };
  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl text-red-500 text-center my-4">Danger Zone</h1>
      {loading ? <Spinner /> : ""}
      <div className="flex flex-col items-center border-2 border-red-400 rounded-xl w-[600px] p-8 mx-auto">
        <h3 className="text-2xl text-red-500">
          Are You Sure You Delete This Book?
        </h3>
        <button
          className="p-4 bg-red-600 text-white m-8 w-full rounded-xl"
          onClick={handleDeleteBook}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};
export default DeleteBook;
