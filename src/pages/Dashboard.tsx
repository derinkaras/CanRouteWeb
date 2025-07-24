import { useAuth } from "../contexts/AuthContext.tsx";
import icons from "../constants/icons.ts";
import {useNavigate} from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="bg-lightBlue h-screen px-20 py-20">
            <div className="relative flex items-center justify-end">
                {/* Centered heading */}
                <h1 className="absolute left-1/2 -translate-x-1/2 text-white text-3xl font-bold">
                    {user?.name}'s Admin Dashboard
                </h1>

                <button
                    onClick={logout}
                    className="bg-darkBlue px-4 py-2 rounded-md hover:bg-[#225c85] hover:cursor-pointer"
                >
                    <span className="text-white font-semibold text-xl">Logout</span>
                </button>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 mt-10 lg:mx-20">
                <button
                    className="bg-darkBlue text-white flex justify-center items-center rounded-lg h-52 flex flex-col justify-center items-center gap-2 hover:bg-[#225c85] hover:cursor-pointer"
                    onClick={()=> navigate("/UploadCans")}
                >
                    <img
                        src={icons.upload}
                        className="invert h-10 aspect-auto"
                    />
                    <h1 className="text-white font-semibold">Upload cans via CSV file</h1>
                </button>
                <button
                    className="bg-darkBlue text-white flex justify-center items-center rounded-lg h-52 flex flex-col justify-center items-center gap-2 hover:bg-[#225c85] hover:cursor-pointer"
                >
                    <img
                        src={icons.crew}
                        className="invert h-10 aspect-auto"
                    />
                    <h1 className="text-white font-semibold">Manage Crew Members</h1>
                </button>

            </div>

        </div>
    );
};

export default Dashboard;
