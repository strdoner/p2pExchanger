import { observer } from 'mobx-react-lite';
import React from 'react';

const Pagination = () => {
    return (
        <div className='pagination__block d-flex gap-3 text-center justify-content-center mt-4'>
            <button><i class="bi bi-chevron-left"></i></button>
            <button className='active'>1</button>
            <button>2</button>
            <button>3</button>
            <button><i class="bi bi-chevron-right"></i></button>
        </div>
    )
}

export default observer(Pagination)