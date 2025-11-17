"use client";
import FullScreenPopup from '@/components/Popups/FullScreenPopup';
import { openAIService } from '@/lib/services/adminServices';
import React from 'react';
import Image from 'next/image';

interface OpenAIResponse {
    chatMessages: Array<{
        content: Array<{
            kind: number;
            text: string;
        }>;
    }>;
    reply: string;
}

export default function OpenAiPopup({ groupSlug }: { groupSlug: string | null | undefined }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [summary, setSummary] = React.useState<string | null>(null);
    const [rating, setRating] = React.useState<number | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const parseSummary = (reply: string) => {
        // Remove the #### delimiter if present
        const cleanedReply = reply.replace(/####\s*$/, '').trim();

        // Extract rating (looks for "Rating: X stars")
        const ratingMatch = cleanedReply.match(/Rating:\s*(\d+)\s*star/i);
        if (ratingMatch) {
            setRating(parseInt(ratingMatch[1]));
        }

        // Extract summary (everything before "Rating:")
        const summaryParts = cleanedReply.split(/Rating:/i);
        const summaryText = summaryParts[0].replace(/^Summary:\s*/i, '').trim();
        setSummary(summaryText || cleanedReply);
    };

    const handleLoadSummary = async () => {
        if (!groupSlug) {
            setError('No group slug provided');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSummary(null);
        setRating(null);

        try {
            const result: { data?: string | OpenAIResponse } = await openAIService.summarizeReviews(groupSlug);

            // Handle the response structure
            if (typeof result?.data === 'string') {
                parseSummary(result.data);
            } else if (
                result?.data &&
                typeof result.data === 'object' &&
                'reply' in result.data &&
                typeof (result.data as OpenAIResponse).reply === 'string'
            ) {
                parseSummary((result.data as OpenAIResponse).reply);
            } else {
                throw new Error('Invalid response format from API');
            }
        } catch (err) {
            console.error('Error loading summary:', err);
            setError(err instanceof Error ? err.message : 'Failed to load summary');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleReset = () => {
        setSummary(null);
        setRating(null);
        setError(null);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-8 h-8 transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-3 text-2xl font-bold text-white">{rating}/5</span>
            </div>
        );
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-4 right-4 z-40">
                <button
                    className="flex items-center gap-2 px-3 py-3 rounded-lg border font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl 
               bg-[#362222] border-[#423F3E] hover:bg-[#423F3E]"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open AI Summary"
                >
                    <Image
                        src="/openai-svgrepo-com.svg"
                        alt="OpenAI Logo"
                        className='invert'
                        width={24}
                        height={24}
                    />
                </button>
            </div>
        );
    }


    return (
        <FullScreenPopup onClose={handleClose} open={isOpen}>
            <div
                className="relative rounded-lg p-8 w-full border shadow-2xl max-w-4xl mx-auto"
                style={{ backgroundColor: '#2B2B2B', borderColor: '#423F3E' }}
            >
                {/* Close button */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold transition-colors leading-none w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800"
                    onClick={handleClose}
                    aria-label="Close"
                >
                    &times;
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white uppercase tracking-wide">
                        AI Review Summary
                    </h2>
                    <p className="text-gray-400 text-sm mt-2">
                        Powered by artificial intelligence
                    </p>
                </div>

                {/* Initial State */}
                {!summary && !isLoading && !error && (
                    <div className="text-center py-12">
                        <div className="mb-6">
                            <svg
                                className="w-16 h-16 mx-auto text-gray-600 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                            Generate an AI-powered summary and rating based on all customer reviews.
                        </p>
                        <button
                            className="px-10 py-4 rounded-lg border text-white text-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#362222', borderColor: '#423F3E' }}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.disabled) {
                                    e.currentTarget.style.backgroundColor = '#423F3E';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#362222';
                            }}
                            onClick={handleLoadSummary}
                            disabled={!groupSlug}
                        >
                            Generate Summary
                        </button>
                        {!groupSlug && (
                            <p className="text-red-400 text-sm mt-4">No product selected</p>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-16">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-white mb-6"></div>
                        <p className="text-gray-300 text-lg">Analyzing reviews...</p>
                        <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="py-8">
                        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-6">
                            <div className="flex items-start gap-3">
                                <svg
                                    className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div className="flex-1">
                                    <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                                    <p className="text-red-300">{error}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                className="px-6 py-3 rounded-lg border text-white font-medium transition-all duration-200"
                                style={{ backgroundColor: '#362222', borderColor: '#423F3E' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#423F3E';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#362222';
                                }}
                                onClick={handleLoadSummary}
                            >
                                Try Again
                            </button>
                            <button
                                className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 font-medium transition-all duration-200 hover:bg-gray-800"
                                onClick={handleReset}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                )}

                {/* Success State */}
                {summary && (
                    <div className="py-4">
                        {rating !== null && (
                            <div className="mb-6">
                                <h3 className="text-sm uppercase text-gray-400 font-semibold mb-3 tracking-wide">
                                    Overall Rating
                                </h3>
                                {renderStars(rating)}
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-sm uppercase text-gray-400 font-semibold mb-3 tracking-wide">
                                Summary
                            </h3>
                            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                                <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                                    {summary}
                                </p>
                            </div>
                        </div>

                        <button
                            className="px-6 py-3 rounded-lg border text-white font-medium transition-all duration-200"
                            style={{ backgroundColor: '#362222', borderColor: '#423F3E' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#423F3E';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#362222';
                            }}
                            onClick={handleReset}
                        >
                            Generate New Summary
                        </button>
                    </div>
                )}

                {/* Footer Close Button */}
                {!isLoading && (
                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <button
                            className="px-8 py-3 rounded-lg border text-gray-300 font-medium transition-all duration-200 hover:bg-gray-800"
                            style={{ borderColor: '#423F3E' }}
                            onClick={handleClose}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </FullScreenPopup>
    );
}