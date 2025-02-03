import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";


export default function MobileNav(){
    const { user } = useSelector((state) => state.auth);

    return(
    <div className="mobile__nav">
        <div className="mobile__nav__top">
            <div className="mobile__nav__top__left">
            {user ? (
            <div className="nav__general__right">
              <NavLink className="nav-link" to="/post-advert">
                İlan Ver
              </NavLink>
             
            </div>
          ) : (
            <div className="nav__general__right">
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
            </div>
          )}
            </div>
            <Link to="/" className="">
                    Bazar
            </Link>
            <div>
                mesajlarşma
            </div>
        </div>
      
        </div>
        )
}