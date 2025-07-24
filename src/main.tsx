import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.tsx'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import AuthProvider from "./contexts/AuthContext.tsx";
import UploadCans from "./pages/UploadCans.tsx";
import CanNotificationForm from "./pages/CanNotificationForm.tsx";




createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter> {/* Wrap router first */}
            <AuthProvider> {/* Then use navigate inside */}
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="/Home" element={<Home />} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/UploadCans" element={<UploadCans/>}/>
                    <Route path="/maintenance-form/:canId" element={<CanNotificationForm />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);

