import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useState,useEffect} from 'react';
import { useUserCredentialsStore } from "./store/userCredentialsStore";
import { useContextHook } from "./hooks/authContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import DashBoard from "./pages/Dashboard";
import Register from "./pages/Register";
import Logging from "./pages/Loggin";
import NotFound from "./pages/NotFound";

function App() {

  const { user,getUserRole} = useContextHook();

    const {userCredentials} = useUserCredentialsStore();
    
    const [roleAssigned, setRoleAssigned] = useState<string | null>(null);

    useEffect(() => {
      const fetchUserRole = async () => {
          if (userCredentials && userCredentials.user) {
              const fetchedRole = await getUserRole(userCredentials.user.uid);
              console.log("App:" + !!user && fetchedRole === "employee");
              setRoleAssigned(fetchedRole);
          }
      };
  
      fetchUserRole();
  }, [userCredentials, getUserRole]);

  return(
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute isAllowed={!!user} />}>
            <Route path="/" element={
              <ProtectedRoute isAllowed={!!user && roleAssigned === "employee"}>
                <Home />
              </ProtectedRoute>
            }/>
          </Route>
          <Route path="/dashboard" element={<ProtectedRoute isAllowed={!!user} />}>
            <Route path="/dashboard" element={
              <ProtectedRoute isAllowed={!!user && roleAssigned === "hrSpecialist"}>
                <DashBoard />
              </ProtectedRoute>
            }/>
          </Route>
          <Route path="/sign-in" element={<Register />}/>
          <Route path="/sign-up" element={<Logging />}/>
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
