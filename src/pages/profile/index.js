import { useState } from "react";
import { useSelector } from "react-redux";
import Loading from "../../layouts/loading";
import ProfileAdverts from "../profileAdverts";
import ProfileFavourites from "../profileFavourites";
import ProfileSell from "../profileSell";
import ProfileSettings from "../profileSettings";
import {logout} from "../../firebase";

export default function Profile() {
  const [activeComponent, setActiveComponent] = useState("İlanlarım");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);



  const components = {
    İlanlarım: <ProfileAdverts />,
    Sattıklarım: <ProfileSell />,
    Ayarlar: <ProfileSettings />,
    Favoriler: <ProfileFavourites />,
    deneme: <Loading />,
  };
  const handleCategorySelect = (categoryId) => {
    setActiveComponent(categoryId);
    setStep(2);
  };
  const handleBack = () => {
    setStep(1);
  };
  return (
    <div>
      <div className="profile flex flex-col lg:flex-row">
        <div className="flex flex-col lg:w-1/4 lg:border-r lg:border-gray-300 lg:h-full p-4 ">
          <ul className="space-y-4 list-none">
            {Object.keys(components).map((item) => (
              <li
                key={item}
                onClick={() => setActiveComponent(item)}
                className={`cursor-pointer px-4 py-2 rounded-lg ${
                  activeComponent === item
                    ? "bg-gray-700 text-white"
                    : "bg-transparent text-black"
                }`}
              >
                {item}
              </li>
            ))}
            {user ? (
              <button
                onClick={logout}
                className="w-full py-2 mt-4 bg-red-500 text-white rounded-lg"
              >
                Çıkış Yap
              </button>
            ) : (
              <div></div>
            )}
          </ul>
        </div>

        {/* Mobile Menü Butonu */}
        <button
          className="lg:hidden p-4 bg-gray-800 text-white rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          Menü
        </button>
        <div className="flex-1 p-6">{components[activeComponent]}</div>
      </div>
      <div className="profile__mobil">
        <div className="flex flex-col min-h-screen mt-24">
          {step === 1 && (
            <ul className="space-y-4 list-none p-0">
              {Object.keys(components).map((item) => (
                <li
                    key={item}
                    onClick={() => handleCategorySelect(item)}
                  className={`cursor-pointer px-4 py-2 rounded-lg text-lg font-medium ${
                    activeComponent === item
                      ? "bg-gray-800 text-white"
                      : "bg-transparent text-gray-700"
                  }`}
                >
                  {item}
                </li>
              ))}
               <button
              onClick={logout}
              className="w-full py-2 mt-4 bg-red-500 text-white rounded-lg"
            >
              Çıkış Yap
            </button>
            </ul>
          )}

          {step === 2 && (
            <div className="w-full max-w-4xl p-6 flex justify-center items-center">
              <div><button onClick={handleBack}>GERİ</button></div>
              <div className="w-full">{components[activeComponent]}</div>
            </div>
          )}

          
        </div>
      </div>
    </div>
  );
}
