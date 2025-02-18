import Login from "../components/login/Login";
import Dashboard from "../components/dashboard/Dashboard";
import { useContext } from "react";
import { UserContext } from "../components/user/user-context";


const PageDashboard = () => {
    const {user} = useContext(UserContext);

    return (
        <>
            {user ? <Dashboard /> : <Login />}
        </>
    )
}

export default PageDashboard;