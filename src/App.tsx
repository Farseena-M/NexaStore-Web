import { Route, Routes } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        closeButton={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />  
    </div>
  )
}

export default App