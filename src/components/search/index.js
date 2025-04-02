"use client"

import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { getAddvert } from "../../firebase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faTimes } from "@fortawesome/free-solid-svg-icons"

export default function Search() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [result, setResult] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const searchBoxRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    getAddvert(setProducts)
  }, [])

  useEffect(() => {
    if (search) {
      setResult(products.filter((item) => item.title?.toLowerCase().includes(search.toLowerCase())))
      setIsOpen(true)
    } else {
      setResult([])
      setIsOpen(false)
    }
  }, [search, products])

  const handleClickOutside = (e) => {
    if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
      setIsOpen(false)
      setIsFocused(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const clearSearch = () => {
    setSearch("")
    inputRef.current.focus()
  }

  return (
      <div className="relative w-full max-w-lg" ref={searchBoxRef}>
        {/* Search Input Container */}
        <div
            className={`relative flex items-center overflow-hidden rounded-full 
          ${isFocused ? "ring-2 ring-indigo-500 shadow-lg" : "shadow-md"} 
          transition-all duration-300 bg-white`}
        >


          <input
              ref={inputRef}
              type="text"
              value={search}
              placeholder="Aramak istediğiniz ürünü yazın..."
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full py-3.5 pl-12 pr-4 text-base font-medium border-none focus:outline-none bg-transparent placeholder:text-gray-400"
          />

          {search && (
              <button
                  onClick={clearSearch}
                  className="absolute right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTimes} className="text-xs text-gray-500" />
              </button>
          )}

          {!search && (
              <div className="absolute right-4 flex items-center justify-center">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl text-gray-400" />
              </div>
          )}
        </div>

        {isOpen && (
            <div
                className="absolute top-14 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 mt-1 animate-fadeIn"
                style={{
                  animation: "fadeIn 0.2s ease-out",
                  transformOrigin: "top center",
                }}
            >
              {result.length > 0 ? (
                  <ul className="divide-y divide-gray-100 list-none max-h-[70vh] overflow-y-auto p-0 no-underline">
                    {result.map((item, index) => (
                        <li key={index} className="hover:bg-gray-50 transition-all duration-150 no-underline">
                          <Link to={`adverts/${item.id}`} className="flex items-center p-3 group">
                            <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                              <img
                                  src={item.foto[0] || "/placeholder.svg"}
                                  alt={`Ürün resmi: ${item.brut}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="no-underline text-gray-800 font-medium group-hover:text-indigo-600 transition-colors duration-150">
                                {item.title}
                              </div>
                              <div className="text-sm text-gray-500 mt-0.5">{item.price} TL</div>
                            </div>
                            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                Görüntüle
                              </div>
                            </div>
                          </Link>
                        </li>
                    ))}
                  </ul>
              ) : search ? (
                  <div className="p-6 text-center">
                    <div className="text-gray-400 text-lg mb-1">Sonuç bulunamadı</div>
                    <div className="text-sm text-gray-500">Farklı anahtar kelimeler ile tekrar deneyin</div>
                  </div>
              ) : null}
            </div>
        )}

        {/* Add this CSS to your global styles or inline */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `}</style>
      </div>
  )
}

