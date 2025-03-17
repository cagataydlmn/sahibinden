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
      <div className="flex flex-row  min-h-screen">
        <div className="flex lg:flex-col w-full ">
          <div className="lg:w-1/8 lg:mr-4 mb-4 lg:mb-0">
            <Categories />
          </div>

          <div className="flex-1 w-[90%] mt-[30px] ml-auto mr-auto">
            <div className="search__mobile mb-4 lg:hidden">
              <Search />
            </div>

            <div className="home w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 ml-[30px]">
              {Products.map((advert) => (
                  <Link
                      to={`adverts/${advert.id}`}
                      className="bg-white p-2 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 no-underline"
                      key={advert.id}
                  >
                    <div className="overflow-hidden rounded-xl">
                      <img
                          src={advert.foto[0]}
                          alt={`Ürün resmi: ${advert.brut}`}
                          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="mt-1 pb-2">
                      <div className="text-lg font-bold text-gray-800 truncate">{advert.title}</div>
                      <div className="text-md font-semibold text-indigo-600 mt-1">{advert.price} TL</div>
                    </div>
                  </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
  );
}
