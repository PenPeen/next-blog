'use client';

import Link from 'next/link';
import styles from './Pagination.module.css';
import { usePathname, useSearchParams } from 'next/navigation';

type PaginationProps = {
  totalCount: number;
  limitValue: number;
  totalPages: number;
  currentPage: number;
};

type PaginationLinkProps = {
  href: string;
  isDisabled: boolean;
  ariaLabel: string;
  children: React.ReactNode;
};

const PaginationLink = ({ href, isDisabled, ariaLabel, children }: PaginationLinkProps) => (
  <li className={styles.pagination__item}>
    <Link
      href={href}
      className={`${styles.pagination__button} ${isDisabled ? styles.pagination__button_disabled : ''}`}
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      scroll={true}
    >
      {children}
    </Link>
  </li>
);

export const Pagination = ({
  totalCount,
  limitValue,
  totalPages,
  currentPage,
}: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const generatePaginationRange = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const paginationRange = generatePaginationRange();

  if (totalPages <= 1) return null;

  const startItem = limitValue * (currentPage - 1) + 1;
  const endItem = Math.min(limitValue * currentPage, totalCount);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <div className={styles.pagination__info}>
        <p>全 {totalCount} 件中 {startItem} - {endItem} 件表示</p>
      </div>
      <ul className={styles.pagination__list}>
        <PaginationLink
          href={createPageURL(Math.max(1, currentPage - 1))}
          isDisabled={currentPage === 1}
          ariaLabel="Previous page"
        >
          ←
        </PaginationLink>

        {paginationRange.map((pageNumber, i) => {
          if (pageNumber === '...') {
            return (
              <li key={`dots-${i}`} className={styles.pagination__item}>
                <span className={styles.pagination__dots}>…</span>
              </li>
            );
          }

          return (
            <li key={`page-${pageNumber}`} className={styles.pagination__item}>
              <Link
                href={createPageURL(pageNumber)}
                className={`${styles.pagination__button} ${
                  currentPage === pageNumber ? styles.pagination__button_active : ''
                }`}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
                scroll={true}
              >
                {pageNumber}
              </Link>
            </li>
          );
        })}

        <PaginationLink
          href={createPageURL(Math.min(totalPages, currentPage + 1))}
          isDisabled={currentPage === totalPages}
          ariaLabel="Next page"
        >
          →
        </PaginationLink>
      </ul>
    </nav>
  );
};
