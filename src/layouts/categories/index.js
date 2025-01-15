import { Link } from "react-router-dom";
import { useSite } from "../../context";

export default function Categories() {
  const {
    selectedCategory,
    categories,
  } = useSite();

  return (
    <div className="categoryHome">
      <div className="categoryHome__general">

      {categories.map((category) => (
        <Link  to={`/category/${category.id}`}  key={category.id}>
          {category.name}
        </Link>
      ))}
    </div>
    </div>

  );
}
