import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes/AppRoutes.tsx";
import "./App.css"
function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <AppRoutes />
    </>
  );
}

export default App;
