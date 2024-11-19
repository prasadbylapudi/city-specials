import React from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Toastify() {
  const notify = () =>
    toast.success("🦄 Wow so easy!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

  return (
    <div>
      <button onClick={notify}>Notify!</button>
      <ToastContainer />
    </div>
  );
}

export default Toastify;
