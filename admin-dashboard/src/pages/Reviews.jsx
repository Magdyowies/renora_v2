import { useEffect, useState } from 'react';
import { Star, Trash2, Search, Filter } from 'lucide-react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews/');
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      try {
        await api.delete(`/reviews/${id}/`);
        fetchReviews();
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingBadge = (rating) => {
    let bgColor = 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    
    if (rating >= 4.5) {
      bgColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    } else if (rating >= 3.5) {
      bgColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    } else if (rating >= 2.5) {
      bgColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    } else {
      bgColor = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bgColor}`}>
        {rating.toFixed(1)} / 5.0
      </span>
    );
  };

  const columns = [
    { 
      Header: 'ID', 
      accessor: 'id',
      Cell: ({ value }) => (
        <span className="font-semibold text-gray-900 dark:text-white">#{value}</span>
      )
    },
    { 
      Header: 'User', 
      accessor: 'user_name',
      Cell: ({ value }) => (
        <span className="font-medium text-gray-900 dark:text-white">{value || 'Anonymous'}</span>
      )
    },
    { 
      Header: 'Vehicle', 
      accessor: 'vehicle_name',
      Cell: ({ value }) => (
        <span className="text-gray-700 dark:text-gray-300">{value}</span>
      )
    },
    { 
      Header: 'Rating', 
      accessor: 'rating',
      Cell: ({ value }) => (
        <div className="flex items-center gap-2">
          {renderStars(value)}
          {getRatingBadge(value)}
        </div>
      )
    },
    { 
      Header: 'Comment', 
      accessor: 'comment',
      Cell: ({ value }) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {value || 'No comment provided'}
          </p>
        </div>
      )
    },
    { 
      Header: 'Actions', 
      accessor: 'id', 
      Cell: ({ value }) => (
        <button 
          onClick={() => handleDelete(value)}
          className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
          title="Delete Review"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading reviews...</p>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
              Reviews Moderation
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage customer feedback</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Star className="w-6 h-6 fill-current" />
              </div>
            </div>
            <p className="text-sm text-white/80 mb-1 font-medium">Average Rating</p>
            <p className="text-3xl font-bold">{averageRating} / 5.0</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">★</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Total Reviews</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{reviews.length}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">↑</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium">Positive Reviews</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {reviews.filter(r => r.rating >= 4).length}
            </p>
          </div>
        </div>

        {/* Reviews Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No reviews yet</p>
              <p className="text-gray-500 dark:text-gray-400">Customer reviews will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table columns={columns} data={reviews} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;