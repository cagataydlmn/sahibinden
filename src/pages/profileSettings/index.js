import { useState } from "react";
import SettingsPassword from "../settingsPassword";
import SettingsPhoto from "../settingsPhoto";

export default function ProfileSettings() {
    const [activeComponent, setActiveComponent] = useState("İlanlarım");
    const [step, setStep] = useState(1);

    const components = {
        "Şifre Değiştir": <SettingsPassword />,
        "Profil fotoğrafı ekle":<SettingsPhoto/>
      };
      const handleCategorySelect = (categoryId) => {
        setActiveComponent(categoryId);
        setStep(2); // İkinci adımda kategoriye tıklandığında içerik değişsin
      };

  return (
    <div className="flex flex-col lg:flex-row">
        {step === 1 && (
      <div className="lg:flex lg:flex-col lg:w-1/4 lg:border-r lg:border-gray-300 lg:h-full p-4 ">
      <ul className="space-y-4 list-none">
      {Object.keys(components).map((item) => (
        <li
          key={item}
          onClick={() => handleCategorySelect(item)}
          className={`cursor-pointer px-4 py-2 rounded-lg ${
            activeComponent === item
              ? "bg-gray-700 text-white"
              : "bg-transparent text-black"
          }`}
        >
          {item}
        </li>
      ))}
   
    </ul>
      </div>
        )}
   
      {step === 2 && (
    <div style={{ flex: 1, padding: "20px" }}>
   
      {components[activeComponent]}
    </div>
      )}
  </div>
  );
}
