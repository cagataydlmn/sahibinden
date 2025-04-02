import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../../context";
import { getSubCategory } from "../../firebase";
import { FiChevronDown, FiGrid } from "react-icons/fi";

export default function Categories() {
    const { categories } = useSite();
    const [subCategories, setSubCategories] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        categories.forEach((category) => {
            getSubCategory(category.id, (subCategoriesData) => {
                setSubCategories((prev) => ({
                    ...prev,
                    [category.id]: subCategoriesData,
                }));
            });
        });
    }, [categories]);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <div className="relative w-full bg-gradient-to-r from-indigo-600 to-blue-500">
            <div className="w-[90%] mx-auto flex items-center px-4 py-3">
                <button
                    ref={buttonRef}
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-white hover:bg-white/20"
                >
                    <FiGrid className="text-lg" />
                    <span>Tüm Kategoriler</span>
                    <FiChevronDown className={`transition ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Ana Kategoriler */}
                <div className="ml-6 hidden md:flex items-center gap-1">
                    {categories.slice(0, 6).map((category) => (
                        <Link
                            key={category.id}
                            to={`/category/${category.id}`}
                            className="rounded-lg px-3 py-2 text-white/90 hover:bg-white/10 hover:text-white no-underline"
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute left-0 w-full bg-white shadow-xl z-50 rounded-b-lg"
                >
                    <div className="w-full p-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {categories.map((category) => (
                                <div key={category.id} className="mb-4">
                                    <Link
                                        to={`/category/${category.id}`}
                                        className="block text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200 no-underline"
                                    >
                                        {category.name}
                                    </Link>
                                    <div className="space-y-2 p-0">
                                        {subCategories[category.id]?.map((subCategory) => (
                                            <Link
                                                key={subCategory.id}
                                                to={`/category/${category.id}/sub/${subCategory.id}`}
                                                className="block text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition no-underline !pl-0"
                                            >
                                                {subCategory.name}
                                            </Link>
                                        ))}
                                        {(!subCategories[category.id] || subCategories[category.id].length === 0) && (
                                            <span className="text-gray-400 text-sm">Alt kategori yok</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}