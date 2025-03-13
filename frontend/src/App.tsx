import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Increment count when the page is loaded
    fetch("http://localhost:3001/api/counter")
      .then((res) => res.json())
      .then((data) => setCount(data.count));

    // Decrement count when the page is closed
    const handleBeforeUnload = () => {
      fetch("http://localhost:3001/api/counter/decrement", {
        method: "GET",
        keepalive: true,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Dọn dẹp event listener khi component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center">
      <div className="bg-white shadow-2xl w-[30vw] h-auto mx-auto text-center p-8 rounded-lg mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center justify-center">
          <h1 className="text-4xl font-bold font-mono px-2 text-black ">
            Visit Counter
          </h1>
          <img src="/icon-people.png" alt="" className="w-8 h-8" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="relative w-3 h-3 bg-green-400 rounded-full mx-auto my-8">
            <div className="absolute top-0 left-0 w-full h-full rounded-full bg-green-500 animate-fade"></div>
          </div>

          <p className="text-black font-bold text-xl font-mono ">{count}</p>
          <p className="text-gray-600 font-normal text-lg font-mono ">
            visitors{" "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
