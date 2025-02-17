import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const CategoryDetail = () => {
  const { id: categoryId, subCategoryId } = useParams();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h1>Category ID: {categoryId}</h1>
      <h2>SubCategory ID: {subCategoryId || "Yok"}</h2>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : filteredItems.length > 0 ? (
        <ul className="home">
          {filteredItems.map((advert) => (
           <Link
           to={`adverts/${advert.id}`}
           className="home__advert"
           key={advert.id}
         >
           <div className="home__advert__image">
             <img
               src={advert.foto[0]}
               alt={`Ürün resmi: ${advert.brut}`}
               style={{ objectFit: "cover" }}
             />
           </div>
           <div>{advert.title}</div>
           <div>{advert.price} TL</div>
         </Link>
          ))}
        </ul>
      ) : (
        <p>Bu kategoriye ait ürün bulunamadı.</p>
      )}
    </div>
  );
};

export default CategoryDetail;
