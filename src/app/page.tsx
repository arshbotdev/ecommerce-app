"use client"
import React, { useEffect, useState, useRef } from 'react';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import HeroBanner from "@/components/HeroBanner";
import Link from "next/link";
import Image from 'next/image';
import { ReactNode } from 'react';

const Badge = ({ children, variant = 'default', className = '', ...props }: { children: ReactNode, variant?: 'default' | 'secondary' | 'success', className?: string }) => {
  const baseStyle = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800'
  };

  return (
      <span className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_urls: string | string[];
  category_id: number;
  slug: string;
}

interface Category {
  id: number;
  name: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const sliderRefs = useRef<{ [key: number]: Slider | null }>({});

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
        .then((res) => res.json())
        .then((data) => setCategories(data));

    // Fetch products
    fetch('/api/products')
        .then((res) => res.json())
        .then((data) => setProducts(data));
  }, []);

  const next = (categoryId: number) => {
    if (sliderRefs.current[categoryId]) {
      sliderRefs.current[categoryId]?.slickNext();
    }
  };

  const previous = (categoryId: number) => {
    if (sliderRefs.current[categoryId]) {
      sliderRefs.current[categoryId]?.slickPrev();
    }
  };

  const productSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    centerMode: false,
    centerPadding: '0px',
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };


  const cleanImageUrl = (url: string): string | null => {
    if (!url) return null;
    return url.replace(/\\"/g, '').replace(/\\/g, '').replace(/^"/, '').replace(/"$/, '');
  };

  const cleanImageUrls = (urls: string | string[]) => {
    if (!urls) return [];
    if (typeof urls === 'string') {
      try {
        urls = JSON.parse(urls);
      } catch (e) {
        console.log(e)
        return [];
      }
    }
    return Array.isArray(urls) ? urls.map((url: string) => cleanImageUrl(url)) : [];
  };

  return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroBanner />

        {categories.map((category: Category) => {
          const categoryProducts = products.filter((product) => product.category_id === category.id);

          return (
              <div key={category.id} className="my-12">
                <h2 className="text-2xl first-letter:uppercase font-bold mb-6">{category.name}</h2>

                <div className="relative group">
                  {/* Navigation buttons - Now more prominent and always visible */}
                  <button
                      onClick={() => previous(category.id)}
                      className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg hover:bg-gray-100 transform -translate-x-5"
                      aria-label="Previous slide"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>

                  <div className="px-8">
                    <Slider
                        ref={slider => { sliderRefs.current[category.id] = slider; }}
                        {...productSettings}
                        className="w-full"
                    >
                      {categoryProducts.map((product) => {
                        const cleanedUrls = cleanImageUrls(product.image_urls);
                        const firstImage = cleanedUrls[0] || "/api/placeholder/900/1600";
                        return (
                            <div key={product.id} className="px-2">
                              <Link href={`/product/${product.slug}`} className="block h-full">
                                <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 h-full flex flex-col">
                                  <div className="relative pb-[67.78%]">
                                    <Image
                                        src={firstImage}
                                        alt={product.name}
                                        layout="fill"
                                        objectFit="cover"
                                        className="absolute inset-0"
                                    />
                                  </div>

                                  <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                                      {product.description}
                                    </p>
                                    <div className="mt-auto">
                                      <Badge className="mb-3">
                                        {category.name}
                                      </Badge>
                                      <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-gray-900">
                                    ${product.price}
                                  </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                        );
                      })}
                    </Slider>
                  </div>

                  <button
                      onClick={() => next(category.id)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-lg hover:bg-gray-100 transform translate-x-5"
                      aria-label="Next slide"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
          );
        })}
      </div>
  );
};

export default ProductsPage;