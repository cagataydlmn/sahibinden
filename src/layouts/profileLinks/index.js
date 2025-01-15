import { Link } from "react-router-dom";

export default function ProfileLinks(){
    return(
        <div>
            <Link to="profile/adverts">İlanlarım</Link>
            <Link to="profile/sell">Sattığım Ürünler</Link>
        </div>
    )
}