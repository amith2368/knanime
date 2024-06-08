import { useRouter } from 'next/router';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';


interface Anime {
    title: string;
    release_date: string;
    image_url: string;
    url: string;
}

const Results: React.FC = () => {
    const router = useRouter();
    const { query } = router.query;
    const [animes, setAnime] = useState<Anime[] | null>(null);

    useEffect(() => {
        const fetchSearchDetails = async () => {
            if (typeof query === 'string') {
                try {
                    const response = await axios.get(`/api/search?keyword=${encodeURIComponent(query)}`);
                    setAnime(response.data)
                } catch (e) {
                     console.error('Failed to fetch search details:', e);
                }
            }
        }
        fetchSearchDetails()
    }, [query]);

    if (!animes) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <h1>Anime Results</h1>
            {animes.map((anime, index) => (
                <div key={index}>
                    <Link key={anime.url} href={`${anime.url}`}>
                        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', display: 'block' }}>
                            <img src={anime.image_url} alt={anime.title} width='100px' height='100px'></img>
                            {/*<Image src={category.image_url} alt={category.title} width={100} height={100}/>*/}
                            <h3>{anime.title}</h3>
                            <p>Released: {anime.release_date}</p>
                        </div>
                    </Link>
                </div>
            ))}
            {animes.length > 0 ? (<h3>Found {animes.length} shows</h3>) : (<h3>Found no results</h3>)}
        </div>
    );
};

export default Results;