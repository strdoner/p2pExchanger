import {observer} from 'mobx-react-lite';
import React from 'react';
import {useSearchParams} from 'react-router-dom';

const Pagination = ({isFirst, isLast, totalPages}) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const page = searchParams.get("page") === null ? 1 : Number(searchParams.get("page"))
    const setPage = (newPage) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", newPage);
        setSearchParams(newSearchParams)
    }
    return (
        <div className='pagination__block d-flex gap-3 text-center justify-content-center mt-4'>
            {/* Кнопка "назад" - всегда видна, но неактивна на первой странице */}
            <button
                onClick={() => setPage(page - 1)}
                disabled={isFirst}
                className={isFirst ? 'disabled' : ''}
            >
                <i className="bi bi-chevron-left"></i>
            </button>

            {/* Номера страниц */}
            {page - 2 > 0 && <button onClick={() => setPage(page - 2)}>{page - 2}</button>}
            {page - 1 > 0 && <button onClick={() => setPage(page - 1)}>{page - 1}</button>}

            <button className='active'>{page}</button>

            {page + 1 <= totalPages && <button onClick={() => setPage(page + 1)}>{page + 1}</button>}
            {page + 2 <= totalPages && <button onClick={() => setPage(page + 2)}>{page + 2}</button>}

            {/* Кнопка "вперед" - всегда видна, но неактивна на последней странице */}
            <button
                onClick={() => setPage(page + 1)}
                disabled={isLast}
                className={isLast ? 'disabled' : ''}
            >
                <i className="bi bi-chevron-right"></i>
            </button>
        </div>
    )
}

export default observer(Pagination)