import { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import clsx from 'clsx';

export default function UserDashboard() {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        document.title = 'Submit Feedback | Fynd AI';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !review) return;

        setLoading(true);
        const API_URL = 'https://fynd-task.onrender.com';

        try {
            const res = await fetch(`${API_URL}/api/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, review }),
            });
            const data = await res.json();
            if (data.success) {
                setResponse(data.aiResponse);
                setRating(0);
                setReview('');
            }
        } catch (error) {
            console.error('Error submitting:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 transform transition-all hover:shadow-2xl">
                <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">We Value Your Feedback</h1>
                <p className="text-slate-500 text-center mb-8">Help us improve your experience</p>

                {response ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-300">
                        <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <Star className="w-6 h-6 text-emerald-600 fill-emerald-600" />
                        </div>
                        <div className="text-emerald-800 font-bold text-xl mb-2">Thank You!</div>
                        <p className="text-emerald-600 mb-6">{response}</p>
                        <button
                            onClick={() => setResponse(null)}
                            className="text-sm text-emerald-700 hover:text-emerald-900 font-medium underline underline-offset-4 cursor-pointer transition-colors"
                        >
                            Submit another review
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="group focus:outline-none transition-transform hover:scale-110 cursor-pointer p-1"
                                >
                                    <Star
                                        className={clsx(
                                            "w-10 h-10 transition-all duration-200",
                                            star <= rating
                                                ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                                                : "text-slate-200 group-hover:text-amber-200"
                                        )}
                                    />
                                </button>
                            ))}
                        </div>

                        <div>
                            <label htmlFor="review" className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                                Your Review
                            </label>
                            <textarea
                                id="review"
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-800 placeholder-slate-400 outline-none"
                                placeholder="Tell us about your experience..."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !rating || !review}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Submit Feedback</span>
                                    <Send className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
