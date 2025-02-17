import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../../context";
import { getSubCategory } from "../../firebase";

export default function Categories() {
  const { categories } = useSite();
  const [subCategories, setSubCategories] = useState({});

  // Her kategori için alt kategorileri çek
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

  return (
    <div className="categoryHome">
    <div className="categoryHome__general flex flex-col gap-10 p-5 bg-gray-50 rounded-lg shadow-lg">
      {categories.map((category) => (
        <div key={category.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <Link
            className="text-l font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-300"
            to={`/category/${category.id}`}
          >
            {category.name}
          </Link>
          {subCategories[category.id] && (
            <ul className="mt-4 space-y-2 list-none">
              {subCategories[category.id].map((subCategory) => (
                <li key={subCategory.id}>
                  <Link
                    className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-300"
                    to={`/category/${category.id}/sub/${subCategory.id}`}
                  >
                    {subCategory.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </div>
  
  );
}
