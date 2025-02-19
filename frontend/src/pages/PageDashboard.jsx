import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "../components/user/user-context";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
import Dashboard from "../components/dashboard/Dashboard";
import MyAccount from "../components/myAccount/MyAccount";

const PageDashboard = () => {
    const {user} = useContext(UserContext);

    return (
        <Routes>
            {user ? (
                <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="my-account" element={<MyAccount />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </>
            ) : (
                <>
                    {/* Default to login if no specific route is given */}
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/dashboard/login" replace />} />
                </>
            )}
        </Routes>
    )
}

export default PageDashboard;