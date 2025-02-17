import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAdvert, getAddvert } from "../../firebase";
import EditAdvertModal from "../../modals/editAdvertModal";

export default function ProfileAdverts() {
  const [advert, setAdvert] = useState([]);
  const [items, setItems] = useState([]);
  const [editingAdvert, setEditingAdvert] = useState(null); 

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
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [advert, user]);

  const handleDelete = async (id) => {
    try {
      await deleteAdvert(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      alert("İlan başarıyla silindi!");
    } catch (error) {
      console.error("İlan silinirken bir hata oluştu:", error);
      alert("Bir hata oluştu, lütfen tekrar deneyin.");
    }
  };

  const handleEdit = (advert) => {
    setEditingAdvert(advert);
  };

  return (
    <div className="home">
      {items.map((advert) => (
        <div className="home__advert" key={advert.id}>
          <Link to={`adverts/${advert.id}`}>
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
          </button>
          <button
            onClick={() => handleEdit(advert)}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            İlanı düzenle
          </button>
        </div>
      ))}

      {editingAdvert && (
        <EditAdvertModal
          advert={editingAdvert}
          onClose={() => setEditingAdvert(null)}
          onUpdate={(updatedAdvert) => {
            setItems((prevItems) =>
              prevItems.map((item) =>
                item.id === updatedAdvert.id ? updatedAdvert : item
              )
            );
            setEditingAdvert(null);
          }}
        />
      )}
    </div>
  );
}
