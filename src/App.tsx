import { Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Home from "./pages/Home"
import PrivateRoute from "./__components/PrivateRoute"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadTokenFromStorage } from "@/store/slices/authSlice";
import type { AppDispatch } from "@/store";
import { Toaster } from "sonner";




function App() {

   const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      dispatch(loadTokenFromStorage());
    }, [dispatch]);


  return (
    <>
     <Toaster richColors position="top-center" />

      <Routes>
        <Route path="/login" element={<Login />} />
         <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

     </Routes>
    </>
    
  )
}

export default App