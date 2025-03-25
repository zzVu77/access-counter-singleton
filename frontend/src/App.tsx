// frontend/src/App.tsx
import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  useEffect(() => {
    // Use sessionStorage to detect page refresh
    const tabId = sessionStorage.getItem("tabId") || crypto.randomUUID();
    sessionStorage.setItem("tabId", tabId);

    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsLoading(false);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.connectionId) {
          setConnectionId(data.connectionId);
        }
        if (typeof data.count === "number") {
          setCount(data.count);
        }
      } catch (err) {
        console.error("Error processing data:", err);
        setError("Failed to process data");
      }
    };

    socket.onerror = () => {
      console.error("WebSocket connection failed");
      setError("Failed to connect to server");
      setIsLoading(false);
    };

    // Handle beforeunload to detect tab closing
    const handleBeforeUnload = () => {
      // Only send close message if this is not a refresh
      if (performance.navigation.type !== PerformanceNavigation.TYPE_RELOAD) {
        socket.close();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.close();
    };
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
