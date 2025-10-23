import logo from './logo.svg';
import './App.css';
import  ProfileCardForm from './pages/profileCard';
import ProfileCard from './components/profileCard';
//import Navbar from './components/navbar';
import Loading from './components/loading';
import { UserInfoContext } from './components/userInfoContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import PasswordRecovery from './pages/passwordRecovery';
import Posts from './pages/posts';
import PostPage from './pages/postPage';
import Homepage from './pages/homepage';
import NewPost from './pages/newPost';
import UsersDashboard from './pages/dashboard';
import  ErrorPage  from './pages/errorPage';
import ProtectedRoute from './helpers/checkAuth';
import EditPost from './pages/editPost';
import { LogContext } from './contexts/logStatusContext';
import { AccessTokenContext } from './contexts/accessTokenContext';
import PasswordResetPage from './pages/passwordResetPage';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <UserInfoContext>
          <AccessTokenContext>
          <LogContext>
          <Routes>
            <Route path="/myDashboard/:userId" element={<UsersDashboard />}></Route>
            <Route path="/error" element={<ErrorPage />}></Route>
            <Route path="/newPost" element={<NewPost />}></Route>
            <Route path="/editPost/:postId" element={<EditPost/>}></Route>
            <Route path="/" element={<Homepage />}></Route>
            <Route path="/experiences" element={<Posts />}></Route>
            <Route path="/passwordRecovery" element={<PasswordRecovery />}></Route>
            <Route path="/body/:postId/:userId/:likes/:dislikes" element={<PostPage/>}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/loading" element={<Loading />}></Route>
            <Route path="/reset-password" element={<PasswordResetPage />}></Route>
            
            </Routes>
            </LogContext>
            </AccessTokenContext>
        </UserInfoContext>
      </BrowserRouter>
    </div>
  );
}


export default App;
