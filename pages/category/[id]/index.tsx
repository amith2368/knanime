import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from "axios";

interface AnimeDetails {
    title: string;
    year: string;
    image_url: string;
    description: string;
    genre: string;
    status: string;
    episodes: number;
}

const AnimePage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [details, setDetails] = useState<AnimeDetails | null>(null);
    let episodeBtns = []

    useEffect(() => {
        const fetchDetails = async () => {
            if (typeof id === 'string') {
                try {
                    const response = await axios.get(`/api/anime?keyword=${encodeURIComponent(id)}`);
                    console.log(response.data);
                    setDetails(response.data);
                } catch (e) {
                    console.error('Failed to fetch category details:', e);
                }
            }
        };

        fetchDetails();
    }, [id]);

    if (!details) {
        return <div>Loading...</div>;
    }

    // Use a for loop to populate the buttonElements array
    for (let i = 1; i <= details.episodes; i++) {
        episodeBtns.push(
            <button
                key={i}
                onClick={() => router.push(`${id}/${i}`)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
               Ep {i}
            </button>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>{details.title}</h1>
            <img src={details.image_url} alt={details.title} style={{ width: '300px', height: '300px' }} />
            <h3>Plot</h3>
            <p>{details.description}</p>
            <p>Released: {details.year}</p>
            <p>Genre: {details.genre}</p>
            <p>Status: {details.status}</p>
            <p>Episodes: {details.episodes}</p>
            {episodeBtns}
        </div>
    );
};

export default AnimePage;
