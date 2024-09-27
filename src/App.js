import './App.css';
import Login from './Pages/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import Signup from './Pages/Signup';
import Profile from './Pages/Profile';
import Dashboard from './Componets/Dashborad';
import Changepassword from './Pages/Changepassword';
import Forgotpassword from './Pages/Forgotpassword';
import Updateprofile from './Pages/Updateprofile';
import Chat from './Componets/Chat';

function App() {

  const isAuth = localStorage.getItem('isloggedIn')

  return (
    <div className="App">
      <Routes>
        {isAuth ? (
          <>
            {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/Change-password" element={<Changepassword />} />
            <Route path="/profile" element={<Profile />} /> 
            <Route path="/update-profile" element={<Updateprofile />} />
            <Route path="/chat/:id" element={<Chat   />} />
            <Route path="*" element={<Navigate to="/dashboard" />} /> {/* Fallback route */}
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<Forgotpassword />} />
            <Route path="*" element={<Navigate to="/login" />} /> {/* Fallback route */}
            
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
