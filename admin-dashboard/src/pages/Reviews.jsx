import { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import Table from '../components/Table';
import Button from '../components/Button';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews/'); // Assuming an admin endpoint for all reviews
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${id}/`);
        fetchReviews();
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'User', accessor: 'user_name' },
    { Header: 'Vehicle', accessor: 'vehicle_name' },
    { Header: 'Rating', accessor: 'rating' },
    { Header: 'Comment', accessor: 'comment' },
    { Header: 'Actions', accessor: 'id', Cell: ({ value }) => (
      <Button onClick={() => handleDelete(value)} variant="secondary" className="px-2 py-1 text-xs bg-red-500 text-white hover:bg-red-600">Delete</Button>
    )},
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-4">Reviews Moderation</h1>
      <Table columns={columns} data={reviews} />
    </Card>
  );
};

export default ReviewsPage;
