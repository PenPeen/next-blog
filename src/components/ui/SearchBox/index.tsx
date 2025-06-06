'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import styles from './SearchBox.module.css';

export default function SearchBox() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get('title'));
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(pathname !== '/'){
      inputRef.current!.value = '';
    }
  }, [pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch && debouncedSearch.trim()) {
      router.push(`/?title=${debouncedSearch.trim()}`);
    } else if (debouncedSearch !== null) {
      router.push('/');
    }

  }, [debouncedSearch, router]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="記事を検索..."
          className={styles.searchInput}
          value={search || ''}
          onChange={(e) => setSearch(e.target.value)}
          ref={inputRef}
        />
        <div className={styles.searchIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
