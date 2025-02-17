import { useParams,useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  db,
  getAddvert,
  getCategoryById,
  getDetailById,
  getMoreDetailById,
  getSubCategoryById,
  getUserById,
  toggleFavoriteFirebase,
} from "../../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import Loading from "../../layouts/loading";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function AdvertDetail() {
  const { advertId } = useParams();
  const [advert, setAdvert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(null);
  const [categoryName, setCategoryName] = useState("Bilinmeyen Kategori");
  const [subCategoryName, setSubCategoryName] = useState("Bilinmeyen Kategori");
  const [detailName, setDetailName] = useState("bilinmeyen");
  const [moreDetailName, setMoreDetailName] = useState("bilinmeyen");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (advertId) {
      setLoading(true);
      getAddvert(async (adverts) => {
        const foundAdvert = adverts.find((advert) => advert.id === advertId);
        setAdvert(foundAdvert);

        if (foundAdvert && foundAdvert.uid) {
          const user = await getUserById(foundAdvert.uid);
          setUserName(user?.name || "Bilinmeyen Kullanıcı");
        }
        if (foundAdvert && foundAdvert.tempCategory) {
          const category = await getCategoryById(foundAdvert.tempCategory);
          setCategoryName(category || "Bilinmeyen Kategori");
        }
        if (
          foundAdvert &&
          foundAdvert.altcategory &&
          foundAdvert.tempCategory
        ) {
          const subCategory = await getSubCategoryById(
            foundAdvert.altcategory,
            foundAdvert.tempCategory
          );
          setSubCategoryName(subCategory || "Bilinmeyen Alt Kategori");
        }

        if (
          foundAdvert &&
          foundAdvert.tempCategory &&
          foundAdvert.altcategory &&
          foundAdvert.marka
        ) {
          const detail = await getDetailById(
            foundAdvert.tempCategory,
            foundAdvert.altcategory,
            foundAdvert.marka
          );
          setDetailName(detail || "Bilinmeyen Detay");
        }

        if (
          foundAdvert &&
          foundAdvert.tempCategory &&
          foundAdvert.altcategory &&
          foundAdvert.marka &&
          foundAdvert.model
        ) {
          const moreDetail = await getMoreDetailById(
            foundAdvert.tempCategory,
            foundAdvert.altcategory,
            foundAdvert.marka,
            foundAdvert.model
          );
          setMoreDetailName(moreDetail || "Bilinmeyen Detay");
        }

        setLoading(false);
      });
    }
  }, [advertId]);
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
  
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          const favorites = userData.favorites || [];
          setIsFavorite(favorites.includes(advertId));  // Favori olup olmadığını kontrol et
        }
      } catch (error) {
        console.error("Favori durumu kontrolü sırasında hata oluştu:", error);
      }
    };
  
    checkFavoriteStatus();  // Favori durumu kontrolünü başlat
  }, [advertId, user]);  // advertId veya user değişirse tekrar çalışacak

  // Favori durumu değiştir
  const handleFavoriteToggle = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("Lütfen giriş yapın.");
      return;
    }
  
    setIsButtonLoading(true); // Buton yüklemesini başlat
  
    try {
      // Kullanıcının mevcut favorilerini al
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const currentFavorites = userData.favorites || [];
  
        // Favoriyi ekle/kaldır
        const updatedFavorites = await toggleFavoriteFirebase(user.uid, advertId, currentFavorites);
  
        // Favori durumu güncelle
        setIsFavorite(updatedFavorites.includes(advertId));
        console.log("Favori Başarıyla Güncellendi!");
      }
    } catch (error) {
      console.error("Favori ekleme/kaldırma sırasında hata oluştu:", error);
      alert("Favori işlemi sırasında bir hata oluştu.");
    } finally {
      setIsButtonLoading(false); // Buton yüklemesini durdur
    }
  };

  if (loading) {
    return <Loading />;
  }
  if (!user) {
    alert("Lütfen giriş yapın.");
    return;
  }
  console.log("Current User UID: ", user.uid);
  const handleSendMessage = async () => {
    if (!user) {
      alert("Lütfen giriş yapın.");
      return;
    }

    if (!advert || !advert.uid) {
      alert("İlan bilgileri yüklenemedi.");
      return;
    }

    const receiverId = advert.uid;
    const senderId = user.uid;

    // Mesajlaşma ekranına yönlendir
    navigate(`/messages/${senderId}_${receiverId}`);
  };

  return (
    <div className="advert-detail">
      <div className="advert-detail-top">
        {categoryName}
        {" > "}
        {subCategoryName}
        {" > "}
        {detailName}
        {" > "}
        {moreDetailName}
      </div>
      <div className="advert-detail-swiper">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          navigation={true}
          loop={true}
          modules={[Navigation, Pagination, Scrollbar]}
          pagination={{ clickable: true }}
        >
          {advert?.foto && advert.foto.length > 0 ? (
            advert.foto.map((imageUrl, index) => (
              <SwiperSlide
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={imageUrl}
                  alt={`Advert ${index + 1}`}
                  className="swiper-image"
                />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <img
                src="/default-image.jpg"
                alt="No images available"
                className="swiper-image"
              />
            </SwiperSlide>
          )}
        </Swiper>
        <div className="username">
          Ekleyen: {userName}
          <button onClick={handleSendMessage}>Mesaj Gönder</button>
        </div>
      </div>
      <button 
  onClick={handleFavoriteToggle} 
  disabled={isButtonLoading}
  className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
>
  {isButtonLoading 
    ? "İşlem yapılıyor..." 
    : isFavorite 
      ? "Favorilerden Çıkar" 
      : "Favorilere Ekle"
      
  }
  
</button>

      <div className="advert-detail-border">
        <div>
          <h3>{advert.price} TL</h3>
          <div>
            {advert.title}
            <hr />
          </div>
        </div>
        <div>
          {advert.tempCategory === "FecwhXkriZmMzoepLg4E" ? (
            <div className="advert__detail__car">
              <table>
                <tbody>
                  <tr>
                    <td>Ağır Hasar</td>
                    <td>{advert.hasar}</td>
                  </tr>
                  <tr>
                    <td>Marka</td>
                    <td>{detailName}</td>
                  </tr>
                  <tr>
                    <td>Model</td>
                    <td>{moreDetailName}</td>
                  </tr>
                  <tr>
                    <td>Vites</td>
                    <td>{advert.vites}</td>
                  </tr>
                  <tr>
                    <td>Yakıt</td>
                    <td>{advert.yakıt}</td>
                  </tr>
                  <tr>
                    <td>Ana Kategori</td>
                    <td>{categoryName}</td>
                  </tr>
                  <tr>
                    <td>Alt Kategori</td>
                    <td>{subCategoryName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : advert.tempCategory === "PKHj5ev6aFCMDyJVQpka" ? (
            <div className="advert__detail__car">
              <table>
                <tbody>
                  <tr>
                    <td>Brüt m2</td>
                    <td>{advert.brut}</td>
                  </tr>
                  <tr>
                    <td>Net m2</td>
                    <td>{advert.net}</td>
                  </tr>
                  <tr>
                    <td>Bina yaşı</td>
                    <td>{advert.bina}</td>
                  </tr>
                  <tr>
                    <td>Oda Sayısı</td>
                    <td>{advert.oda}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div>Kategori bulunamadı</div>
          )}
        </div>
        <div>
          <div className="advert__Description__title">
            <div className="advert__Description__titles">ilan açıklaması:</div>
            <div className="advert__description">{advert.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
