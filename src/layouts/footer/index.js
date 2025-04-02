import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-10 pb-6">
            <div className="container mx-auto ">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-center md:text-left">

                    <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-4 text-white">Hakkımızda</h3>
                        <p className="text-gray-400 text-sm md:text-base">
                            Türkiye'nin en güvenilir ikinci el alışveriş platformu. Hızlı ve güvenli satış deneyimi sunuyoruz.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-4 text-white">Bağlantılar</h3>
                        <ul className="space-y-2 text-sm md:text-base list-none p-0 no-underline">
                            <li><Link to="/" className="text-gray-400 hover:text-white no-underline">Anasayfa</Link></li>
                            <li><Link to="/" className="text-gray-400 hover:text-white no-underline">İlanlar</Link></li>
                            <li><Link to="/category" className="text-gray-400 hover:text-white no-underline">Kategoriler</Link></li>
                            <li><Link to="/" className="text-gray-400 hover:text-white no-underline">Hakkımızda</Link></li>
                            <li><Link to="/" className="text-gray-400 hover:text-white no-underline">İletişim</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-4 text-white">İletişim</h3>
                        <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                            <li className="flex items-center justify-center md:justify-start gap-2">
                                <FaMapMarkerAlt className="text-lg text-yellow-500" /> İstanbul, Türkiye
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-2">
                                <FaPhone className="text-lg text-yellow-500" /> <Link to="tel:+905322645827" className="text-white no-underline">+90 532 264 58 27</Link>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-2">
                                <FaEnvelope className="text-lg text-yellow-500" /> <Link to="mailto:cagataydalaman@outlook.com" className="no-underline text-white">cagataydalaman@outlook.com</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg md:text-xl font-semibold mb-4 text-white">Bizi Takip Edin</h3>
                        <div className="flex justify-center md:justify-start space-x-3">
                            <Link to="/" className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition text-white">
                                <FaFacebookF className="text-lg" />
                            </Link>
                            <Link to="/" className="p-2 rounded-full bg-gray-800 hover:bg-pink-500 transition text-white">
                                <FaInstagram className="text-lg" />
                            </Link>
                            <Link to="/" className="p-2 rounded-full bg-gray-800 hover:bg-blue-400 transition text-white">
                                <FaTwitter className="text-lg" />
                            </Link>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-800 pt-4 text-center text-gray-400 text-sm md:text-base">
                    <p>© {new Date().getFullYear()} MontenegroBazaar Tüm Hakları Saklıdır.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
