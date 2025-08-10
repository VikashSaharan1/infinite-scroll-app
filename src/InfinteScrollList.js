import { useCallback, useEffect, useRef, useState } from "react";
import { api, fetchItems } from "./api";

const InfinteScrollList = () => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await fetchItems(page);
      setItems((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.log("Error fetching items: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleObserver = useCallback(
    (enteries) => {
      const target = enteries[0];
      if (target.isIntersecting) {
        loadMore();
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Infinte Scroll List</h2>
      {items.map((item, idx) => (
        <div
          key={idx}
          style={{ padding: "10px", borderBottom: "1px solid #ccc" }}
        >
          {item.display_name}
        </div>
      ))}
      {loading && <p>Loading...</p>}
      <div ref={loaderRef} />
    </div>
  );
};

export default InfinteScrollList;
