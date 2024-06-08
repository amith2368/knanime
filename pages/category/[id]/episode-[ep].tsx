import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const EpisodePage = () => {
    const router = useRouter();
    const { id, ep } = router.query;
    const [mirrorUrls, setmirrorUrls] = useState<string[]>([]);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideoData = async () => {
            if (!id || !ep) return;

            try {
                 // @ts-ignore
                const response = await axios.get(`/api/episode?anime=${encodeURIComponent(id)}&episode=${encodeURIComponent(ep)}`);
                // const response = await axios.get(`http://localhost:5000/${id}/ep/${ep}`);
                console.log(response.data)
                // Adjust according to your API response structure
                if (response.data.mirrors && response.data.mirrors.length > 0) {
                    setmirrorUrls(response.data.mirrors);
                    setCurrentVideoUrl(response.data.mirrors[0]);  // Set the first video URL by default
                }
                setIsLoading(false);
            } catch (err) {
                console.error('Failed to fetch video:', err);
                setError('Failed to load video data');
                setIsLoading(false);
            }
        };

        fetchVideoData();
    }, [id, ep]);

    const handleMirrorLinkClick = (url: string) => {
        setCurrentVideoUrl(url);
    }

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Anime ID: {id}</h1>
            <h2>Episode Number: {ep}</h2>
            <p>Video for episode {ep} of anime {id}</p>
            {mirrorUrls && (
                <iframe src={currentVideoUrl} allowFullScreen width="800" height="600"></iframe>
            )}

            <div>
                {mirrorUrls.map((url, index) => (
                    <p key={index} onClick={() => handleMirrorLinkClick(url)} style={{cursor: 'pointer', color: 'blue'}}>
                        Mirror Link {index + 1}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default EpisodePage;
