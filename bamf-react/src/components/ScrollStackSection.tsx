import React, { useEffect, useRef, useState } from "react";
import Link from 'next/link';

export interface ScrollStackCard {
    title: string;
    subtitle?: string;
    badge?: string;
    backgroundImage?: string;
    content?: React.ReactNode;
}

interface ScrollStackProps {
    cards: ScrollStackCard[];
    backgroundColor?: string;
    cardHeight?: string;
    animationDuration?: string;
    sectionHeightMultiplier?: number;
    intersectionThreshold?: number;
    className?: string;
}

const defaultBackgrounds = [
    "https://images.pexels.com/photos/6985136/pexels-photo-6985136.jpeg",
    "https://images.pexels.com/photos/6985128/pexels-photo-6985128.jpeg",
    "https://images.pexels.com/photos/2847648/pexels-photo-2847648.jpeg",
];

const ScrollStack: React.FC<ScrollStackProps> = ({
    cards,
    backgroundColor = "bg-background",
    cardHeight = "40vh",
    animationDuration = "0.5s",
    sectionHeightMultiplier = 2.5,
    intersectionThreshold = 0.1,
    className = "",
}) => {
    const scrollableSectionRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ticking = useRef(false);
    const cardCount = Math.min(cards.length, 5);

    const cardStyle = {
        height: cardHeight,
        maxHeight: "400px",
        borderRadius: "20px",
        transition: `transform ${animationDuration} cubic-bezier(0.19, 1, 0.22, 1), opacity ${animationDuration} cubic-bezier(0.19, 1, 0.22, 1)`,
        willChange: "transform, opacity",
    };

    // Intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsIntersecting(entry.isIntersecting);

                // Reset when scrolling away from the component
                if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
                    if (scrollableSectionRef.current) {
                        scrollableSectionRef.current.scrollTop = 0;
                    }
                    setActiveCardIndex(0);
                }
            },
            { threshold: intersectionThreshold }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, [intersectionThreshold]);

    // Handle internal scroll for card animation
    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                requestAnimationFrame(() => {
                    if (!sectionRef.current || !cardsContainerRef.current) return;

                    const scrollContainer = scrollableSectionRef.current;
                    if (!scrollContainer) return;

                    const scrollTop = scrollContainer.scrollTop;
                    const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
                    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

                    let newActiveIndex = 0;
                    const progressPerCard = 1 / cardCount;
                    for (let i = 0; i < cardCount; i++) {
                        if (progress >= progressPerCard * (i + 1)) {
                            newActiveIndex = i + 1;
                        }
                    }

                    setActiveCardIndex(Math.min(newActiveIndex, cardCount - 1));
                    ticking.current = false;
                });
                ticking.current = true;
            }
        };

        const scrollElement = scrollableSectionRef.current;
        scrollElement?.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => {
            scrollElement?.removeEventListener("scroll", handleScroll);
        };
    }, [cardCount]);

    const getCardTransform = (index: number) => {
        const isVisible = isIntersecting && activeCardIndex >= index;
        const scale = 0.92 + index * 0.04;
        let translateY = "80px";

        if (isVisible) {
            translateY = `${60 - index * 20}px`;
        }

        return {
            transform: `translateY(${translateY}) scale(${scale})`,
            opacity: isVisible ? (index === 0 ? 0.9 : 1) : 0,
            zIndex: 10 + index * 10,
            pointerEvents: isVisible ? "auto" : "none",
        };
    };

    return (
        <section
            ref={scrollableSectionRef}
            className="relative w-full h-[65vh] overflow-y-auto"
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            <style jsx>{`
                section::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <div
                ref={sectionRef}
                className={`relative ${className}`}
                style={{ height: `${sectionHeightMultiplier * 100}vh` }}
            >
                <div
                    className={`sticky top-0 w-full h-[65vh] flex items-center 
            justify-center overflow-hidden ${backgroundColor}`}
                >
                    {/* Scroll Progress Dots */}
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-50">
                        <div className="text-white/40 text-xs font-medium mb-1 tracking-wider">
                            SCROLL
                        </div>
                        {cards.slice(0, cardCount).map((_, index) => (
                            <div
                                key={index}
                                className="relative flex items-center justify-center"
                            >
                                <div
                                    className="transition-all duration-300"
                                    style={{
                                        width: activeCardIndex >= index ? '12px' : '8px',
                                        height: activeCardIndex >= index ? '12px' : '8px',
                                        borderRadius: '50%',
                                        backgroundColor: activeCardIndex === index
                                            ? '#ffffff'
                                            : activeCardIndex > index
                                                ? 'rgba(255, 255, 255, 0.5)'
                                                : 'rgba(255, 255, 255, 0.2)',
                                        boxShadow: activeCardIndex === index
                                            ? '0 0 8px rgba(255, 255, 255, 0.5)'
                                            : 'none',
                                    }}
                                />
                            </div>
                        ))}
                        <div className="text-white/40 text-xs font-medium mt-1">
                            {activeCardIndex + 1}/{cardCount}
                        </div>
                    </div>
                    <div className="container px-6 lg:px-8 mx-auto h-full flex flex-col justify-center">
                        <div
                            ref={cardsContainerRef}
                            className="relative w-full max-w-5xl mx-auto flex-shrink-0"
                            style={{ height: cardHeight }}
                        >
                            {cards.slice(0, 5).map((card, index) => {
                                const cardTransform = getCardTransform(index);
                                const backgroundImage =
                                    card.backgroundImage ||
                                    defaultBackgrounds[index % defaultBackgrounds.length];

                                return (
                                    <div
                                        key={index}
                                        className="absolute z-50 overflow-hidden shadow-xl transition-all duration-300"
                                        style={{
                                            ...cardStyle,
                                            top: 0,
                                            left: "50%",
                                            transform: `translateX(-50%) ${cardTransform.transform}`,
                                            width: "100%",
                                            maxWidth: "100%",
                                            opacity: cardTransform.opacity,
                                            zIndex: cardTransform.zIndex,
                                            pointerEvents: cardTransform.pointerEvents as React.CSSProperties["pointerEvents"],
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 to-black/80"
                                            style={{
                                                backgroundImage: `url('${backgroundImage}')`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundBlendMode: "overlay",
                                            }}
                                        />

                                        {card.badge && (
                                            <div className="absolute top-4 right-4 z-20">
                                                <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white">
                                                    <span className="text-sm font-medium">
                                                        {card.badge}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative z-10 p-5 sm:p-6 md:p-4 h-full flex items-center">
                                            {card.content ? (
                                                card.content
                                            ) : (
                                                <div className="max-w-lg">
                                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                                                        {card.title}
                                                    </h3>
                                                    {card.subtitle && (
                                                        <p className="text-lg text-white/80">
                                                            {card.subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Helper component for category cards
const CategoryCard: React.FC<{
    title: string;
    description: string;
    href: string;
    accentColor?: string;
}> = ({ title, description, href, accentColor = "#423F3E" }) => (
    <div className="relative w-full h-full flex items-center justify-center">
        <Link
            href={href}
            className="relative w-full h-full block transition-all duration-300 cursor-pointer rounded-lg overflow-hidden group"
            style={{
                backgroundColor: "#2B2B2B",
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
        >
            <div
                className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-300"
                style={{
                    backgroundColor: accentColor,
                    opacity: 0.4
                }}
            />
            <div className="relative p-8 flex flex-col justify-between">
                <div>
                    <h4 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight group-hover:text-gray-100 transition-colors">
                        {title}
                    </h4>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed group-hover:text-gray-300 transition-colors">
                        {description}
                    </p>
                </div>
                <div className="flex items-center gap-2 text-white text-xs font-semibold tracking-widest mt-4">
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                        EXPLORE
                    </span>
                    <span className="transition-transform duration-300 group-hover:translate-x-2">
                        →
                    </span>
                </div>
            </div>
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, rgba(54, 34, 34, 0.3) 0%, transparent 100%)'
                }}
            />
        </Link>
    </div>
);

// Main ScrollStackSection component
const ScrollStackSection: React.FC = () => {
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
        },
        {
            title: "SHOP ALL",
            description: "Explore the full range of BAMF gear and find your perfect fit for rebellion.",
            href: "/shop/",
            accentColor: "#696969",
        },
    ];

    const cards = categories.map(cat => ({
        title: cat.title,
        subtitle: cat.description,
        content: (
            <CategoryCard
                title={cat.title}
                description={cat.description}
                href={cat.href}
                accentColor={cat.accentColor}
            />
        ),
    }));

    return (
        <div style={{ backgroundColor: "#171010" }}>
            <div className="max-w-7xl mx-auto px-6 pt-20 pb-8">
                <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
                    SHOP BY STYLE
                </h2>
                <p className="text-gray-400 text-lg mt-4">
                    Find your edge. Express your rebellion.
                </p>
            </div>
            <ScrollStack
                cards={cards}
                backgroundColor="bg-[#171010]"
                cardHeight="40vh"
                sectionHeightMultiplier={2.5}
            />
        </div>
    );
};

export default ScrollStackSection;