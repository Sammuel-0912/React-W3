function ProductModal({
    tempProduct,
    handleModalInputChange,
    handleImageChange,
    handleAddImage,
    handleRemoveImage,
    closeModal,
    updateProduct,
}) {
    return (
        <div
            id="productModal"
            className="modal fade"
            tabIndex="-1"
            aria-labelledby="productModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content border-0">
                    <div className="modal-header bg-dark text-white">
                        <h5 id="productModalLabel" className="modal-title">
                            <span>新增產品</span>
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="mb-2">
                                    <div className="mb-3">
                                        <label htmlFor="imageUrl" className="form-label">
                                            輸入圖片網址
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="imageUrl"
                                            value={tempProduct.imageUrl}
                                            onChange={handleModalInputChange}
                                            placeholder="請輸入圖片連結"
                                        />
                                    </div>
                                    <img className="img-fluid" src={tempProduct.imageUrl} alt='主圖' />
                                </div>
                                {/* 多圖區塊：動態渲染 */}
                                <div className="mt-3">
                                    {tempProduct.imagesUrl && tempProduct.imagesUrl.map((url, index) => (
                                        <div key={index} className="mb-2">
                                            <input
                                                type="text"
                                                className="form-control mb-1"
                                                placeholder={`圖片網址 ${index + 1}`}
                                                value={url}
                                                onChange={(e) => handleImageChange(index, e.target.value)}
                                            />
                                            {url && <img className="img-fluid mb-2" src={url} alt={`附圖 ${index + 1}`} />}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    {(!tempProduct.imagesUrl ||
                                        tempProduct.imagesUrl.length === 0 ||
                                        tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1]) && (
                                            <button className="btn btn-outline-primary btn-sm d-block w-100" onClick={handleAddImage}>
                                                新增圖片
                                            </button>
                                        )}
                                </div>
                                <div>
                                    {
                                        tempProduct.imagesUrl && tempProduct.imagesUrl.length > 0 && (
                                            <button className="btn btn-outline-danger btn-sm d-block w-100" onClick={handleRemoveImage}>
                                                刪除圖片
                                            </button>
                                        )}
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">標題</label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="form-control"
                                        placeholder="請輸入標題"
                                        value={tempProduct.title} onChange={handleModalInputChange}
                                    />
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="category" className="form-label">分類</label>
                                        <input
                                            id="category"
                                            type="text"
                                            className="form-control"
                                            placeholder="請輸入分類"
                                            value={tempProduct.category} onChange={handleModalInputChange}
                                        />
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="unit" className="form-label">單位</label>
                                        <input
                                            id="unit"
                                            type="text"
                                            className="form-control"
                                            placeholder="請輸入單位"
                                            value={tempProduct.unit} onChange={handleModalInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="origin_price" className="form-label">原價</label>
                                        <input
                                            id="origin_price"
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            placeholder="請輸入原價"
                                            value={tempProduct.origin_price} onChange={handleModalInputChange}
                                        />
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="price" className="form-label">售價</label>
                                        <input
                                            id="price"
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            placeholder="請輸入售價"
                                            value={tempProduct.price} onChange={handleModalInputChange}
                                        />
                                    </div>
                                </div>
                                <hr />

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">產品描述</label>
                                    <textarea
                                        id="description"
                                        className="form-control"
                                        placeholder="請輸入產品描述"
                                        value={tempProduct.description} onChange={handleModalInputChange}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">說明內容</label>
                                    <textarea
                                        id="content"
                                        className="form-control"
                                        placeholder="請輸入說明內容"
                                        value={tempProduct.content} onChange={handleModalInputChange}
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            id="is_enabled"
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={!!tempProduct.is_enabled} onChange={handleModalInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="is_enabled">
                                            是否啟用
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            data-bs-dismiss="modal"
                            onClick={() => closeModal()}
                        >
                            取消
                        </button>
                        <button type="button" className="btn btn-primary" onClick={updateProduct}>確認</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ProductModal;