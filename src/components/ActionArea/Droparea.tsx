"use client";
import React, { useState } from "react";
import ChatArea from "./ChatArea"; // Import ChatArea component

interface EventData {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}
interface MsgItem {
  role: string;
  content: string;
}

const Droparea = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [fileProcessed, setFileProcessed] = useState(false);
  const [jsonData, setJsonData] = useState<EventData | null>(null);
  const [isEvent, setIsEvent] = useState(true);

  const handleCheckboxChange = () => {
    setIsEvent(!isEvent);
    console.log(!isEvent);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  /* 
  1. drop area process button makes function call to gemini 
  2. pass response to chat are component ( json data )
  3. append the json data to the chat component, continue to make calls 

   */

  const processFile = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    console.log("Droparea; ", isEvent);
    formData.append("isEvent", isEvent.toString());
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        //console.log("output");
        const parsedData = JSON.parse(data.text);

        // Log the parsed data to the console
        //console.log(parsedData[0]);
        setJsonData(parsedData); // Pass the data to the parent component
        setFileProcessed(true);
        setIsExpanded(true);
      } else {
        console.error("Failed to upload file");
      }
    } catch (error) {
      console.error("An error occurred while uploading the file", error);
    } finally {
      setLoading(false);
      setFilePreview("");
    }
  };
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const selectedFile = event.dataTransfer.files[0];
    handleFileUpload(selectedFile);
  };

  const handleFileUpload = (selectedFile: File) => {
    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else if (selectedFile.type === "application/pdf") {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          setFilePreview(e.target.result);
        }
      };
      fileReader.readAsDataURL(selectedFile);
    }
    // Simulate a file upload and generate a preview
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col justify-start items-center w-full h-fit">
      {!fileProcessed ? (
        <label
          className={`flex flex-col items-center justify-center transition-all duration-2000 ease-in-out ${
            isExpanded ? "w-full h-screen" : "w-[60%] h-64"
          }  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {loading ? (
              <div className="flex flex-col items-center space-x-2">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : filePreview ? (
              <div className="flex flex-col items-center">
                {file?.type.startsWith("image/") ? (
                  <img
                    src={filePreview}
                    alt="File Preview"
                    className="w-32 h-32 object-cover mb-4"
                  />
                ) : file?.type === "application/pdf" ? (
                  <iframe
                    src={filePreview}
                    className="w-full h-32 mb-4 border"
                    title="PDF Preview"
                  />
                ) : (
                  <p className="text-sm text-gray-500">Unsupported file type</p>
                )}
                <div className="flex items-center justify-between w-full px-4 bg-[#0b7dffd4] py-1 rounded-xl">
                  <p className="text-sm text-white">{file?.name}</p>
                  <button
                    className="text-white ml-4 hover:scale-[1.03]"
                    onClick={handleRemoveFile}
                  >
                    ✖
                  </button>
                </div>
              </div>
            ) : (
              <>
                <svg
                  className="w-8 h-8 mb-4 text-[#0f55d6b8]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold text-[#0f55d6b8]">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOCX, PNG, or JPG</p>
              </>
            )}
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div
          className={`transition-opacity duration-2000 ease-in-out ${
            isExpanded ? "opacity-100 max-h-full" : "opacity-0 max-h-0"
          }`}
        >
          {/* passing isEvent to Chatarea to conditionally render */}
          <ChatArea jsonData={jsonData} isEvent={isEvent} />
        </div>
      )}
      {!fileProcessed && (
        <>
          <div className="flex flex-col mt-4">
            <label className="themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center">
              <input
                type="checkbox"
                checked={isEvent}
                onChange={handleCheckboxChange}
                className="sr-only"
              />
              <span className="label flex items-center text-sm font-medium  text-gray-800">
                Tasks
              </span>
              <span
                className={`slider mx-4 flex h-6 w-[53px] items-center rounded-full p-1 duration-200 ${
                  isEvent ? "bg-gray-800" : "bg-[#CCCCCE]"
                }`}
              >
                <span
                  className={`dot h-4 w-4 rounded-full bg-white duration-200 ${
                    isEvent ? "translate-x-[28px]" : ""
                  }`}
                ></span>
              </span>
              <span className="label flex items-center text-sm font-medium text-gray-800">
                Events
              </span>
            </label>
            <button
              className="btn px-7 rounded-full bg-[#0b7dffd4] text-white transition-all transform active:scale-[0.98] hover:scale-[1.009] mt-5"
              onClick={processFile}
            >
              Process 🪄
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Droparea;
