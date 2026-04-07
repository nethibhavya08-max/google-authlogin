import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

 const getProfile = async () => {
  try {
    const res = await api.get("/profile");
    console.log("PROFILE:", res.data);
    setUser(res.data.user);
  } catch (err) {
    console.log("ERROR:", err);
    navigate("/");
  }
};
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/");
    } else {
      getProfile();
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Welcome</h2>

      {user && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: 20,
            borderRadius: 10,
            display: "inline-block",
          }}
        >
          <img
            src={user.picture}
            alt="profile"
            width={100}
            style={{ borderRadius: "50%" }}
          />

          <h3>{user.name}</h3>
          <p>{user.email}</p>

          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Home;