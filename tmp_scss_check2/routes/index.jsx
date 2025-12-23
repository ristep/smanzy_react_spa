import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';

import { Home, About, Login, Register, Profile, MediaManager, UpdateMedia, NotFound, MediaThumb } from '@/pages';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        errorElement: <NotFound />, // Shows 404 for route errors too
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'media',
                element: <MediaManager />,
            },
            {
                path: 'media/edit/:id',
                element: <UpdateMedia />,
            },
            {
                path: 'mediathumbs',
                element: <MediaThumb />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]);

export default router;
