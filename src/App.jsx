import { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BookDetail from "./pages/BookDetail";
import "./App.css";

function Layout({ books }) {
  return <Outlet context={{ books }} />;
}

export default function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch(
        "https://openlibrary.org/search.json?q=the+lord+of+the+rings"
      );
      const data = await res.json();
      const docs = data.docs.slice(0, 100);
      setBooks(docs);
    };

    fetchBooks();
  }, []);

  return (
    <Routes>
      <Route element={<Layout books={books} />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/book/:bookKey" element={<BookDetail />} />
      </Route>
    </Routes>
  );
}