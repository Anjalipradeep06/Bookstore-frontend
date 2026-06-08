import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { addToWishlist } from "../../redux/thunks/wishlistThunk";

function Home() {
  const [banners, setBanners] = useState([]);
  const [books, setBooks] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // fetch data
  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      const bannerRes = await api.get("/products/banners");

      const bookRes = await api.get(
        `/products?page=${page}&limit=8`
      );

      setBanners(bannerRes.data.data || []);
      setBooks(bookRes.data.data || []);
      setTotalPages(bookRes.data.totalPages || 1);

    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  // ================= WISHLIST (REDUX) =================
  const handleAddToWishlist = (id) => {
    dispatch(addToWishlist(id))
      .unwrap()
      .then(() => {
        toast.success("Added to wishlist ❤️");
      })
      .catch((err) => {
        toast.error(err || "Failed to add wishlist");
      });
  };

  const categories = [
    "Fiction",
    "Travel",
    "Adventure",
    "Fantasy",
    "Education",
    "Self Help",
  ];

  return (
    <>
      {/* ================= BANNER ================= */}
      <Carousel fade>
        {banners.map((banner) => (
          <Carousel.Item key={banner._id}>
            <img
              className="d-block w-100 banner-image"
              src={banner.imageUrl}
              alt={banner.title}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {/* ================= BOOKS ================= */}
      <section className="container my-5">
        <div className="section-header">
          <h2>Featured Books</h2>
        </div>

        <div className="row">
          {books.map((book) => (
            <div
              key={book._id}
              className="col-md-3 col-sm-6 mb-4"
            >
              <div className="book-card">

                <img
                  src={book.images?.[0]}
                  alt={book.title}
                  className="book-image w-100"
                />

                <div className="p-3 d-flex flex-column">

                  <span className="book-category">
                    {book.category}
                  </span>

                  <h5>{book.title}</h5>
                  <p>{book.author}</p>
                  <p>₹{book.price}</p>

                  <div className="book-actions">

                    <button
                      className="btn btn-dark"
                      onClick={() =>
                        navigate(`/book/${book._id}`)
                      }
                    >
                      View
                    </button>

                    <button
                      className="btn btn-outline-dark"
                      onClick={() =>
                        handleAddToWishlist(book._id)
                      }
                    >
                      ❤
                    </button>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= PAGINATION ================= */}
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
}

export default Home;