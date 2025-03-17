import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getAddvert } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Search() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Açılır kutunun durumu
  const searchBoxRef = useRef(null); // Searchbox referansı

  useEffect(() => {
    getAddvert(setProducts);
  }, []);

  useEffect(() => {
    if (search) {
      setResult(
        products.filter((item) =>
          item.title?.toLowerCase().includes(search.toLowerCase())
        )
      );
      setIsOpen(true); // Eğer arama varsa kutuyu aç
    } else {
      setResult([]);
      setIsOpen(false); // Arama boşsa kutuyu kapat
    }
  }, [search, products]);

  const handleClickOutside = (e) => {
    // Searchbox'ın dışına tıklama kontrolü
    if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
      setIsOpen(false); // Kutuyu kapat
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
      <div className="relative w-full max-w-lg ">
        <div className="relative flex items-center">
          <input
              type="text"
              placeholder="Aramak istediğiniz ürünü yazın..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full  text-lg border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all "
          />

          <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute right-3 text-gray-500 text-4xl cursor-pointer"
          />
        </div>

        {isOpen && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
              {result.length > 0 ? (
                  <ul className="divide-y p-2 pt-0 divide-gray-200 list-none max-h-60 overflow-y-auto">
                    {result.map((item, index) => (
                        <li key={index} className="hover:bg-gray-100 transition-all">
                          <Link to={`adverts/${item.id}`} className="flex items-center p-4">
                            <div className="w-16 h-16 flex-shrink-0">
                              <img
                                  src={item.foto[0]}
                                  alt={`Ürün resmi: ${item.brut}`}
                                  className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="ml-4 text-gray-800 font-medium text-lg">{item.title}</div>
                          </Link>
                        </li>
                    ))}
                  </ul>
              ) : search ? (
                  <div className="p-4 text-gray-500 text-lg">Sonuç bulunamadı.</div>
              ) : null}
            </div>
        )}
      </div>
  );
}
