import { createBrowserRouter } from "react-router-dom";
import Nav from "../layouts/navbar";
import Admin from "../pages/admin";
import Advert from "../pages/advert";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import '/Users/cagataydalaman/Desktop/sahibinden/src/style/style.scss';
import Provider from "../context";
import AdvertDetail from "../pages/advertDetail";
import Profile from "../pages/profile";
import CategoryDetail from "../pages/categoryDetail";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Provider>
        <Nav />
      </Provider>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/admin123",
        element: <Admin />,
      },
      {
        path: "/post-advert",
        element: <Advert />,
      },
      {
        path:"/adverts/:advertId",
        element:<AdvertDetail/>

      },
      {
        path:"/profile/adverts/:advertId",
        element:<AdvertDetail/>

      },
      {
        path:"/Profile",
        element:<Profile/>

      },
      {
        path:"/category/:id",
        element:<CategoryDetail/>

      }
    ],
  },
]);

export default routes;
