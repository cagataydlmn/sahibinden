import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, getDetail } from "../../firebase";
import { Menu } from "lucide-react";

export default function SubCategoryDetail() {
    const { id: categoryId, subCategoryId } = useParams();
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(data);
            } catch (error) {
                console.error("Veri alınırken hata oluştu:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (!subCategoryId) return;

        setLoading(true);
        getDetail(categoryId, subCategoryId, (detailData) => {
            setDetails(detailData.length > 0 ? detailData : []);
            setLoading(false);
        });
    }, [categoryId, subCategoryId]);

    useEffect(() => {
        if (!products.length || !subCategoryId) return;

        const filtered = products.filter((product) => product.altcategory === subCategoryId);
        setFilteredProducts(filtered);
    }, [products, subCategoryId]);

    return (
        <div className="flex flex-col md:flex-row mt-4 gap-4 relative">
            {menuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMenuOpen(false)}></div>
            )}

            <button
                className="md:hidden bg-gray-800 text-white p-2 rounded-lg flex items-center gap-2 z-50 relative"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <Menu size={24} />
                <span>Detaylar</span>
            </button>

            <div
                className={`fixed md:static left-0 top-0 h-full w-64 bg-gray-50 p-5 rounded-lg shadow-lg transform ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 transition-transform duration-300 ease-in-out md:w-auto md:block z-50`}
            >
                <h2 className="text-xl font-bold text-gray-800 mb-4">Detaylar</h2>
                {loading ? (
                    <p className="text-center text-gray-500">Yükleniyor...</p>
                ) : details.length === 0 ? (
                    <p className="text-center text-gray-500">Bu alt kategoriye ait detay bulunamadı.</p>
                ) : (
                    <ul className="list-none w-full pl-5 h-[400px] overflow-auto">
                        {details.map((detail) => (
                            <li key={detail.id} className="mb-4 w-full">
                                <Link
                                    to={`/category/${categoryId}/sub/${subCategoryId}/detail/${detail.id}`}
                                    className="font-semibold text-gray-700 no-underline"
                                >
                                    {detail.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="categoryDetail p-5 bg-gray-50 rounded-lg shadow-lg w-[90%] relative z-10">
                {filteredProducts.length === 0 ? (
                    <p className="text-center text-gray-500">Bu alt kategoriye ait ürün bulunamadı.</p>
                ) : (
                    <div className="home w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mx-auto">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product.id}
                                to={`/adverts/${product.id}`}
                                className="bg-white p-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 no-underline"
                            >
                                <div className="overflow-hidden rounded-xl">
                                    <img
                                        src={product.foto[0]}
                                        alt={`Ürün resmi: ${product.brut}`}
                                        className="w-full h-40 md:h-48 object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="text-base md:text-lg font-bold text-gray-800 truncate">
                                    {product.title}
                                </div>
                                <div className="text-sm md:text-md font-semibold text-indigo-600 mt-1">
                                    {product.price} TL
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
