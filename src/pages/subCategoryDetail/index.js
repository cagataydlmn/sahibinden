import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, getDetail } from "../../firebase";
import { Menu } from "lucide-react";

const SubCategoryDetail = () => {
  const { id: categoryId, subCategoryId } = useParams();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const sortedProducts = [...details].sort((a, b) => a.name.localeCompare(b.name));

  return (
      <div className="flex flex-col md:flex-row mt-4 gap-4 mt-[50px]">
        <button
            className="md:hidden bg-gray-800 text-white p-2 rounded-lg flex items-center gap-2 "
            onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
          <span>Modeller</span>
        </button>

        <div
            className={`absolute md:static top-0 left-0 h-full w-64 bg-gray-50 p-5 rounded-lg shadow-lg transform ${
                menuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 transition-transform duration-300 ease-in-out md:w-auto md:block  mt-[50px]  `}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Modeller</h2>
          {sortedProducts.length > 0 ? (
              <ul className="list-none p-0 h-[400px] overflow-auto">
                {sortedProducts.map((detail) => (
                    <li key={detail.id} className="mb-4">
                      <Link
                          to={`/category/${categoryId}/sub/${subCategoryId}/detail/${detail.id}`}
                          className="font-semibold text-gray-700 no-underline"
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

        {/* Sağ Taraf - Kategori Ürünleri */}
        <div className="categoryDetail p-5 bg-gray-50 rounded-lg shadow-lg w-full">
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
