import { useState } from "react";
import SettingsPassword from "../settingsPassword";
import SettingsPhoto from "../settingsPhoto";

export default function ProfileSettings() {
    const [activeComponent, setActiveComponent] = useState("İlanlarım");
    const components = {
        "Şifre Değiştir": <SettingsPassword />,
        "Profil fotoğrafı ekle":<SettingsPhoto/>
      };
    
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
    <ul style={{ listStyle: "none", padding: 0, width: "200px", borderRight: "1px solid #ccc" }}>
      {Object.keys(components).map((item) => (
        <li
          key={item}
          onClick={() => setActiveComponent(item)}
          style={{
            padding: "10px",
            margin: "5px 0",
            backgroundColor: activeComponent === item ? "gray" : "transparent",
            color: activeComponent === item ? "white" : "black",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          {item}
        </li>
      ))}
   
    </ul>

    <div style={{ flex: 1, padding: "20px" }}>
      {components[activeComponent]}
    </div>
  </div>
  );
}
