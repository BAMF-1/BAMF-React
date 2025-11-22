// HomePage.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SplitText from "./SplitText";
import AnimatedContent from "./AnimatedContent";
import Waves from "./Waves";
import FlowingMenu from "./FlowingMenu";
import CurvedLoop from "./CurvedLoop";
import { itemService } from "@/lib/services/adminServices";
import GlareHover from "./GlareHover";

export default function HomePage() {
    const [email, setEmail] = useState("");

    const demoItems = [
        { name: "Leather Biker Jacket", price: "$199", image: "https://picsum.photos/600/400?random=1", link: "/shop" },
        { name: "Studded Belt", price: "$49", image: "https://picsum.photos/600/400?random=2", link: "/shop" },
        { name: "Band T-Shirt", price: "$29", image: "https://picsum.photos/600/400?random=3", link: "/shop" },
        { name: "Spiked Wristband", price: "$19", image: "https://picsum.photos/600/400?random=4", link: "/shop" },
    ];

    const categories = [
        {
            title: "TOPS",
            description: "Leather jackets, denim vests, and rugged outerwear that define your rebellious style.",
            href: "/shop/tops",
            accentColor: "#8B4513",
        },
        {
            title: "BOTTOMS",
            description: "Distressed jeans, leather pants, and edgy skirts that complete your look with attitude.",
            href: "/shop/bottoms",
            accentColor: "#C0C0C0",
        },
        {
            title: "ACCESSORIES",
            description: "Bold accessories like studded belts, statement jewelry, and rugged bags to elevate your ensemble.",
            href: "/shop/accessories",
            accentColor: "#1C1C1C",
        },
        {
            title: "FOOTWEAR",
            description: "Boots and shoes that combine durability with rebellious style for every step you take.",
            href: "/shop/footwear",
            accentColor: "#654321",
        }
    ];

    const [featuredProducts, setFeaturedProducts] = useState<Array<{ link: string, name: string; price: string; image: string }>>(demoItems);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await itemService.getAll(1, 4);
                if (response && response.data && Array.isArray(response.data)) {
                    const mappedProducts = response.data.map((item: any) => {
                        const categorySlug = item.mainCategory.toLowerCase();

                        const fullLink = `/shop/${categorySlug}/${item.slug}?sku=${item.sku}`;
                        return {
                            name: item.groupName,
                            price: `$${item.price.toFixed(2)}`,
                            image: item.primaryImageUrl,
                            link: fullLink
                        };
                    });
                    console.log("Mapped Products:", mappedProducts);
                    setFeaturedProducts(mappedProducts);
                } else {
                    console.error("Unexpected data structure:", response);
                }
            } catch (error) {
                console.error("Error fetching featured products:", error);
            }
        };
        fetchFeaturedProducts();
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#171010" }}>

            {/* Hero Section */}
            <section
                className="h-screen relative px-6 py-24 md:py-32 overflow-hidden"
                style={{ backgroundColor: "#171010" }}
            >
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="max-w-3xl">
                        <SplitText
                            text="DEFY THE\nORDINARY"

                            breakOn="\n"
                            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                            delay={100}
                            duration={0.6}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="left"
                        />
                        <SplitText
                            className="text-xl text-white mb-8 max-w-xl p-4 rounded"
                            text="Premium leather, metal, and attitude. For those who live on the edge and dress like they mean it."
                            textAlign="left"
                            splitType="words"
                            delay={125}
                            duration={0.6}
                            ease="power3.out"
                            from={{ opacity: 0, y: 20 }}
                            to={{ opacity: 1, y: 0 }}

                        />

                        <div className="flex flex-col sm:flex-row gap-12 sm:gap-4">
                            <AnimatedContent
                                delay={1.5}
                                distance={25}
                            >
                                <Link
                                    href="/shop"
                                    className="px-8 py-4 text-white font-bold text-sm tracking-wider transition-all transform hover:scale-105 cursor-pointer text-center"
                                    style={{ backgroundColor: "#362222" }}
                                >
                                    SHOP NOW
                                </Link>
                            </AnimatedContent>
                            <AnimatedContent
                                delay={1.75}
                                distance={25}
                            >
                                <Link
                                    href="/about"
                                    className="px-8 py-4 text-white font-medium text-sm tracking-wider border transition-colors cursor-pointer text-center hover:bg-[#2B2B2B]"
                                    style={{ borderColor: "#423F3E", backgroundColor: "transparent" }}
                                >
                                    ABOUT BAMF
                                </Link>
                            </AnimatedContent>
                        </div>
                    </div>
                </div>

                {/* Full-width hero image, keep bike fully visible */}
                <div className="not-sm:hidden absolute bottom-0 left-0 w-full pointer-events-none z-0">
                    <Image
                        src="/BAMF_HEADER.png"
                        alt="Grey mountain landscape with bike in foreground"
                        width={5564}
                        height={1745}
                        className="w-full h-auto object-contain"
                        priority
                    />
                </div>
                <div
                    className="absolute bottom-0 left-0 w-full pointer-events-none border-b-12 border-[#171010] z-0"
                >
                </div>
            </section>

            {/* Featured Products */}
            <section className="min-h-screen relative" style={{ backgroundColor: "#2B2B2B" }}>
                {/* Background DotGrid */}
                <div className="absolute inset-0">
                    <Waves
                        lineColor="#171010"
                        backgroundColor="rgba(255, 255, 255, 0.2)"
                        waveSpeedX={0.02}
                        waveSpeedY={0.01}
                        waveAmpX={40}
                        waveAmpY={20}
                        friction={0.9}
                        tension={0.01}
                        maxCursorMove={0}
                        xGap={12}
                        yGap={36}
                    />
                </div>
                <div className="relative z-10 h-screen flex flex-col items-center w-full pt-12">
                    <CurvedLoop
                        marqueeText="FEATURED PRODUCTS ✦ FEATURED PRODUCTS ✦ FEATURED PRODUCTS ✦ FEATURED PRODUCTS ✦ "
                        className="text-white text-lg font-semibold underline-offset-4"
                        speed={.75}
                        curveAmount={50}
                    />
                    <div className="flex-1 w-full flex flex-col">
                        <FlowingMenu
                            items={featuredProducts.map((item) => ({
                                ...item,
                                text: item.name,
                            }))}
                        />
                    </div>
                </div>
            </section>

            {/* Categories */}
            {/* <ScrollStackSection /> */}
            <section className="py-20 px-6" style={{ backgroundColor: "#171010" }}>
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">SHOP BY CATEGORY</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                        {
                            categories.map((category) => (
                                <Link href={category.href} key={category.title} className="block group">
                                    <GlareHover
                                        width="100%"
                                        height="160px"
                                        background="#2B2B2B"
                                        borderRadius="4px"
                                        borderColor="#423F3E"
                                        glareColor="#ffffff"
                                        glareOpacity={0.25}
                                        glareAngle={60}
                                        transitionDuration={900}
                                        className="transition-all duration-300 group-hover:border-[#8B4513]!"
                                    >
                                        {/* Accent bar */}
                                        <div
                                            className="absolute top-0 left-0 w-full h-0.5"
                                            style={{ backgroundColor: category.accentColor }}
                                        />

                                        {/* Content Container */}
                                        <div className="relative h-full flex items-center px-6 py-5">
                                            <div className="flex-1 pr-4">
                                                <h3 className="text-xl font-bold text-white mb-1.5 tracking-wider">
                                                    {category.title}
                                                </h3>
                                                <p className="text-gray-400 leading-relaxed line-clamp-2 text-xl">
                                                    {category.description}
                                                </p>
                                            </div>

                                            {/* Arrow */}
                                            <div className="shrink-0 group-hover:translate-x-1 transition-transform duration-300">
                                                <svg
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2.5}
                                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Gradient overlay on hover */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                                            style={{
                                                background: `linear-gradient(90deg, ${category.accentColor} 0%, transparent 100%)`
                                            }}
                                        />
                                    </GlareHover>
                                </Link>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="px-6 py-20" style={{ backgroundColor: "#362222" }}>
                <div className="max-w-2xl mx-auto text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">JOIN THE REBELLION</h3>
                    <p className="text-gray-300 mb-8">Get exclusive drops, early access, and 15% off your first order</p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-4 py-3 text-white placeholder-gray-500 border outline-none"
                            style={{ backgroundColor: "#171010", borderColor: "#423F3E" }}
                        />
                        <button className="px-8 py-3 text-white font-bold text-sm tracking-wider transition-all cursor-pointer"
                            style={{ backgroundColor: "#2B2B2B" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#171010"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2B2B2B"}>
                            SUBSCRIBE
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}