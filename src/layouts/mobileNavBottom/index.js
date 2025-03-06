import {NavLink} from "react-router-dom";
import defaultProfile from "../../assets/default-profile.jpeg";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default function MobileNavBottom() {
    const {user} = useSelector((state) => state.auth);
    const [profilePhoto, setProfilePhoto] = useState(defaultProfile);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setProfilePhoto(user.photoURL);
            }
        });

        return () => unsubscribe()
    }, []);

    const isInvalidPhoto = profilePhoto && profilePhoto.includes("undefined");
    return (
        <div className="nav__media">
            <div
                className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-xl py-2 flex justify-between items-center z-50 rounded-t-2xl">
                <NavLink to="/">Ana Sayfa</NavLink>
                {user ? (<>
                    <NavLink to="/category">Kategoriler</NavLink>
                    <NavLink to="/profile" className="">
                        <img
                            src={isInvalidPhoto ? defaultProfile : profilePhoto}
                            alt="Profil"
                            className="profile-photo"
                        />
                    </NavLink>
                </>) : (<>
                    <NavLink to="/category">Kategoriler</NavLink>
                    <NavLink className="nav-link" to="/login">
                        Profil
                    </NavLink>
                </>)}
            </div>
        </div>

    )
}