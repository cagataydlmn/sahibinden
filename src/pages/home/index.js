import { useEffect, useState } from "react"
import { getAddvert } from "../../firebase"
import Categories from "../../layouts/categories"
import Search from "../../components/search"
import AutoSwiper from "../../components/autoSwiper"
import { Link } from "react-router-dom"

export default function Home() {
  const [Products, setProducts] = useState([])
  useEffect(() => {
    getAddvert(setProducts)
  }, [])

  return (
      <div className="flex flex-row min-h-screen">
        <div className="flex lg:flex-col w-full">
          <div className="flex lg:flex-col w-full">
            <div className="lg:w-1/8 mb-4 lg:mb-0 hidden sm:flex">
              <Categories />
            </div>

            <div className="flex-1 w-[90%] ml-auto mr-auto">
              <div className="search__mobile mb-4 lg:hidden">
                <Search />
              </div>
              <AutoSwiper />
              <div className="home mt-[30px] w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mx-auto">
                {Products.map((advert) => (
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
            </div>
          </div>
        </div>
      </div>
  )
}

