import { Route, Routes } from 'react-router-dom'
import Login from '@/pages/Login.jsx'
import Register from "@/pages/Register.jsx";
import useAuth from "@/hooks/useAuth.jsx";
import Home from "@/pages/main/Home.jsx";

const AnimatedRoutes = () => {
    // useAuth();

    return (
        <Routes>
            <Route index path="login" element={<Login/>} />
            <Route path="register" element={<Register/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
    )
}

export default AnimatedRoutes
