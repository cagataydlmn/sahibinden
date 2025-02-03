import { useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../../layouts/loading";
import ProfileAdverts from "../profileAdverts";
import ProfileFavourites from "../profileFavourites";
import ProfileMessages from "../profileMessages";
import ProfileSell from "../profileSell";
import ProfileSettings from "../profileSettings";

export default function Profile() {
  const [activeComponent, setActiveComponent] = useState("İlanlarım");
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    localStorage.removeItem("user");
    document.location.href = "/";
  };
  const components = {
    İlanlarım: <ProfileAdverts />,
    Sattıklarım: <ProfileSell />,
    Ayarlar: <ProfileSettings />,
    Mesajlar: <ProfileMessages />,
    Favoriler: <ProfileFavourites />,
    deneme: <Loading />,
  };

  return (
    <div
      style={{
        display: "flex",
        maxHeight: "100vh",
        justifyContent: "space-between",
      }}
    >
      
      <div style={{
            listStyle: "none",
            padding: 0,
            width: "200px",
            borderRight: "1px solid #ccc",
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-between"
          }}>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            width: "200px",
          }}
        >
          {Object.keys(components).map((item) => (
            <li
              key={item}
              onClick={() => setActiveComponent(item)}
              style={{
                padding: "10px",
                margin: "5px 0",
                backgroundColor:
                  activeComponent === item ? "gray" : "transparent",
                color: activeComponent === item ? "white" : "black",
                cursor: "pointer",
                borderRadius: "4px",
              }}
            >
              {item}
            </li>
          ))}
        </ul>
        {user ? (
                 <button  style={{
                  margin: "450px 0 0 0",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",               
                }} onClick={logout} to="/">çıkış yap</button>
          ) : (
            <div className="nav__general__right">
            
            </div>
          )}
     
      </div>

      <div style={{ flex: 1, padding: "20px" }}>
        {components[activeComponent]}
      </div>
    </div>
  );
}
