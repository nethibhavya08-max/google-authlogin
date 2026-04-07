import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const login = async (cred: any) => {
    const res = await api.post("/auth/google", {
      token: cred.credential,
    });

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    console.log(".................login successful");

    navigate("/home"); // ✅ redirect
  };

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>Login</h2>
      <GoogleLogin onSuccess={login} onError={() => alert("Error")} />
    </div>
  );
};

export default Login;