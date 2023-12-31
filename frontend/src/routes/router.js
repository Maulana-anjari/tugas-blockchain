import { Suspense, lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";

import DashboardLayout from "../layouts/index.js";

export const Home = lazy(() => import("../pages/dashboard.js"));
// export const AnggotaPage = lazy(() => import("../layouts"));
export const Page404 = lazy(() => import("../pages/404.js"));

export default function Router() {
    const routes = useRoutes([
        {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
        },
        {
            element: (
                <DashboardLayout>
                    <Suspense>
                        <Outlet />
                    </Suspense>
                </DashboardLayout>
            ),
            children: [
                { path: "dashboard", element: <Home />, index: true },
                // { path: "anggota", element: <AnggotaPage /> },
            ],
        },
        {
            path: "404",
            element: <Page404 />,
        },
        {
            path: "*",
            element: <Navigate to="/404" replace />,
        },
    ]);

    return routes;
}