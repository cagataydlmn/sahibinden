
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, getDetail } from "../../firebase";

const SubCategoryDetail = () => {
  const { id: categoryId, subCategoryId } = useParams();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
      } catch (error) {
        console.error("Veri alınırken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!items?.length) return;

    let filtered = items.filter((item) => item.tempCategory === categoryId);

    if (subCategoryId) {
      filtered = filtered.filter((item) => item.altcategory === subCategoryId);
    }

    setFilteredItems(filtered);
  }, [items, categoryId, subCategoryId]);
  useEffect(() => {
    if (!subCategoryId) return;

    const fetchDetails = async () => {
      try {
        getDetail(categoryId, subCategoryId, (detailsData) => {
          setDetails(detailsData); 
        });
      } catch (error) {
        console.error("Detaylar alınırken hata oluştu:", error);
      }
    };

    fetchDetails();
  }, [categoryId, subCategoryId]);

  return (
    <div className="flex">
      <div className="details p-5 bg-gray-50 rounded-lg shadow-lg w-1/4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Alt Kategori Detayları
        </h2>
        {details.length > 0 ? (
          <ul>
            {details.map((detail) => (
              <li key={detail.id} className="mb-4">
                <Link
                  to={`/category/${categoryId}/sub/${subCategoryId}/detail/${detail.id}`}
                  className="font-semibold text-gray-700"
                >
                  {detail.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Bu alt kategoriye ait detay bulunamadı.</p>
        )}
      </div>

      <div className="categoryDetail p-5 bg-gray-50 rounded-lg shadow-lg w-3/4 ml-5">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {categoryId} Kategorisi Ürünleri
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Yükleniyor...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-center text-gray-500">
            Bu kategoriye ait ürün bulunamadı.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems.map((advert) => (
              <Link
                to={`/adverts/${advert.id}`}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                key={advert.id}
              >
                <div className="home__advert__image">
                  <img
                    src={advert.foto[0]}
                    alt={`Ürün resmi: ${advert.brut}`}
                    style={{ objectFit: "cover" }}
                    className="w-full h-32 object-cover mb-4 rounded-lg"
                  />
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  {advert.title}
                </div>
                <div className="text-sm text-gray-500">{advert.price} TL</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubCategoryDetail;

