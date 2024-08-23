import Link from 'next/link';
import React, {useEffect, useRef, useState} from "react";
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const KNHeader: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

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

    const handleSearch = () => {
        if (query.trim()) {
            Router.push(`/results?query=${encodeURIComponent(query)}`);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="navbar px-4 sm:px-2">
            <div className="navbar-start">
                <Link href="/">
                    <img className="w-36 h-auto" src="/logo.png" alt="Logo"/>
                </Link>
            </div>
            
            <div className = "navbar-center">
                <div className="form-control">
                    <label className = "input input-bordered input-error flex content-center items-center bg-success-content">
                        <input 
                            type="text" 
                            className="input border-none"
                            placeholder="Search Anime"
                            id = "icon"
                            name = "icon"
                            value = {query}
                            ref = {searchInputRef}
                            onChange = {(e) => setQuery(e.target.value)}
                            onKeyDown = {(e) => e.key === 'Enter' && handleSearch()} 
                        />
                        <kbd className = 'kbd kbd-sm'>Ctrl</kbd> + <kbd className = 'kbd kbd-sm'>/</kbd>
                    </label>
                </div>
            </div>
            
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                        <img
                            alt="Profile Picture"
                            src="/dino.jpg" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content rounded z-[1] mt-3 w-52 p-2 shadow bg-success-content">
                        <li> <a> Profile </a> </li>
                        <li> <a> Settings </a> </li>
                        <li> <a> Logout </a> </li>
                    </ul>
                </div>
            </div>
        </div>
    );

    // return (
    //     <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-4 dark:bg-black">
    //         <nav className="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between" aria-label="Global">
    //             <Link href="/home">
    //                 <img className="w-36 h-auto" src="/logo.png" alt="Logo"/>
    //             </Link>
    //             <div className="sm:order-3 flex items-center gap-x-2">
    //                 <button
    //                     type="button"
    //                     className="sm:hidden hs-collapse-toggle p-2.5 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10"
    //                     onClick={toggleMenu}
    //                     aria-label="Toggle navigation"
    //                 >
    //                     <svg className={!isMenuOpen ? "flex-shrink-0 size-4" : "hidden"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //                         <line x1="3" x2="21" y1="6" y2="6" />
    //                         <line x1="3" x2="21" y1="12" y2="12" />
    //                         <line x1="3" x2="21" y1="18" y2="18" />
    //                     </svg>
    //                     <svg className={isMenuOpen ? "flex-shrink-0 size-4" : "hidden"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //                         <line x1="18" x2="6" y1="6" y2="18" />
    //                         <line x1="6" x2="18" y1="6" y2="18" />
    //                     </svg>
    //                 </button>
    //                 <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:block`}>
    //                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end py-2 md:py-0 sm:ps-7">
    //                         <a className="font-medium text-gray-600 hover:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500" href="#">
    //                             Under Development
    //                         </a>
    //                     </div>
    //                 </div>
    //             </div>

    //             <div className="mx-auto sm:block ">
    //                 <label htmlFor="icon" className="sr-only">Search</label>
    //                 <div className="relative">
    //                     <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
    //                         <svg className="flex-shrink-0 size-4 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //                             <circle cx="11" cy="11" r="8" />
    //                             <path d="m21 21-4.3-4.3" />
    //                         </svg>
    //                     </div>
    //                     <input
    //                         type="text"
    //                         id="icon"
    //                         name="icon"
    //                         className="py-2 px-4 ps-11 pe-20 block w-92 md:w-96 bg-transparent border-gray-700 shadow-sm rounded-lg text-sm text-gray-300 focus:z-10 focus:border-red-900 focus:ring-red-700 placeholder:text-gray-500 dark:border-neutral-700 dark:text-neutral-500 dark:placeholder-neutral-500 dark:focus:ring-red-600"
    //                         placeholder="Search Anime..."
    //                         value={query}
    //                         ref={searchInputRef}
    //                         onChange={(e) => setQuery(e.target.value)}
    //                         onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    //                     />
    //                     <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-4">
    //                         <span className="text-gray-500 dark:text-neutral-500">Ctrl + /</span>
    //                     </div>
    //                 </div>
    //             </div>
    //         </nav>
    //     </header>
    // );
};

export default KNHeader;
