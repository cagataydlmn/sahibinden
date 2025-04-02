
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

        const q = query(
          collection(db, "products"),
          where("tempCategory", "==", id)
        );
        const querySnapshot = await getDocs(q);
        const productData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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

  const currentCategory = categories.find((category) => category.id === id);

  if (!currentCategory) {
    return <div>Kategori bulunamadı!</div>; // Eğer categoryId'ye karşılık gelen kategori yoksa
  }

  return (

    <div className="flex gap-10 mt-4">
      <div className="categoryHome mr-10">
      <div className="categoryHome__general flex flex-col gap-10 p-5 bg-gray-50 rounded-lg shadow-lg !w-[100%]">
          <div
            key={currentCategory.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <Link
              className="text-[18px] font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300"
              to={`/category/${currentCategory.id}`}
            >
              {currentCategory.name}
            </Link>
            {subCategories[currentCategory.id] && (

            <ul className="mt-4 space-y-2 list-none w-[100%]">
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


      <div className="categoryDetail p-5 bg-gray-50 rounded-lg shadow-lg w-full">
        
        {loading ? (
          <p className="text-center text-gray-500">Yükleniyor...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">
            Bu kategoriye ait ürün bulunamadı.
          </p>
        ) : (
            <div className="home  w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mx-auto">
              {products.map((advert) => (
                  <Link
                      to={`adverts/${advert.id}`}
                      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col no-underline"
                      key={advert.id}
                  >
                    {/* Premium badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
                        <span className="text-xs">Premium</span>
                      </div>
                    </div>

                    {/* Image container */}
                    <div className="relative overflow-hidden">
                      <img
                          src={advert.foto[0] || "/placeholder.svg"}
                          alt={`Ürün resmi: ${advert.brut}`}
                          className="w-full h-40 md:h-48 object-cover transition-all duration-700 group-hover:scale-110"
                      />

                      {/* Image overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-3">
                      <h3 className="text-xl text-gray-800 line-clamp-1 truncate group-hover:text-indigo-600 transition-colors">
                        {advert.title}
                      </h3>


                      {/* Price tag */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold px-3 py-1 rounded-lg shadow-sm">
                          {advert.price} TL
                        </div>

                        <div className="text-xs text-gray-500">Hemen Al</div>
                      </div>
                    </div>
                  </Link>
              ))}
            </div>
        )}
      </div>
    </div>
  );
}
