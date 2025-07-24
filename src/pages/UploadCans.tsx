import { useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import icons from "../constants/icons.ts";

const UploadCans = () => {
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [invalidRows, setInvalidRows] = useState<any[]>([]);
    const [_, setInsertedCount] = useState<number>(0);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = (file: File) => {
        if (file.type === "text/csv") {
            setCsvFile(file);
            setMessage(null);
            setInvalidRows([]);
            setInsertedCount(0);
        } else {
            setMessage("Please upload a valid CSV file.");
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleSubmit = async () => {
        if (!csvFile) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", csvFile);

        try {
            const res = await fetch("https://canroute.onrender.com/api/v1/cans/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            const text = await res.text(); // read as plain text first
            console.log("Raw response:", text);

            const data = JSON.parse(text); // manually parse (can catch error)

            if (!res.ok) throw new Error(data.message || data.error || "Upload failed");

            setInsertedCount(data.insertedCount || 0);
            setInvalidRows(data.invalidRows || []);
            setMessage(data.message);
            setCsvFile(null);
        } catch (err: any) {
            console.error("Upload failed:", err);
            setMessage(err.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };


    return (
        <div className="min-h-screen bg-lightBlue px-6 py-10 flex flex-col items-center justify-center">
            <h1 className="text-white text-3xl font-bold mb-6">Upload Can CSV</h1>
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`bg-darkBlue p-8 rounded-xl shadow-lg flex flex-col gap-4 w-full max-w-md border-2 transition-colors ${
                    dragActive ? "border-green-400" : "border-white"
                }`}
            >
                <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center gap-2 py-10 px-4 border-2 border-dashed border-gray-400 rounded-md cursor-pointer text-white hover:bg-blue-900 transition-colors"
                >
                    <img src={icons.upload} className="size-10 invert" />
                    <span className="font-semibold">Drag & Drop CSV file here</span>
                    <span className="text-sm opacity-70">or click to browse</span>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".csv"
                        onChange={handleChange}
                        className="hidden"
                    />
                </label>

                {csvFile && <p className="text-white">Selected file: {csvFile.name}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={!csvFile || uploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                    {uploading ? "Uploading..." : "Upload CSV"}
                </button>

                {message && (
                    <div className="text-white mt-4 bg-green-800 rounded p-3 text-sm">
                        {message}
                    </div>
                )}

                {invalidRows.length > 0 && (
                    <div className="bg-red-900 text-white rounded p-4 mt-4 text-sm">
                        <p className="font-semibold mb-2">{invalidRows.length} row(s) were skipped due to errors:</p>
                        <ul className="max-h-60 overflow-auto list-disc pl-5 space-y-1">
                            {invalidRows.map((row, idx) => (
                                <li key={idx}>
                                    <span className="font-medium">Row {idx + 1}:</span> {row.error}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="text-sm text-white opacity-80">
                    <p><strong>Each row of the CSV must include:</strong></p>
                    <ul className="list-disc pl-5">
                        <li>crewId assigned to can</li>
                        <li>can label</li>
                        <li>latitude</li>
                        <li>longitude</li>
                        <li>assignedDay (monday to sunday)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UploadCans;
