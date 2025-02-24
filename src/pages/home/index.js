import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAddvert } from "../../firebase";
import Categories from "../../layouts/categories";

export default function Home() {
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    getAddvert(setProducts);
  }, []);

  return (
    <div className="flex">

      <div className="just__home">
        <search />
      </div>

    
      <Categories />
      <div className="home ">
        {Products.map((advert) => (
          <Link
            to={`adverts/${advert.id}`}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow no-underline"
            key={advert.id}
          >
            <div className="home__advert__image">
              <img
                src={advert.foto[0]}
                alt={`Ürün resmi: ${advert.brut}`}

                className="w-full h-32 object-cover mb-4 rounded-lg"
                />
            </div>
            <div className="text-lg font-semibold text-gray-700">
{advert.title}</div>
<div className="text-sm text-gray-500">{advert.price} TL</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
