import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle, BsSearch } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete, MdGridView, MdViewList } from 'react-icons/md';
import { FaBook } from 'react-icons/fa';
import { SlOptionsVertical } from 'react-icons/sl';

const Home = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 8;

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5555/books')
            .then((response) => {
                setBooks(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log('Error:', error);
                setLoading(false);
            });
    }, []);

    const filteredBooks = books
        .filter(book => 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(book => 
            selectedYear ? book.publishYear === parseInt(selectedYear) : true
        )
        .sort((a, b) => {
            if (sortBy === 'title') return a.title.localeCompare(b.title);
            if (sortBy === 'year') return b.publishYear - a.publishYear;
            return 0;
        });

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            {/* Header Section */}
            <header className="max-w-6xl mx-auto mb-12 bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold flex items-center gap-3 text-purple-600">
                        <FaBook className="text-5xl text-purple-500" />
                        Book Haven
                    </h1>
                    <Link 
                        to='/books/create'
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-transform hover:scale-105"
                    >
                        <MdOutlineAddBox className="text-2xl" />
                        Add New Book
                    </Link>
                </div>

                {/* Filters Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative col-span-2">
                        <BsSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search books..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <select
                        className="rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">All Years</option>
                        {[...new Set(books.map(book => book.publishYear))].sort().map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <select
                        className="rounded-lg border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="title">Sort by Title</option>
                        <option value="year">Sort by Year</option>
                    </select>
                </div>
            </header>

            <div className="max-w-6xl mx-auto">
                {/* View Mode Toggle */}
                <div className="flex justify-end mb-6 gap-2">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                    >
                        <MdGridView className="text-2xl" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                    >
                        <MdViewList className="text-2xl" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <Spinner />
                        <p className="mt-4 text-purple-600 font-semibold animate-pulse">Loading Books...</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {currentBooks.map((book) => (
                                    <div key={book._id} className="group">
                                        {/* Book Card */}
                                        <div className="relative h-64 bg-white rounded-lg shadow-lg transition-transform duration-300 hover:-translate-y-2">
                                            {/* Book Spine */}
                                            <div className="absolute left-0 top-0 bottom-0 w-6 bg-purple-600 rounded-l-lg">
                                                <div className="absolute top-20 left-2.5 origin-left -rotate-90 translate-y-16 text-white text-sm font-medium whitespace-nowrap">
                                                    {book.title}
                                                </div>
                                            </div>

                                            {/* Book Cover */}
                                            <div className="ml-6 h-full p-4 rounded-r-lg">
                                                {/* Book Content */}
                                                <div className="h-full bg-gradient-to-br from-purple-50 to-white rounded-lg p-4 flex flex-col">
                                                    <h3 className="text-lg font-bold text-gray-800 mb-2 ">
                                                        {book.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 italic mb-2">
                                                        by {book.author}
                                                    </p>
                                                    <div className="text-sm text-purple-600 mb-4">
                                                        Published: {book.publishYear}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="mt-auto flex flex-col gap-2">
                                                        <Link 
                                                            to={`/books/details/${book._id}`}
                                                            className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full hover:bg-purple-200"
                                                        >
                                                            <BsInfoCircle /> Details
                                                        </Link>
                                                        <Link 
                                                            to={`/books/edit/${book._id}`}
                                                            className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full hover:bg-yellow-200"
                                                        >
                                                            <AiOutlineEdit /> Edit
                                                        </Link>
                                                        <Link 
                                                            to={`/books/delete/${book._id}`}
                                                            className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full hover:bg-red-200"
                                                        >
                                                            <MdOutlineDelete /> Delete
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* List View */
                            <div className="space-y-4">
                                {currentBooks.map((book) => (
                                    <div 
                                        key={book._id} 
                                        className="bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]"
                                    >
                                        <div className="flex items-center justify-between p-6 text-white">
                                            <div className="flex items-center gap-6">
                                                <FaBook className="text-3xl opacity-75" />
                                                <div>
                                                    <h3 className="text-xl font-bold">{book.title}</h3>
                                                    <p className="opacity-75">by {book.author} • {book.publishYear}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Link 
                                                    to={`/books/details/${book._id}`}
                                                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                                >
                                                    <BsInfoCircle className="text-xl" />
                                                </Link>
                                                <Link 
                                                    to={`/books/edit/${book._id}`}
                                                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                                >
                                                    <AiOutlineEdit className="text-xl" />
                                                </Link>
                                                <Link 
                                                    to={`/books/delete/${book._id}`}
                                                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                                >
                                                    <MdOutlineDelete className="text-xl" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex justify-center mt-8 gap-2">
                            {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => paginate(index + 1)}
                                    className={`px-4 py-2 rounded-lg ${
                                        currentPage === index + 1 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-white text-gray-600 hover:bg-purple-50'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        {/* Empty State */}
                        {!loading && filteredBooks.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-8xl mb-6 text-purple-200">📚</div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Books Found</h2>
                                <p className="text-gray-600">Try adjusting your filters or add a new book!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;