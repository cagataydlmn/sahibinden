import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAddvert } from "../../firebase";
import Categories from "../../layouts/categories";
import Search from "../../components/search";

export default function Home() {
  const [Products, setProducts] = useState([]);
  useEffect(() => {
    getAddvert(setProducts);
  }, []);

 



  return (
    <div className="flex flex-col min-h-screen">



      <div className="flex overflow-y-auto">
        <div className="just__home">
          <search />
        </div>

        <Categories />
        
        <div>
        <div className="search__mobile">
        <Search/>

        </div>
        <div className="home">
          {Products.map((advert) => (
            <Link
              to={`adverts/${advert.id}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow no-underline mb-4"
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
                {advert.title}
              </div>
              <div className="text-sm text-gray-500">{advert.price} TL</div>
            </Link>
          ))}
        </div>
        </div>
        
      
      </div>
    
    </div>
  );
}
