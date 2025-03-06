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
      <div className="flex flex-col min-h-screen mt-[30px]">
        <div className="flex flex-col lg:flex-row w-full ">
          <div className="lg:w-1/8 lg:mr-4 mb-4 lg:mb-0">
            <Categories />
          </div>

          <div className="flex-1 w-[90%] mt-[30px] ml-auto mr-auto">
            <div className="search__mobile mb-4 lg:hidden">
              <Search />
            </div>

            <div className="home  w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
