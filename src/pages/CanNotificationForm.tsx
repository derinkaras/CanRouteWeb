import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCan } from "../utils/api.ts";

const CanNotificationForm = () => {
    const { canId = '' } = useParams(); // fallback if undefined
    const [message, setMessage] = useState('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [userIdForCan, setUserIdForCan] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setPhotos(Array.from(files));
        }
    };

    useEffect(() => {
        const fetch = async () => {
            const can = await getCan(canId);
            setUserIdForCan(can.crewId);
        };
        if (canId) {
            fetch();
        }
    }, [canId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canId || canId.length !== 24) {
            alert("Invalid can ID");
            return;
        }

        const formData = new FormData();
        formData.append('canId', canId);
        formData.append('message', message);
        if (userIdForCan) formData.append('userId', userIdForCan);
        photos.forEach((photo) => {
            formData.append('photos', photo);
        });

        try {
            const res = await fetch(`https://canroute.onrender.com/api/v1/can-notification`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setSubmitted(true);
                setMessage('');
                setPhotos([]);
            } else {
                const err = await res.json();
                alert(err.message || "Something went wrong");
            }
        } catch (err) {
            alert("Failed to send notification");
        }
    };

    return (
        <div className="min-h-screen bg-lightBlue flex flex-col items-center justify-center px-4 py-8">
            <div className="bg-darkBlue text-white p-6 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Report Maintenance Issue</h2>

                <p className="text-sm mb-4 text-center">
                    Reporting for Can ID: <span className="font-mono text-green-300">{canId}</span>
                </p>

                {submitted ? (
                    <p className="text-green-400 font-semibold text-center">
                        ✅ Thank you! Your report has been submitted.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            className="w-full bg-white text-black border border-gray-300 rounded-md p-2"
                            placeholder="Describe the issue..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={5}
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-sm">Upload Photo(s) (optional):</label>
                            <label
                                htmlFor="photo-upload"
                                className="cursor-pointer bg-blue-700 hover:bg-blue-600 transition-colors text-white text-sm font-semibold py-2 px-4 rounded-md text-center w-full"
                            >
                                Click to Browse Photos
                            </label>
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {photos.length > 0 && (
                                <p className="text-green-300 text-sm">
                                    {photos.length} file{photos.length > 1 ? 's' : ''} selected
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                        >
                            Submit Report
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CanNotificationForm;
