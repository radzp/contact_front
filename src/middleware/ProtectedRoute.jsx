import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {AuthContext} from "./AuthContext.jsx";
import {useContext, useEffect, useState} from "react";
import LoadingSpinner from "../components/loadingSpinner/LoadingSpinner.jsx";

export const ProtectedRoute = () => {
    const location = useLocation();
    const { isAuthenticated, checkAuthentication, isLoading: authIsLoading } = useContext(AuthContext);
    const [isCheckAuthenticationCalled, setIsCheckAuthenticationCalled] = useState(false);

    useEffect(() => {
        if (!isCheckAuthenticationCalled) {
            checkAuthentication();
            setIsCheckAuthenticationCalled(true);
        }
    }, [checkAuthentication, isCheckAuthenticationCalled]);

    if (authIsLoading || !isCheckAuthenticationCalled) {
        return <LoadingSpinner />
    }

    return isAuthenticated
        ? <Outlet />
        : <Navigate to="/login" state={{ from: location }} replace />;
};
export default ProtectedRoute;