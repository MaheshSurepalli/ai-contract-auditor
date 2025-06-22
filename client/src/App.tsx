import { useState } from "react";

function App() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please paste some Solidity code before submitting.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("https://ai-auditor-backend-bnfkgxdpa9ctgwbm.eastus-01.azurewebsites.net/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!res.ok) {
        throw new Error("Failed to analyze contract.");
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: "Failed to analyze contract. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold">Smart Contract AI Auditor</h1>

      <textarea
        className="w-full max-w-2xl h-64 p-4 border rounded-lg shadow bg-white"
        placeholder="Paste your Solidity code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Audit Contract"}
      </button>

      {loading && (
        <p className="text-gray-600 text-sm italic">⏳ Crunching the code... hang tight!</p>
      )}

{result && !result.error && (
  <div className="w-full max-w-2xl mt-6 p-6 bg-white rounded-xl shadow space-y-6">
    <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">🛡️ Audit Report</h2>

    {typeof result.raw === "string" ? (
      <pre className="bg-gray-100 text-sm p-4 rounded whitespace-pre-wrap border text-gray-800">
        {result.raw}
      </pre>
    ) : (
      Object.entries(result).map(([section, items]) => (
        <div key={section}>
          <h3 className="text-lg font-bold text-blue-700 mb-2 capitalize">{section}</h3>
          <ul className="list-disc pl-5 space-y-2">
            {(items as any[]).map((item, idx) => (
              <li key={idx} className="text-gray-700">
                <span className="font-semibold text-gray-900">{item.issue}</span>:{" "}
                <span>{item.description}</span>
                {item.severity && (
                  <span
                    className={`ml-2 text-xs font-semibold px-2 py-1 rounded-full ${
                      item.severity === "High"
                        ? "bg-red-100 text-red-700"
                        : item.severity === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.severity}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))
    )}
  </div>
)}


      {result?.error && (
        <div className="text-red-600 font-semibold mt-4">
          ⚠️ {result.error}
        </div>
      )}
    </div>
  );
}

export default App;
