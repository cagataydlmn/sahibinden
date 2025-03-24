import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function MoreDetailCategory() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { moreDetailId, id, subCategoryId, detailId } = useParams();

  useEffect(() => {
    console.log('Params:', { moreDetailId, id, subCategoryId, detailId });
  }, [moreDetailId, id, subCategoryId, detailId]);
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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!products.length || !moreDetailId) return;

    const filtered = products.filter((product) => product.model === moreDetailId);
    setFilteredProducts(filtered);
  }, [products, moreDetailId]);

  return (
    <div className="p-5 bg-gray-50 rounded-lg shadow-lg ]">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {moreDetailId} Modeline Ait Ürünler
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Yükleniyor...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">Bu modele ait ürün bulunamadı.</p>
      ) : (

          <div className="home mt-[30px] w-full  grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mx-auto">
        {filteredProducts.map((product) => (
          <Link
            to={`/adverts/${product.id}`}
            className="bg-white p-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 no-underline"
          >
            <div className="overflow-hidden rounded-xl">
              <img
                src={product.foto[0]}
                alt={`Ürün resmi: ${product.brut}`}
                className="w-full h-40 md:h-48 object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="text-base md:text-lg font-bold text-gray-800 truncate">
              {product.title}
            </div>
            <div className="text-sm md:text-md font-semibold text-indigo-600 mt-1">
              {product.price} TL</div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
}