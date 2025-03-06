import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, getMoreDetail } from "../../firebase";
import { Menu } from "lucide-react";

export default function DetailCategory() {
  const { id: categoryId, subCategoryId, detailId } = useParams();
  const [moreDetails, setMoreDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (error) {
        console.error("Veri alınırken hata oluştu:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!detailId) return;

    setLoading(true);
    getMoreDetail(categoryId, subCategoryId, detailId, (moreDetailData) => {
      setMoreDetails(moreDetailData.length > 0 ? moreDetailData : []);
      setLoading(false);
    });
  }, [categoryId, subCategoryId, detailId]);

  useEffect(() => {
    if (!products.length || !detailId) return;

    const filtered = products.filter((product) => product.marka === detailId);
    setFilteredProducts(filtered);
  }, [products, detailId]);

  return (
      <div className="flex flex-col md:flex-row mt-4 gap-4 mt-[50px] w-[92%]">
        {/* Hamburger Menü Butonu */}
        <button
            className="md:hidden bg-gray-800 text-white p-2 rounded-lg flex items-center gap-2"
            onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
          <span>Modeller</span>
        </button>

        {/* Modeller Menüsü */}
        <div
            className={`absolute md:static left-0 top-0 h-full w-64 bg-gray-50 p-5 rounded-lg shadow-lg transform ${
                menuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 transition-transform duration-300 ease-in-out md:w-auto md:block mt-[50px]`}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Modeller</h2>
          {loading ? (
              <p className="text-center text-gray-500">Yükleniyor...</p>
          ) : moreDetails.length === 0 ? (
              <p className="text-center text-gray-500">Bu detaya ait daha fazla bilgi bulunamadı.</p>
          ) : (
              <ul className="list-none p-0 h-[400px] overflow-auto">
                {moreDetails.map((detail) => (
                    <li key={detail.id} className="mb-4">
                      <Link
                          to={`/category/${categoryId}/sub/${subCategoryId}/detail/${detailId}/moredetail/${detail.id}`}
                          className="font-semibold text-gray-700 no-underline"
                      >
                        {detail.name}
                      </Link>
                    </li>
                ))}
              </ul>
          )}
        </div>

        {/* Ürünler Alanı */}
        <div className="categoryDetail p-5 bg-gray-50 rounded-lg shadow-lg w-[90%]">
          <h2 className="text-xl font-bold text-gray-800 mb-4">İlgili Ürünler</h2>
          {filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500">Bu detaya ait ürün bulunamadı.</p>
          ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {filteredProducts.map((product) => (
                    <Link
                        key={product.id}
                        to={`/adverts/${product.id}`}
                        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow no-underline"
                    >
                      <div className="home__advert__image">
                        <img
                            src={product.foto[0]}
                            alt={`Ürün resmi: ${product.brut}`}
                            style={{ objectFit: "cover" }}
                            className="w-full h-32 object-cover mb-4 rounded-lg"
                        />
                      </div>
                      <div className="text-lg font-semibold text-gray-700">{product.title}</div>
                      <div className="text-sm text-gray-500">{product.price} TL</div>
                    </Link>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}
