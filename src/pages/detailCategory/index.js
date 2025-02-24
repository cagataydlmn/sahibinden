import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, getMoreDetail } from "../../firebase";

export default function DetailCategory() {

  const { id: categoryId, subCategoryId, detailId } = useParams();
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

    console.log("Fetching moreDetails for:", {
      categoryId,
      subCategoryId,
      detailId,
    });

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
  
    <div className="flex mt-4 gap-10   ">
      {loading ? (
        <p className="text-center text-gray-500">Yükleniyor...</p>
      ) : moreDetails.length === 0 ? (
        <p className="text-center text-gray-500">
          Bu detaya ait daha fazla bilgi bulunamadı.
        </p>
      ) : (
        <div className="details p-5 bg-gray-50 rounded-lg shadow-lg w-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4 w-[200px]">
            Modeller
          </h2>
          <ul className="list-none p-0 decoration-slice h-[400px] overflow-auto">
            {moreDetails.map((detail) => (
              <li key={detail.id} className="mb-4">
                <Link
                  to={`/category/${categoryId}/sub/${subCategoryId}/detail/${detailId}/moredetail/${detail.id}`}
                  key={detail.id}
                  className="font-semibold text-gray-700 no-underline"
                >
                  {detail.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="categoryDetail p-5 bg-gray-50 rounded-lg shadow-lg w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">İlgili Ürünler</h2>
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">
            Bu detaya ait ürün bulunamadı.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 ">
            {filteredProducts.map((product) => (
              <Link
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
                <div className="text-lg font-semibold text-gray-700">
                  {product.title}
                </div>
                <div className="text-sm text-gray-500">{product.price} TL</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );

}
