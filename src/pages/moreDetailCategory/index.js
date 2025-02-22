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
    <div className="p-5 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {moreDetailId} Modeline Ait Ürünler
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Yükleniyor...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">Bu modele ait ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Link
            to={`/adverts/${product.id}`}

              key={product.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-700">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500">{product.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}