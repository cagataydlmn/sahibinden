import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAdvert, getAddvert } from "../../firebase";
export default function ProfileAdverts() {
  const [advert, setAdvert] = useState([]);
  const [items, setItems] = useState([]);

  const user = localStorage.getItem("user");

  useEffect(() => {
    getAddvert(setAdvert);
  }, []);

  useEffect(() => {
    if (user) {
      try {
        const parsedData = JSON.parse(user);

        if (parsedData?.user?.uid) {

          const filteredAds = advert.filter(
            (ad) => ad.uid === parsedData.user.uid
          );
          setItems(filteredAds);
        } else {
        }
      } catch (error) {
      }
    } else {
    }
  }, [advert,user]);
  const handleDelete = async (id) => {
    try {
      await deleteAdvert(id); // Firebase'deki ilanı sil
      setItems((prevItems) => prevItems.filter((item) => item.id !== id)); // Listedeki öğeyi kaldır
      alert("İlan başarıyla silindi!");
    } catch (error) {
      console.error("İlan silinirken bir hata oluştu:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };
  return (
    <div className="home">
      {items.map((advert) => (
        <div className="home__advert">
          <Link to={`adverts/${advert.id}`} key={advert.id}>
            <div>
              <img
                src={advert.foto[0]}
                alt={`Ürün resmi: ${advert.brut}`}
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />
            </div>
            <div>{advert.title}</div>
            <div>{advert.price} TL</div>
          </Link>
          <button>İlanı sattım</button>
          <button
            onClick={() => handleDelete(advert.id)}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            İlanı satmaktan vazgeçtim
          </button>{" "}
        </div>
      ))}
    </div>
  );
}
