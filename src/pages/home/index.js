import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAddvert } from "../../firebase";
import Categories from "../../layouts/categories";
import Search from "../../components/search";
import AutoSwiper from "../../components/autoSwiper";

export default function Home() {
  const [Products, setProducts] = useState([]);
  useEffect(() => {
    getAddvert(setProducts);
  }, []);

  return (
      <div className="flex flex-row  min-h-screen">
        <div className="flex lg:flex-col w-full ">
          <div className="lg:w-1/8 mb-4 lg:mb-0 hidden sm:flex">
            <Categories />
          </div>

          <div className="flex-1 w-[90%]  ml-auto mr-auto">
            <div className="search__mobile mb-4 lg:hidden">
              <Search />
            </div>
            <AutoSwiper/>
            <div className="home mt-[30px] w-full  grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mx-auto">
              {Products.map((advert) => (
                  <Link
                      to={`adverts/${advert.id}`}
                      className="bg-white p-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 no-underline"
                      key={advert.id}
                  >
                    <div className="overflow-hidden rounded-xl">
                      <img
                          src={advert.foto[0]}
                          alt={`Ürün resmi: ${advert.brut}`}
                          className="w-full h-40 md:h-48 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="mt-2 pb-2">
                      <div className="text-base md:text-lg font-bold text-gray-800 truncate">
                        {advert.title}
                      </div>
                      <div className="text-sm md:text-md font-semibold text-indigo-600 mt-1">
                        {advert.price} TL
                      </div>
                    </div>
                  </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
  );
}
