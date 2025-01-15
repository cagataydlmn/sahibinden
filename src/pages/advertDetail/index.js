import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getAddvert,
  getCategoryById,
  getDetailById,
  getMoreDetailById,
  getSubCategoryById,
  getUserById,
} from "../../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import Loading from "../../layouts/loading";

export default function AdvertDetail(){
    const { advertId } = useParams();
    const [advert, setAdvert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState(null);
    const [categoryName, setCategoryName] = useState("Bilinmeyen Kategori");
    const [subCategoryName, setSubCategoryName] = useState("Bilinmeyen Kategori");
    const [detailName, setDetailName] = useState("bilinmeyen");
    const [moreDetailName, setMoreDetailName] = useState("bilinmeyen");


 
    useEffect(() => {
      if (advertId) {
        setLoading(true);
        getAddvert(async (adverts) => {
          const foundAdvert = adverts.find((advert) => advert.id === advertId);
          setAdvert(foundAdvert);
  
          // Kullanıcı adını almak için `getUserById` çağırıyoruz
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
  
    if (loading) {
      return <Loading />;
    }
  
    return(
        <div className="advert-detail">
        <div className="advert-detail-top">
        {categoryName}{" > "}{subCategoryName}{" > "}{detailName}{" > "}{moreDetailName}
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
                    alt={`Advert  ${index + 1}`}
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
            <button>Mesaj gönder</button>
          </div>
        </div>
  
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
            {" "}
            <div className="advert__Description__titles">ilan açıklaması:</div>
            <div className="advert__description">{advert.description}</div>

          </div>
        </div>
      </div>
      </div>
    )
}