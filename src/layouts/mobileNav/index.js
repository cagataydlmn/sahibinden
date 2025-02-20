import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faMessage } from '@fortawesome/free-solid-svg-icons';

export default function MobileNav(){
    const { user } = useSelector((state) => state.auth);

    return(
    <div className="mobile__nav">
        <div className="mobile__nav__top">
            <div className="mobile__nav__top__left">
            {user ? (
            <div className="nav__general__right">
               <NavLink className="nav-link flex gap-3" to="/post-advert">
              <FontAwesomeIcon className="size-[30px]" icon={faCamera} /> Sat              </NavLink>
             
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
            <NavLink to="/messages">
              <FontAwesomeIcon className="size-[30px] flex " icon={faMessage} />
              </NavLink>
        </div>
      
        </div>
        )
}