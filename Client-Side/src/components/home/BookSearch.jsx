import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Markdown from "react-markdown";
import Spinner from "../Spinner";
import axios from "axios";
const BookSearch = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const analyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5555/books/analyze", {
        query: prompt,
      });
      setResponse(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setResponse("Failed to fetch data.");
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="flex flex-row w-40 px-4 justify-between items-center mr-[46%] cursor-pointer bg-[#86e7ff] h-8 rounded-lg"
        onClick={() => setShowSearchModal(true)}
      >
        <FaSearch />
        <p className="ml-1 text-sm">Analyze with AI</p>
      </div>

      {/* show the search modal */}
      {showSearchModal && (
        <div
          className="bg-black bg-opacity-60 fixed top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="bg-white rounded-xl p-4 w-[800px] h-[550px] max-w-full flex flex-col relative"
          >
            <div className="flex flex-row justify-between items-center h-[15%] w-full">
              <div className="flex flex-row items-center  justify-between gap-2 w-[80%] h-full mt-4">
                {" "}
                <textarea
                  name="search"
                  className="border-[#a3a3a3] border rounded-lg h-10 resize-none w-full ml-6 px-2 text-sm"
                  placeholder="Enter your prompt here"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
                <button
                  onClick={analyze}
                  className="text-sm bg-teal-500 rounded-lg h-8 p-1"
                >
                  Submit
                </button>
              </div>
              <div>
                <AiOutlineClose
                  className="w-full h-full text-xl text-red-600 cursor-pointer"
                  onClick={() => setShowSearchModal(false)}
                />
              </div>
            </div>
            <div className="flex flex-col justify-start items-start w-full h-[95%] my-2 p-6 text-justify overflow-auto">
              {loading && <Spinner />}

              <Markdown>{response}</Markdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookSearch;
