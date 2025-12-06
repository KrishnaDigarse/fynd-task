import { useState, useEffect } from 'react';
import { Star, RefreshCw, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSubmissions = async () => {
        setLoading(true);
        const API_URL = 'https://fynd-task.onrender.com';

        try {
            const res = await fetch(`${API_URL}/api/submissions`);
            const data = await res.json();
            setSubmissions(data);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'Admin Dashboard | Fynd AI';
        fetchSubmissions();
    }, []);

    // Analytics
    const averageRating = submissions.length
        ? (submissions.reduce((acc, curr) => acc + curr.rating, 0) / submissions.length).toFixed(1)
        : '0.0';

    const sentimentCounts = submissions.reduce((acc, curr) => {
        if (curr.rating >= 4) acc.positive++;
        else if (curr.rating === 3) acc.neutral++;
        else acc.negative++;
        return acc;
    }, { positive: 0, neutral: 0, negative: 0 });

    return (
        <main className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-slate-500 mt-1">Live overview of customer feedback and AI insights</p>
                    </div>
                    <button
                        onClick={fetchSubmissions}
                        className="group flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-xl transition-all cursor-pointer font-medium"
                    >
                        <RefreshCw className={clsx("w-4 h-4 transition-transform group-hover:rotate-180", loading && "animate-spin")} />
                        <span>Refresh Data</span>
                    </button>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-slate-500 mb-2">Total Reviews</div>
                        <div className="text-4xl font-extrabold text-slate-900">{submissions.length}</div>
                        <div className="text-xs text-slate-400 mt-2">All time submissions</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-slate-500 mb-2">Average Rating</div>
                        <div className="flex items-center gap-2">
                            <span className="text-4xl font-extrabold text-slate-900">{averageRating}</span>
                            <div className="bg-amber-100 p-1.5 rounded-lg">
                                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="text-sm font-medium text-slate-500 mb-2">Sentiment Analysis</div>
                        <div className="flex items-end gap-2 h-10 mt-1">
                            <div className="flex-1 bg-emerald-100 rounded-t-lg relative group h-full">
                                <div className="absolute inset-x-0 bottom-0 bg-emerald-500 rounded-t-lg transition-all" style={{ height: `${(sentimentCounts.positive / (submissions.length || 1)) * 100}%` }}></div>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">{sentimentCounts.positive}</div>
                            </div>
                            <div className="flex-1 bg-amber-100 rounded-t-lg relative group h-full">
                                <div className="absolute inset-x-0 bottom-0 bg-amber-500 rounded-t-lg transition-all" style={{ height: `${(sentimentCounts.neutral / (submissions.length || 1)) * 100}%` }}></div>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity">{sentimentCounts.neutral}</div>
                            </div>
                            <div className="flex-1 bg-rose-100 rounded-t-lg relative group h-full">
                                <div className="absolute inset-x-0 bottom-0 bg-rose-500 rounded-t-lg transition-all" style={{ height: `${(sentimentCounts.negative / (submissions.length || 1)) * 100}%` }}></div>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity">{sentimentCounts.negative}</div>
                            </div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1 uppercase font-bold px-1">
                            <span>Pos</span><span>Neu</span><span>Neg</span>
                        </div>
                    </div>
                    <div className="bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-500/30 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="text-blue-100 text-sm font-medium mb-1">Latest Recommendation</div>
                            <div className="font-bold text-lg leading-snug">
                                {submissions[0]?.aiAction || "Waiting for data..."}
                            </div>
                        </div>
                        <AlertCircle className="absolute -bottom-4 -right-4 w-24 h-24 text-blue-500/50 rotate-12" />
                    </div>
                </div>

                {/* Submissions List */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-bold text-lg text-slate-800">Recent Activity</h2>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{submissions.length} Total</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {submissions.map((sub) => (
                            <div key={sub.id} className="p-8 hover:bg-slate-50/80 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-100 p-2 rounded-lg">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={clsx(
                                                            "w-4 h-4",
                                                            i < sub.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400 font-medium">
                                                {new Date(sub.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="uppercase tracking-wide">Action: {sub.aiAction}</span>
                                    </div>
                                </div>

                                <p className="text-slate-800 text-lg mb-6 leading-relaxed">"{sub.review}"</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Summary</div>
                                        <p className="text-slate-700 font-medium">{sub.aiSummary}</p>
                                    </div>
                                    <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100/50">
                                        <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Auto-Response sent to User</div>
                                        <p className="text-indigo-900 italic">"{sub.aiResponse}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {submissions.length === 0 && (
                            <div className="py-20 text-center">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Star className="w-8 h-8 text-slate-300" />
                                </div>
                                <div className="text-slate-900 font-medium">No reviews yet</div>
                                <p className="text-slate-500 text-sm mt-1">Waiting for user feedback...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
