import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 500, margin: "60px auto", textAlign: "center" }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name}!</p>
      <p>Email: {user?.email}</p>
      <button onClick={handleLogout} style={{ padding: 10 }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
