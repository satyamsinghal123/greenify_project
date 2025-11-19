import {Routes , BrowserRouter as Router , Route} from 'react-router-dom';
import Landingpage from './Pages/Landingpage/Landingpage';
import Navbar from "./Pages/Navbar/Navbar"
import Signup from "./Pages/Signuppage/Signuppage"
import Login from './Pages/Loginpage/Loginpage'
import LikeButton from './Pages/LikeButton/LikeButton'
import Profile from "./Pages/Profilepage/Profilepage"
import CreatePost from "./Pages/CreatePost/CreatePost"
import Homepage from './Pages/Homepage/Homepage';

function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Landingpage/>}/>
          <Route path="/home" element={<Homepage/>}/>
          <Route path="/likebutton" element={<LikeButton/>}/>

          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/createpost" element={<CreatePost/>}/>
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
