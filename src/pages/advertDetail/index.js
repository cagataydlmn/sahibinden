import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import defaultProfile from "../../assets/default-profile.jpeg";
import {
  db,
  getAddvert,
  getCategoryById,
  getDetailById,
  getMoreDetailById,
  getSubCategoryById,
  getUserByUID,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

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
  const [profilePhoto, setProfilePhoto] = useState(defaultProfile);

  const auth = getAuth();
  const user = auth.currentUser; // Firebase'den kullanıcıyı alıyoruz
  const navigate = useNavigate();

  useEffect(() => {
    if (advertId) {
      setLoading(true);
      getAddvert(async (adverts) => {
        const foundAdvert = adverts.find((advert) => advert.id === advertId);
        setAdvert(foundAdvert);

        if (foundAdvert && foundAdvert.uid) {
          const user = await getUserByUID(foundAdvert.uid);
          console.log("Kullanıcı Verisi:", user); // Kullanıcı verisini kontrol et
          setUserName(user?.name || "Bilinmeyen Kullanıcı");
          setProfilePhoto(user?.profilePhoto || defaultProfile); // Varsayılan resim ekledik
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
          setIsFavorite(favorites.includes(advertId)); // Favori olup olmadığını kontrol et
        }
      } catch (error) {
        console.error("Favori durumu kontrolü sırasında hata oluştu:", error);
      }
    };

    checkFavoriteStatus();
  }, [advertId, user]); // advertId veya user değişirse tekrar çalışacak

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
        const updatedFavorites = await toggleFavoriteFirebase(
            user.uid,
            advertId,
            currentFavorites
        );

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

  // Kullanıcı giriş yapmamışsa kullanıcı verisini göstermemek için kontrol ekliyoruz
  if (!user) {
    console.warn("Kullanıcı giriş yapmamış, ancak sayfa gösterilmeye devam ediyor.");
  } else {
    console.log("Current User UID: ", user.email); // Giriş yapmış kullanıcı verisini logluyoruz
  }

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
      <div className="advert-detail  flex flex-col m-auto flex-grow overflow-y-auto w-full">
        <div className="advert-detail-top ">
          <Link className="no-underline text-black" to={`/category/${advert.tempCategory}`}> {categoryName}</Link>
          {" > "}
          <Link className="no-underline text-black" to={`/category/${advert.tempCategory}/sub/${advert.altcategory}`}>
            {" "}
            {subCategoryName}
          </Link>
          {" > "}
          <Link className="no-underline text-black"
                to={`/category/${advert.tempCategory}/sub/${advert.altcategory}/detail/${advert.marka}`}
          >
            {" "}
            {detailName}
          </Link>
          {" > "}
          <Link className="no-underline text-black"
                to={`/category/${advert.tempCategory}/sub/${advert.altcategory}/detail/${advert.marka}/moredetail/${advert.model}`}
          >
            {" "}
            {moreDetailName}
          </Link>
        </div>
        <div className="advert-detail-swiper">
          <Swiper
              spaceBetween={50}
              slidesPerView={1}
              navigation={true}
              loop={true}
              modules={[Navigation, Pagination, Scrollbar]}
              pagination={{ clickable: true }}
              className="swiper"
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
                      <button
                          onClick={handleFavoriteToggle}
                          disabled={isButtonLoading}
                          className={`absolute top-2 right-2 p-2 rounded-full transition-all text-[20px] ${
                              isFavorite
                                  ? "bg-red-100 text-red-500"
                                  : "bg-white/70 text-gray-500"
                          } hover:bg-red-200`}
                      >
                        {isFavorite ? (
                            <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                        ) : (
                            <FontAwesomeIcon icon={faHeart} className="text-gray-500" />
                        )}
                      </button>
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
            <div className="flex items-center gap-5 p-[15px] border border-gray-300 rounded-lg shadow-sm bg-white">
              <img
                  src={profilePhoto}
                  alt="Profil Fotoğrafı"
                  className="w-[70px] h-[70px] rounded-full object-cover border-2 border-gray-300"
              />
              <div className="text-xl font-semibold text-gray-800">
                {userName ? userName : "Bilinmeyen Kullanıcı"}
              </div>
            </div>
            <button
                className="w-[110%] mt-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={handleSendMessage}
            >
              Mesaj Gönder
            </button>
          </div>
        </div>

        <div className="advert-detail-border w-[66%] p-[30px] mt-[30px] bg-white border border-gray-300 shadow-md rounded-lg">
          <div>
            <h3 className="border-none">{advert.price} TL</h3>
            <div>
              {advert.title}
              <hr />
            </div>
          </div>
          <div>
            <h4>İlan özellikleri</h4>
            {advert.tempCategory === "FecwhXkriZmMzoepLg4E" ? (
                <div className="advert__detail__car ">
                  <ul>
                    <li>
                      <span>Marka:</span> {advert.marka}
                    </li>
                    <li>
                      <span>Model:</span> {advert.model}
                    </li>
                    <li>
                      <span>Yıl:</span> {advert.year}
                    </li>
                    <li>
                      <span>Fiyats:</span> {advert.price}
                    </li>
                  </ul>
                </div>
            ) : null}
          </div>
        </div>
      </div>
  );
}
