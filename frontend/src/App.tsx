// frontend/src/App.tsx
import { useEffect, useState } from "react";
import { db, ref, onValue, off } from "./firebase";

function App() {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const countRef = ref(db, "count");

    // Lắng nghe dữ liệu realtime
    const unsubscribe = onValue(
      countRef,
      (snapshot) => {
        try {
          const data = snapshot.val();
          console.log("Realtime data from Firebase:", data);
          setCount(data !== null ? data : 0);
          setIsLoading(false);
        } catch (err) {
          console.error("Error processing data:", err);
          setError("Failed to load visitor count");
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Firebase error:", error);
        setError("Failed to connect to database");
        setIsLoading(false);
      }
    );

    // Tăng count khi trang được tải
    fetch("http://localhost:3001/api/counter", { method: "GET" })
      .then((res) => res.json())
      .catch((err) => console.error("Error incrementing count:", err));

    // Giảm count khi trang bị đóng
    const handleBeforeUnload = () => {
      fetch("http://localhost:3001/api/counter/decrement", {
        method: "GET",
        keepalive: true, // Đảm bảo request được gửi ngay cả khi trang đóng
      }).catch((err) => console.error("Error decrementing count:", err));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      off(countRef); // Hủy listener
      unsubscribe(); // Hủy subscription
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-100 h-screen flex items-center justify-center">
        <p className="text-gray-600 font-mono">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 h-screen flex items-center justify-center">
        <p className="text-red-600 font-mono">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white shadow-2xl w-[30vw] h-auto mx-auto text-center p-8 rounded-lg mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center justify-center">
          <h1 className="text-4xl font-bold font-mono px-2 text-black">
            Visit Counter
          </h1>
          <img src="/icon-people.png" alt="" className="w-8 h-8" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="relative w-3 h-3 bg-green-400 rounded-full mx-auto my-8">
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-green-500 animate-fade"></div>
          </div>
          <p className="text-black font-bold text-xl font-mono">{count}</p>
          <p className="text-gray-600 font-normal text-lg font-mono">
            visitors
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
