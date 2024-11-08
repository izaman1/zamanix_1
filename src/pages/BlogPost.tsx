import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Blog {
  title: string;
  content: string;
  image: {
    url: string;
  };
  author: string;
  category: string;
  tags: string[];
  createdAt: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${slug}`);
      if (!response.ok) {
        throw new Error('Blog post not found');
      }
      const data = await response.json();
      setBlog(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch blog post');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-24">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-4">
            {new Date(blog.createdAt).toLocaleDateString()} • {blog.category}
          </div>
          <h1 className="text-4xl font-light mb-6">{blog.title}</h1>
          <div className="flex items-center text-gray-600">
            <span>By {blog.author}</span>
          </div>
        </div>

        <div className="mb-12">
          <img
            src={blog.image.url}
            alt={blog.title}
            className="w-full h-[500px] object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          {blog.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-6 text-gray-800 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span 
                key={index}
                className="text-sm bg-gray-100 px-3 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}