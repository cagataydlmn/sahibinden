


import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, query, getDocs } from "firebase/firestore";
import { db, getCategoryById } from "../../firebase.js";

const CategoryDetail = () => {
  const { id } = useParams();
  const [allItems, setAllItems] = useState([]); 
  const [filteredItems, setFilteredItems] = useState([]);
  const [categoryName, setCategoryName] = useState("Bilinmeyen Kategori");

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "products")); 
      const querySnapshot = await getDocs(q);

      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched items:", items);
      setAllItems(items);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(allItems)) {
      const filtered = allItems.filter((item) => item.tempCategory === id);
      setFilteredItems(filtered);
    }

    const fetchCategoryName = async () => {
      const category = await getCategoryById(id);
      setCategoryName(category || "Bilinmeyen Kategori");
    };

    fetchCategoryName();
  }, [id, allItems]);

  return (
    <div>
      <h1>Category: {categoryName}</h1> {/* Kategori adı burada gösteriliyor */}
      <div className="home">
        {filteredItems.map((item) => (
          <Link
            to={`/adverts/${item.id}`}
            className="home__advert"
            key={item.id}
          >
            <div className="home__advert__image">
              <img
                src={item.foto[0]}
                alt={`Ürün resmi: ${item.brut}`}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>{item.title}</div>
            <div>{item.price} TL</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryDetail;

