import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, getAddvert } from "../../firebase";
import { Link } from "react-router-dom";

const YourComponent = () => {
  const [favorites, setFavorites] = useState([]); // Favori ilanların ID'leri
  const [user, setUser] = useState(null);
  const [productDetails, setProductDetails] = useState([]); // Ürün detaylarını tutacak state

  // Kullanıcı bilgisi alınıyor
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      setUser(currentUser);
    }
  }, []); // Kullanıcı bilgisi ilk renderda alınacak

  // Favorileri almak için fonksiyon
  const getFavorites = async (uid) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const favoritesList = userData.favorites || [];
        setFavorites(favoritesList);  // Favorileri state'e ekle
      }
    } catch (error) {
      console.error("Favoriler alınırken hata oluştu:", error);
    }
  };

  // Ürünleri çekmek ve favori ID'lere göre filtrelemek
  useEffect(() => {
    const fetchProductDetails = () => {
      if (favorites.length > 0) {
        getAddvert((products) => {
          // Favori ilanlar ile ürünleri filtreliyoruz
          const filteredProducts = products.filter((product) =>
            favorites.includes(product.id)  // Favori ilan ID'lerini kontrol ediyoruz
          );
          setProductDetails(filteredProducts); // Ürünleri state'e ekle
        });
      }
    };

    fetchProductDetails(); // Favoriler değiştiğinde ürün detaylarını al
  }, [favorites]); // favorites değiştiğinde fetchProductDetails çağrılır

  // Kullanıcı ve favoriler kontrolü
  useEffect(() => {
    if (user) {
      getFavorites(user.uid); // Kullanıcı UID'sini göndererek favorileri al
    }
  }, [user]); // user değiştiğinde favori listesi alınacak

  return (
    <div>
      <h2>Favori İlanlar</h2>
      <div className="home">
        {productDetails.map((advert) => (
          <Link
            to={`adverts/${advert.id}`}
            className="home__advert"
            key={advert.id}
          >
            <div className="home__advert__image">
              <img
                src={advert.foto[0]}
                alt={`Ürün resmi: ${advert.brut}`}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>{advert.title}</div>
            <div>{advert.price} TL</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default YourComponent;
