function Pagination({ pagination, changePage }) {
    const { current_page, total_pages, has_pre, has_next } = pagination;
    const handleClick = (event, page) => {
        event.preventDefault();
        //預防措施: 如果超出範圍或點擊目前頁面，則不執行
        if (page < 1 || page > total_pages || page === current_page) {
            return;
        }
        changePage(page);
    };
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className={`page-item ${!has_pre ? 'disabled' : ''}`}>
                    <button className={`page-link ${has_pre ? '' : 'disabled'}`} href="/" aria-label="Previous"
                        onClick={(event) => handleClick(event, current_page - 1)}
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </button>
                </li>
                {[...new Array(total_pages)].map((_, i) => {
                    return (
                        <li className="page-item" key={`${i}_page`}>
                            <button className={`page-link ${i + 1 === current_page && 'active'}`}
                                href="/" onClick={(event) => handleClick(event, i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    );
                })}
                {/* 下一頁  */}
                <li className={`page-item ${!has_next ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={(e) => handleClick(e, current_page + 1)}
                        disabled={!has_next}
                    >
                        &raquo;
                    </button>
                </li>
                {/*
                    <li className="page-item">
                    <button className={`page-link ${has_next ? '' : 'disabled'}`}
                        onClick={(event) => handleClick(event, current_page + 1)}
                        href="/" aria-label="Next"
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </button>
                </li>
                    */ }
                
            </ul>
        </nav>
    );
}

export default Pagination; 
