"use client"
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    category_id: number;
    image_urls: string | string[];
    features?: string[];
}

const Product = ({ slug }: { slug: string }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [_currentSlide, setCurrentSlide] = useState(0);
    const [sliderInitialized, setSliderInitialized] = useState(false);
    const sliderRef = useRef<Slider | null>(null);
    const { addToCart } = useCart();

    const next = () => {
        sliderRef.current?.slickNext();
    };

    const previous = () => {
        sliderRef.current?.slickPrev();
    };

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: false,
        centerPadding: '0px',
        arrows: false,
        swipeToSlide: true,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    centerMode: false,
                    infinite: false,
                    initialSlide: 0
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    infinite: false,
                    initialSlide: 0
                },
            },
        ],
        afterChange: (current: number) => {
            setCurrentSlide(current);
        },
        onInit: () => {
            setSliderInitialized(true);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products`);
                const products = await response.json();
                setProducts(products);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    useEffect(() => {
        if (products.length > 0 && sliderRef.current) {
            sliderRef.current.slickGoTo(0);
            setSliderInitialized(true);
        }
    }, [products]);

    const handleAddToCart = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Please login to view your cart');
            setIsLoading(false);
            return;
        }

        try {
            await addToCart(Number(product?.id), quantity);
            setMessage('Product added to cart successfully!');
        } catch (error) {
            setMessage('Error adding to cart');
            console.error("Error adding to cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const foundProduct = (slug: string) => {
        return products.find((p: Product) => p.slug === slug);
    };

    const product = foundProduct(slug);

    const relatedProducts = products.filter((p: Product) =>
        p.category_id === product?.category_id && p.id !== product?.id
    );

    const cleanImageUrl = (url: string | null) => {
        if (!url) return null;
        return url.replace(/\\"/g, '').replace(/\\/g, '').replace(/^"/, '').replace(/"$/, '');
    };

    const cleanImageUrls = (urls: string | string[]) => {
        if (!urls) return [];
        if (typeof urls === 'string') {
            try {
                urls = JSON.parse(urls);
            } catch (error) {
                console.error(error);
                return [];
            }
        }
        return (urls as string[]).map((url: string) => cleanImageUrl(url));
    };

    if (!products.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Product not found</div>
            </div>
        );
    }

    const productImages = cleanImageUrls(product.image_urls) || ["/api/placeholder/900/1600"];
    const totalPrice = (product.price * quantity).toFixed(2);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Back to Products
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="flex flex-col">
                    <div className="relative pb-[80.78%] rounded-lg overflow-hidden bg-gray-100 mb-4">
                        <Image
                            src={productImages[selectedImage] || "/api/placeholder/900/1600"}
                            alt={`${product.name} - Image ${selectedImage + 1}`}
                            layout="fill"
                            objectFit="cover"
                            priority
                            className="absolute inset-0"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {productImages.map((image, index) => (
                            <div
                                key={index}
                                className={`relative pb-[67.78%] rounded-lg overflow-hidden bg-gray-100 cursor-pointer ${
                                    selectedImage === index ? 'ring-2 ring-blue-600' : ''
                                }`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <Image
                                    src={image || "/api/placeholder/900/1600"}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    layout="fill"
                                    objectFit="cover"
                                    className="absolute inset-0"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="lg:sticky lg:top-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-2xl font-bold text-gray-900">
                                ₹{totalPrice}
                                {quantity > 1 && (
                                    <span className="text-sm text-gray-500 ml-2">
                                        (₹{product.price} each)
                                    </span>
                                )}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                In Stock
                            </span>
                        </div>
                    </div>

                    <div className="prose prose-sm mb-6">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">{product.description}</p>
                    </div>

                    {/* Product Features */}
                    {product.features && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Features</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-2">
                                {product.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Add to Cart Section */}
                    <div className="border-t pt-6">
                        <div className="flex items-center gap-4 mb-4">
                            <label className="text-sm font-medium text-gray-700">Quantity</label>
                            <div className="flex items-center border rounded-md">
                                <button
                                    className="px-3 py-1 border-r hover:bg-gray-100"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </button>
                                <span className="px-4 py-1">{quantity}</span>
                                <button
                                    className="px-3 py-1 border-l hover:bg-gray-100"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div className={`mb-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            onClick={handleAddToCart}
                            disabled={isLoading}
                            className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                    </svg>
                                    Add to Cart
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                    <div className="relative">
                        {/* Previous button */}
                        {sliderInitialized && relatedProducts.length > 1 && (
                            <button
                                onClick={previous}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                                aria-label="Previous slide"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                                </svg>
                            </button>
                        )}

                        {/* Slider */}
                        <div className={`px-12 w-full ${!sliderInitialized ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                            <Slider ref={sliderRef} {...sliderSettings}>
                                {relatedProducts.map((relatedProduct) => (
                                    <div key={relatedProduct.id} className="px-2">
                                        <Link
                                            href={`/product/${relatedProduct.slug}`}
                                            className="block"
                                        >
                                            <div className="group relative">
                                                <div className="relative pb-[100%] rounded-lg overflow-hidden bg-gray-100 mb-3">
                                                    <Image
                                                        src={cleanImageUrls(relatedProduct.image_urls)[0] || "/api/placeholder/900/1600"}
                                                        alt={relatedProduct.name}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="group-hover:opacity-75 transition-opacity duration-300"
                                                    />
                                                </div>
                                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                                    {relatedProduct.name}
                                                </h3>
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    ${relatedProduct.price}
                                                </p>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </Slider>
                        </div>

                        {/* Next button */}
                        {sliderInitialized && relatedProducts.length > 1 && (
                            <button
                                onClick={next}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                                aria-label="Next slide"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Product;
