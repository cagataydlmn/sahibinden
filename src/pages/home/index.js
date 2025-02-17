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
      <div className="home">
        {Products.map((advert) => (
          <Link
            to={`adverts/${advert.id}`}
            className="home__advert"
            key={advert.id}
          >
            <div className="home__advert__image">
              <img
                src={advert.foto[0]}
                alt={`Ürün resmi: ${advert.brut}`}
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>{advert.title}</div>
            <div>{advert.price} TL</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
