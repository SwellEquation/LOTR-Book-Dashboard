import { useState, useMemo } from "react";
import { useOutletContext, Link } from "react-router-dom";
import BooksPerDecadeChart from "../components/BooksPerDecadeChart";
import EditionDistributionChart from "../components/EditionDistributionChart";

export default function Dashboard() {
  const { books } = useOutletContext();
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const stats = useMemo(() => {
    const years = books.map((b) => b.first_publish_year).filter((y) => y);
    const total = books.length;
    const avgYear = years.length
      ? Math.round(years.reduce((a, b) => a + b, 0) / years.length)
      : 0;
    const newest = years.length ? Math.max(...years) : 0;
    return { total, avgYear, newest };
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesSearch = b.title
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesYear =
        yearFilter === "all" ||
        (yearFilter === "modern" && b.first_publish_year >= 2000) ||
        (yearFilter === "classic" && b.first_publish_year < 2000);
      return matchesSearch && matchesYear;
    });
  }, [books, search, yearFilter]);

  const paginatedBooks = filteredBooks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const getBookKey = (book) => {
    if (book.key) return book.key.replace("/works/", "");
    return null;
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="sidebar-title">Dashboard</h2>
      </aside>
      <main className="main">
        <h1>Lord of the Rings Book Dashboard</h1>

        <div className="stats">
          <div className="card">
            <h3>{stats.total}</h3>
            <p>Total Books</p>
          </div>
          <div className="card">
            <h3>{stats.avgYear}</h3>
            <p>Avg Year</p>
          </div>
          <div className="card">
            <h3>{stats.newest}</h3>
            <p>Newest</p>
          </div>
        </div>

        <div className="charts-container">
          <div className="chart-card">
            <h3>Books Per Decade</h3>
            <BooksPerDecadeChart books={books} />
          </div>
          <div className="chart-card">
            <h3>Edition Count Distribution</h3>
            <EditionDistributionChart books={books} />
          </div>
        </div>

        <div className="search-controls">
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Years</option>
            <option value="modern">2000+</option>
            <option value="classic">Before 2000</option>
          </select>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Year</th>
                <th>Editions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBooks.map((book, idx) => {
                const bookKey = getBookKey(book);
                return (
                  <tr key={idx} className="clickable-row">
                    <td>
                      {bookKey ? (
                        <Link to={`/book/${bookKey}`} className="book-link">
                          {book.title}
                        </Link>
                      ) : (
                        book.title
                      )}
                    </td>
                    <td>{book.author_name?.[0] || "N/A"}</td>
                    <td>{book.first_publish_year || "N/A"}</td>
                    <td>{book.edition_count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="prev"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            ← Prev Page
          </button>
          <button
            className="next"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * itemsPerPage >= filteredBooks.length}
          >
            Next Page →
          </button>
        </div>
      </main>
    </div>
  );
}
