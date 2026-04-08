import { useEffect, useState, useMemo } from "react";
import "./App.css";

export default function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [stats, setStats] = useState({
    total: 0,
    avgYear: 0,
    newest: 0,
  });

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch("https://openlibrary.org/search.json?q=the+lord+of+the+rings");
      const data = await res.json();
      const docs = data.docs.slice(0, 100);
      setBooks(docs);
      const years = docs
        .map((b) => b.first_publish_year)
        .filter((y) => y);

      const total = docs.length;
      const avgYear = Math.round(
        years.reduce((a, b) => a + b, 0) / years.length
      );
      const newest = Math.max(...years);

      setStats({ total, avgYear, newest });
    };

    fetchBooks();
  }, []);

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

  return (
    <div className="app">
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
              {paginatedBooks.map((book, idx) => (
                <tr key={idx}>
                  <td>{book.title}</td>
                  <td>{book.author_name?.[0] || "N/A"}</td>
                  <td>{book.first_publish_year || "N/A"}</td>
                  <td>{book.edition_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="prev"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}>
            ← Prev Page
          </button>

          <button className="next"
            onClick={() => setPage((p) => p + 1)}
            disabled={page * itemsPerPage >= filteredBooks.length}>
            Next Page →
          </button>

        </div>
      </main>
    </div>
  );
}