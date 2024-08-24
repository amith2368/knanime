import Link from 'next/link';
import React, {useEffect, useRef, useState} from "react";
import Router from 'next/router';
import {Autocomplete, AutocompleteProps, Avatar, Group, rem, Text} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {black} from "next/dist/lib/picocolors";
import classes from './header.module.css';
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import { useDebouncedValue } from '@mantine/hooks';
import axios from "axios";

interface Anime  {
    id: string;
    malId: number;
    title: {
        romaji: string;
        english: string;
        native: string;
        userPreferred: string;
    }
    status: string;
    image: string;
    imageHash: string;
    cover: string;
    coverHash: string;
    popularity: number;
    description: string;
    rating: number;
    genres: string[];
    color: string;
    totalEpisodes: number;
    currentEpisodeCount: number;
    type: string;
    releaseDate: number;
}

const KNHeader: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [debouncedQuery] = useDebouncedValue(query, 200);
    const [autosearchAnimes, setAutosearchAnime] = useState<Anime[]>([]);
    const [animeTitles, setAnimeTitles] = useState<string[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Handle Ctrl + / Input
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.ctrlKey && event.key === '/') {
            event.preventDefault();
            searchInputRef.current?.focus();
          }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, []);

    // Handle Search After Submit
    const handleSearch = () => {
        if (query.trim()) {
            Router.push(`/results?query=${encodeURIComponent(query)}`);
        }
    };

    useEffect(() => {
        const fetchAutosearch = async () => {
            if (debouncedQuery.length <= 2) return;
            try {
                const response = await axios.get(`/api/autosearch?keyword=${encodeURIComponent(debouncedQuery)}`);
                setAutosearchAnime(response.data);
                // Create a list of anime title names only and remove null values
                const animeList = response.data.map((anime: Anime) => anime.title.userPreferred).filter((title: string | null) => title !== null);
                setAnimeTitles(animeList);
            } catch (e) {
                console.error('Failed to fetch search details:', e);
            }
        };
        fetchAutosearch();
    }, [debouncedQuery]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const renderAutocompleteOption: AutocompleteProps['renderOption'] = ({ option }) => {
        const selectedAnime = autosearchAnimes.find((anime) => anime.title.userPreferred === option.value);
        return (
            <Link href={`/category/${selectedAnime?.id}`}>
                <Group gap="sm">
                    <Avatar src={selectedAnime?.image} size={50} radius="sm" />
                    <div>
                      <Text size="sm" c="black">{option.value}</Text>
                      <Text size="xs" c="black" opacity={0.5}>
                        Episodes: {selectedAnime?.totalEpisodes}
                      </Text>
                    </div>
                </Group>
            </Link>);
    }





    return (
        <header className="z-50 sticky top-0 backdrop-blur-md flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-transparent text-sm py-4">
            <nav className="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between"
                 aria-label="Global">
                <Link href="/home">
                    <img className="w-36 h-auto" src="/logo.png" alt="Logo"/>
                </Link>
                <div className="sm:order-3 flex items-center gap-x-2">
                    <button
                        type="button"
                        className="sm:hidden hs-collapse-toggle p-2.5 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10"
                        onClick={toggleMenu}
                        aria-label="Toggle navigation"
                    >
                        <svg className={!isMenuOpen ? "flex-shrink-0 size-4" : "hidden"}
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" x2="21" y1="6" y2="6"/>
                            <line x1="3" x2="21" y1="12" y2="12"/>
                            <line x1="3" x2="21" y1="18" y2="18"/>
                        </svg>
                        <svg className={isMenuOpen ? "flex-shrink-0 size-4" : "hidden"}
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" x2="6" y1="6" y2="18"/>
                            <line x1="6" x2="18" y1="6" y2="18"/>
                        </svg>
                    </button>
                    <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:block`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end py-2 md:py-0 sm:ps-7">
                            <div
                                className="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500">
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto sm:block ">
                    <label htmlFor="icon" className="sr-only">Search</label>
                    <div className="relative">
                        {/*<div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">*/}
                        {/*    <svg className="flex-shrink-0 size-4 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">*/}
                        {/*        <circle cx="11" cy="11" r="8" />*/}
                        {/*        <path d="m21 21-4.3-4.3" />*/}
                        {/*    </svg>*/}
                        {/*</div>*/}
                        {/*<input*/}
                        {/*    type="text"*/}
                        {/*    id="icon"*/}
                        {/*    name="icon"*/}
                        {/*    className="py-2 px-4 ps-11 pe-20 block w-92 md:w-96 bg-transparent border-gray-700 shadow-sm rounded-lg text-sm text-gray-300 focus:z-10 focus:border-red-900 focus:ring-red-700 placeholder:text-gray-500 dark:border-neutral-700 dark:text-neutral-500 dark:placeholder-neutral-500 dark:focus:ring-red-600"*/}
                        {/*    placeholder="Search Anime..."*/}
                        {/*    value={query}*/}
                        {/*    ref={searchInputRef}*/}
                        {/*    onChange={(e) => setQuery(e.target.value)}*/}
                        {/*    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}*/}
                        {/*/>*/}
                        <Autocomplete
                            data={animeTitles}
                            renderOption={renderAutocompleteOption}
                            maxDropdownHeight={300}
                            leftSectionPointerEvents="none"
                            leftSection={<FontAwesomeIcon icon={faSearch}/>}
                            placeholder="Search Anime..."
                            classNames={{
                                input: classes.input,
                                wrapper: classes.wrapper,
                                dropdown: classes.dropdown
                            }}
                            className="w-100 md:w-96"
                            value={query}
                            ref={searchInputRef}
                            onChange={setQuery}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-4">
                            <span className="text-gray-500 dark:text-neutral-500">Ctrl + /</span>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default KNHeader;
