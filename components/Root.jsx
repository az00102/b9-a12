// src/components/Root.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
const Root = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Root;