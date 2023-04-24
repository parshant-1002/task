import React from 'react'
import { auth } from '../firebase';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from '../View/Home';
import Login from '../View/Login';
import Register from '../View/Register';

export default function Router() {
    localStorage.setItem("auth", JSON.stringify(auth))
    const token = (localStorage.getItem("Token"))
    const ProtectedRoute = ({ children }) => {
        if (!token) {
            return <Navigate to="/login" />;
        }
        else {
            return children
        }
    };
    const AuthRoute = ({ children }) => {
        if (token) {
            return <Navigate to="/" />;
        }
        return children
    };
    return (
        <BrowserRouter>
            <Routes>
                <Route>
                    <Route
                        index
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="login"
                        index
                        element={
                            <AuthRoute>
                                <Login />

                            </AuthRoute>
                        }
                    />
                    <Route
                        path="register"
                        index
                        element={
                            <AuthRoute>
                                <Register />

                            </AuthRoute>
                        }
                    />
                    <Route
                        path="*"
                        index
                        element={
                            <ProtectedRoute>
                                <Login />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
