import { useState , useEffect } from "react";
import "../LikeButton/LikeButton.css";
import axios from "axios";
function LikeButton() {
  const [likecount, setLikeCount] = useState(0);
  
  useEffect(() => {
    getLikeCount();
  }, []);
  
  const getLikeCount = async () => {
    let res = await axios.post("http://localhost:8080/likecount");
    setLikeCount(res.data.count);
  };
  
 const likethebutton = async () => {
    const res = await axios.put("http://localhost:8080/likecountincrease");
    setLikeCount(res.data);
  };

  const dislikethebutton = async () => {
    const res = await axios.put("http://localhost:8080/likecountdecrease");
    setLikeCount(res.data);
  };

 

  return (
    <div className="LikeButton-container">
      <button onClick={likethebutton}>Like</button>
      <h1>{likecount}</h1>
      <button onClick={dislikethebutton}>DisLike</button>

    </div>
  );
}

export default LikeButton;
