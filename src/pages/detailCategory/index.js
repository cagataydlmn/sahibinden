import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, getMoreDetail } from "../../firebase";

export default function DetailCategory() {
  const { id:categoryId, subCategoryId, detailId } = useParams();
  const [moreDetails, setMoreDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

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

    console.log("Fetching moreDetails for:", { categoryId, subCategoryId, detailId });

    getMoreDetail(categoryId, subCategoryId, detailId, (moreDetailData) => {
        console.log("Gelen moreDetails:", moreDetailData);

        if (moreDetailData.length > 0) {
          setMoreDetails(moreDetailData);
        } else {
          console.warn("Detay verisi bulunamadı.");
          setMoreDetails([]);
        }
        setLoading(false);
    });

}, [categoryId, subCategoryId, detailId]);

  useEffect(() => {
    if (!products.length || !detailId) return;

    const filtered = products.filter((product) => product.marka === detailId);
    setFilteredProducts(filtered);
  }, [products, detailId]);

  return (
    <div className="p-5 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Detaylar</h2>

      {loading ? (
        <p className="text-center text-gray-500">Yükleniyor...</p>
      ) : moreDetails.length === 0 ? (
        <p className="text-center text-gray-500">Bu detaya ait daha fazla bilgi bulunamadı.</p>
      ) : (
        <div>
          {moreDetails.map((detail) => (
            <Link to={`/category/${categoryId}/sub/${subCategoryId}/detail/${detailId}/moredetail/${detail.id}`} key={detail.id} className="mb-4">
              <h3 className="font-semibold text-gray-700">{detail.name}</h3>
            </Link>
          ))}
        </div>
      )}

      <div className="categoryDetail p-5 bg-gray-50 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">İlgili Ürünler</h2>
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">Bu detaya ait ürün bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Link                 to={`/adverts/${product.id}`}
             className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-700">{product.title}</h3>
                <p className="text-sm text-gray-500">{product.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}