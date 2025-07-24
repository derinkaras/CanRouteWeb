import { useState } from "react";
import icons from "../constants/icons.ts";
import { useAuth } from "../contexts/AuthContext.tsx";

function Home() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loading, login, message } = useAuth();

    const handleClick = async () => {
        try {
            await login(name, email, password);
        } catch (error) {
            console.log("An error occurred in the handle click of the home page: ", error);
        }
    };

    return (
        <div className="bg-lightBlue min-h-screen px-6 md:px-20 py-10 flex flex-col">
            {/* Header */}
            <div className="flex justify-center items-center gap-2 mb-8">
                <img src={icons.can} alt="Can Icon" className="size-6 invert" />
                <h1 className="text-white text-3xl font-bold text-center">CanRoute</h1>
            </div>

            {/* Login Form */}
            <div className="flex flex-col justify-center items-center flex-1 gap-6">
                <h2 className="text-2xl font-bold text-white">Admin Login</h2>
                <div className="bg-darkBlue w-full max-w-md p-6 rounded-2xl shadow-md space-y-5">

                    {/* Name Field */}
                    <div className="flex items-center gap-3 border-b border-gray-400 py-2">
                        <img src={icons.user} alt="User Icon" className="size-5 invert" />
                        <input
                            type="text"
                            placeholder="Admin Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-transparent outline-none text-white flex-1 placeholder-gray-300"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="flex items-center gap-3 border-b border-gray-400 py-2">
                        <img src={icons.mail} alt="User Icon" className="size-5 invert" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-transparent outline-none text-white flex-1 placeholder-gray-300"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex items-center gap-3 border-b border-gray-400 py-2">
                        <img src={icons.lock} alt="Lock Icon" className="size-5 invert" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent outline-none text-white flex-1 placeholder-gray-300"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        className="w-full bg-[#0f6fa2] hover:bg-[#1388c9] text-white font-semibold py-2 rounded-xl transition-all flex justify-center items-center"
                        onClick={handleClick}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        ) : (
                            "Login"
                        )}
                    </button>

                    {/* Optional message feedback */}
                    {message && (
                        <div
                            className={`text-center mt-2 text-sm font-medium ${
                                message.type === "error" ? "text-red-400" : "text-green-400"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
