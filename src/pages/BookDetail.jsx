import { useParams, useOutletContext, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BookDetail() {
  const { bookKey } = useParams();
  const { books } = useOutletContext();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const book = books.find(
    (b) => b.key && b.key.replace("/works/", "") === bookKey
  );

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `https://openlibrary.org/works/${encodeURIComponent(bookKey)}.json`
        );
        if (res.ok) {
          const data = await res.json();
          setDetails(data);
        }
      } catch {
        // detail fetch failed, we still have search data
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [bookKey]);

  const description =
    details?.description?.value || details?.description || null;
  const subjects = details?.subjects?.slice(0, 10) || [];
  const coverId = book?.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
    : null;

  return (
    <div className="app">
      <aside className="sidebar">
        <Link to="/" className="sidebar-btn">
          ← Dashboard
        </Link>
      </aside>

      <main className="main detail-main">
        {loading && !book ? (
          <p>Loading...</p>
        ) : !book && !details ? (
          <p>Book not found.</p>
        ) : (
          <div className="detail-content">
            <div className="detail-header">
              {coverUrl && (
                <img
                  src={coverUrl}
                  alt={`Cover of ${book?.title || details?.title}`}
                  className="detail-cover"
                />
              )}
              <div className="detail-info">
                <h1>{book?.title || details?.title}</h1>
                <p className="detail-author">
                  <strong>Author(s):</strong>{" "}
                  {book?.author_name?.join(", ") || "N/A"}
                </p>
                <p>
                  <strong>First Published:</strong>{" "}
                  {book?.first_publish_year || "N/A"}
                </p>
                <p>
                  <strong>Edition Count:</strong>{" "}
                  {book?.edition_count || "N/A"}
                </p>
                {book?.number_of_pages_median && (
                  <p>
                    <strong>Median Pages:</strong>{" "}
                    {book.number_of_pages_median}
                  </p>
                )}
                {book?.publisher && book.publisher.length > 0 && (
                  <p>
                    <strong>Publishers:</strong>{" "}
                    {book.publisher.slice(0, 5).join(", ")}
                  </p>
                )}
                {book?.language && book.language.length > 0 && (
                  <p>
                    <strong>Languages:</strong> {book.language.join(", ")}
                  </p>
                )}
                {book?.isbn && book.isbn.length > 0 && (
                  <p>
                    <strong>ISBN:</strong> {book.isbn[0]}
                  </p>
                )}
              </div>
            </div>

            {description && (
              <div className="detail-section">
                <h2>Description</h2>
                <p>{description}</p>
              </div>
            )}

            {subjects.length > 0 && (
              <div className="detail-section">
                <h2>Subjects</h2>
                <div className="subject-tags">
                  {subjects.map((s, i) => (
                    <span key={i} className="subject-tag">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
