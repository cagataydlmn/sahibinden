import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getAddvert } from "../../firebase";

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
    <div className="nav__general__input" ref={searchBoxRef}>
      <input
        placeholder="Aramak istediğiniz ürün"
        onChange={(e) => setSearch(e.target.value)}
      />
      {isOpen && result.length > 0 ? ( // Eğer sonuç ve isOpen varsa göster
        <ul className="results-dropdown">
          {result.map((item, index) => (
            <li key={index} className="result-item">
              <Link to={`adverts/${item.id}`} key={item.id}>
                <div className="search__div">
                  <div className="search__img">
                    <img
                      src={item.foto[0]}
                      alt={`Ürün resmi: ${item.brut}`}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="search__title">{item.title}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : isOpen && search ? (
        <div>Sonuç bulunamadı.</div>
      ) : null}
    </div>
  );
}
