import { createBrowserRouter } from "react-router-dom";
import Nav from "../layouts/navbar";
import Admin from "../pages/admin";
import Advert from "../pages/advert";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import "../style/style.scss";
import Provider from "../context";
import AdvertDetail from "../pages/advertDetail";
import Profile from "../pages/profile";
import ChatPage from "../pages/profileMessages";
import SubCategoryDetail from "../pages/subCategoryDetail";
import DetailCategory from "../pages/detailCategory";
import TempCategoryDetail from "../pages/tempCategory";
import MoreDetailCategory from "../pages/moreDetailCategory";
import MobileNav from "../layouts/mobileNav";
import MobileNavBottom from "../layouts/mobileNavBottom";
import CategoriesMobile from "../layouts/categoriesMobile";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Provider>
        <Nav />
        <MobileNav/>
        <MobileNavBottom/>
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
        path: "/adverts/:advertId",
        element: <AdvertDetail />,
      },
      {
        path: "/profile/adverts/:advertId",
        element: <AdvertDetail />,
      },
      {
        path: "/Profile",
        element: <Profile />,
      },
      {
        path: "/category/:id",
        element: <TempCategoryDetail />,
      },
      {
        path: "/chat/:advertId",
        element: <ChatPage />,
      },
      { path: "/category/:id/sub/:subCategoryId", element: <SubCategoryDetail /> },
      { path: "/category/:id/sub/:subCategoryId/detail/:detailId", element: <DetailCategory /> },
      { path: "/category/:id/sub/:subCategoryId/detail/:detailId/moredetail/:moreDetailId", element: <MoreDetailCategory /> },
      {
        path: "/messages/:chatId",
        element: <ChatPage />,
      },
      {
        path:"/messages",
        element:<ChatPage/>
      },
      {
        path:"/category",
        element:<CategoriesMobile/>
      }
    ],
  },
]);

export default routes;
