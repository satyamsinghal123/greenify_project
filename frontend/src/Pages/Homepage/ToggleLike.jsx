import axios from "axios";

export const toggleLike = async (postId) => {
  const token = sessionStorage.getItem("token");

  const res = await axios.post(
    `http://localhost:8080/api/posts/like/${postId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
