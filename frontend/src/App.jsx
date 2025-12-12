import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Landingpage from "./Pages/Landingpage/Landingpage";
import Navbar from "./Pages/Navbar/Navbar";
import Signup from "./Pages/Signuppage/Signuppage";
import Login from "./Pages/Loginpage/Loginpage";
import LikeButton from "./Pages/LikeButton/LikeButton";
import Profile from "./Pages/Profilepage/Profilepage";
import CreatePost from "./Pages/CreatePost/CreatePost";
import Homepage from "./Pages/Homepage/Homepage";
import UserProfile from "./Pages/UserProfile/UserProfile";
import ConversationsPage from "./Pages/ConversationsPage/ConversationsPage";
import DonationPage from "./Pages/DonationPage/DonationPage";
import PaymentPage from "./Pages/PaymentPage/PaymentPage";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/likebutton" element={<LikeButton />} />
          <Route path="/user/:userKey" element={<UserProfile />} />

          {/* WhatsApp-style messages */}
          <Route path="/conversations" element={<ConversationsPage />} />
          <Route path="/messages" element={<ConversationsPage />} />
          
          <Route path="/donation" element={<DonationPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createpost" element={<CreatePost />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
