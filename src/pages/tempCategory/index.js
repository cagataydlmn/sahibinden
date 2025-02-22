
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase"; // Firebase bağlantını içeren dosya
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useSite } from "../../context";
import { getSubCategory } from "../../firebase";

export default function TempCategoryDetail() {
  const { id } = useParams(); // URL'den categoryId al
  const [products, setProducts] = useState([]); // İlanları sakla
  const [loading, setLoading] = useState(true); // Yüklenme durumu
  const { categories } = useSite();
  const [subCategories, setSubCategories] = useState({});

  useEffect(() => {
    if (!id) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "products"), where("tempCategory", "==", id));
        const querySnapshot = await getDocs(q);
        const productData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(productData);
      } catch (error) {
        console.error("Ürünleri çekerken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);
  console.log(id);
  useEffect(() => {
    categories.forEach((category) => {
      getSubCategory(category.id, (subCategoriesData) => {
        setSubCategories((prev) => ({
          ...prev,
          [category.id]: subCategoriesData,
        }));
      });
    });
  }, [categories]);

  // categoryId ile eşleşen kategoriyi bul
  const currentCategory = categories.find((category) => category.id === id);

  if (!currentCategory) {
    return <div>Kategori bulunamadı!</div>; // Eğer categoryId'ye karşılık gelen kategori yoksa
  }

  return (
    <div className="flex">
      <div className="categoryHome">
        <div className="categoryHome__general flex flex-col gap-10 p-5 bg-gray-50 rounded-lg shadow-lg">
          <div key={currentCategory.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <Link
              className="text-l font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300"
              to={`/category/${currentCategory.id}`}
            >
              {currentCategory.name}
            </Link>
            {subCategories[currentCategory.id] && (
              <ul className="mt-4 space-y-2 list-none">
                {subCategories[currentCategory.id].map((subCategory) => (
                  <li key={subCategory.id}>
                    <Link
                      className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300"
                      to={`/category/${currentCategory.id}/sub/${subCategory.id}`}
                    >
                      {subCategory.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="categoryDetail p-5 bg-gray-50 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{currentCategory.name} Kategorisi Ürünleri</h2>
        {loading ? (
          <p className="text-center text-gray-500">Yükleniyor...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">Bu kategoriye ait ürün bulunamadı.</p>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link 
              to={`/adverts/${product.id}`}
              key={product.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
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

