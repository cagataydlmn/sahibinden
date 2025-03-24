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
      <div className="flex flex-col md:flex-row mt-4 gap-4 relative">
        {/* Menü Açıldığında Arka Planı Karartma */}
        {menuOpen && (
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setMenuOpen(false)}
            ></div>
        )}

        {/* Hamburger Butonu */}
        <button
            className="md:hidden bg-gray-800 text-white p-2 rounded-lg flex items-center gap-2 z-50 relative"
            onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
          <span>Modeller</span>
        </button>

        {/* Kategori Detay Menüsü */}
        <div
            className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-50 p-5 rounded-lg shadow-lg transform ${
                menuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 transition-transform duration-300 ease-in-out md:w-auto md:block z-50`}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Marka</h2>
          {sortedProducts.length > 0 ? (
              <ul className="list-none pr-5 pl-5 h-[400px] overflow-auto">
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

        {/* Ürün Listesi */}
        <div className="categoryDetail p-5 bg-gray-50 rounded-lg shadow-lg w-full relative z-10">
          {loading ? (
              <p className="text-center text-gray-500">Yükleniyor...</p>
          ) : filteredItems.length === 0 ? (
              <p className="text-center text-gray-500">
                Bu kategoriye ait ürün bulunamadı.
              </p>
          ) : (
              <div className="home w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mx-auto">
                {filteredItems.map((advert) => (
                    <Link
                        to={`/adverts/${advert.id}`}
                        className="bg-white p-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 no-underline"
                        key={advert.id}
                    >
                      <div className="overflow-hidden rounded-xl">
                        <img
                            src={advert.foto[0]}
                            alt={`Ürün resmi: ${advert.brut}`}
                            className="w-full h-40 md:h-48 object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="text-base md:text-lg font-bold text-gray-800 truncate">
                        {advert.title}
                      </div>
                      <div className="text-sm md:text-md font-semibold text-indigo-600 mt-1">
                        {advert.price} TL
                      </div>
                    </Link>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

export default SubCategoryDetail;
