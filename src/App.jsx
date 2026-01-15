import { useState, useEffect, useRef } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import ReactDOM from 'react-dom';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;


function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setisAuth] = useState(false);

  const [products, setProducts] = useState([]); //產品清單
  const [isNew, setIsNew] = useState(false); //判斷是新增還是編輯
  //暫存於目前編輯中的產品內容
  const [tempProduct, setTempProduct] = useState({
    id: '',
    title: '',
    category: '',
    origin_price: '',
    price: '',
    unit: '',
    description: '',
    content: '',
    is_enabled: false,
    imageUrl: '',
    imagesUrl: []
  });

  //取得產品列表(GET)
  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(res.data.products);
    } catch (error) {
      alert("取得產品失敗:" + error.response.data.message);
    }
  };

  const productModalRef = useRef(null);

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setisAuth(true);
      getProducts();
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  //開啟Modal(區分新增或編輯)
  const openModal = (status, product = {}) => {
    if (status === 'new') {
      setTempProduct({
        id: '',
        title: '',
        category: '',
        origin_price: '',
        price: '',
        unit: '',
        description: '',
        content: '',
        is_enabled: false,
        imageUrl: '',
        imagesUrl: [],
      });
      setIsNew(true);
    } else if (status === 'edit') {
      setTempProduct({ ...product });
      setIsNew(false);
    }
    productModalRef.current.show(); //用bootstrap instance顯示
  }
  const closeModal = () => {
    productModalRef.current.hide();
  };
  //儲存產品(POST 或 PUT)
  const updateProduct = async () => {
    let api = `${API_BASE}/api/${API_PATH}/admin/product`;
    let method = 'post';

    if (!isNew) {
      api = `${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`;
      method = 'put';
    }
    //資料格式處理: 確保價格為數字型別
    const productData = {
      data: {
        ...tempProduct,
        origin_price: Number(tempProduct.origin_price),
        price: Number(tempProduct.price),
        is_enabled: tempProduct.is_enabled ? 1 : 0,
      },
    }
    try {
      const response = await axios[method](api, productData );
      alert(response.data.message);
      productModalRef.current.hide();
      getProducts(); //更新後重新整理列表
    } catch (error) {
      alert("操作失敗:" + error.response.data.message);
    }
  };
  //刪除產品(DELETE)
  const deleteProduct = async (id) => {
    if (window.confirm("確定要刪除此產品嗎?")) {
      try {
        const response = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`);
        alert(response.data.message);
        getProducts();
      } catch (error) {
        alert("刪除失敗:" + error.response.data.message);
      }
    }
  };
  const handleModalInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setTempProduct((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  }
  const handleAddImage = () => {
    setTempProduct((prevData) => ({
      ...prevData,
      imagesUrl: [...(prevData.imagesUrl || []), ""],
    }));
  }

  //處理多圖，移除最後一張圖片
  const handleRemoveImage = () => {
    setTempProduct((prevData) => {
      const newImages = [...(prevData.imagesUrl || [])];
      newImages.pop(); //移除陣列最後一項
      return { ...prevData, imagesUrl: newImages };
    });
  }
  const handleImageChange = (index, value) => {
    setTempProduct((prevData) => {
      const newImages = [...prevData.imagesUrl];
      newImages[index] = value;
      return { ...prevData, imagesUrl: newImages };
    });
  }

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    productModalRef.current = new bootstrap.Modal('#productModal', {
      keyboard: false
    });
    checkAdmin();

  }, []);



  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      setisAuth(true);
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };

  return (
    <>
      {isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary" onClick={() =>
                openModal('new')
              }>建立新的產品</button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td>{item.category}</td>
                    <td>{item.title}</td>
                    <td className="text-end">{item.origin_price}</td>
                    <td className="text-end">{item.price}</td>
                    <td>
                      {item.is_enabled ? (<span className="text-success">啟用</span>) : (<span>未啟用</span>)}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => {
                          openModal('edit', item)
                        }}
                        >
                          編輯
                        </button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteProduct(item.id)}>
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
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
    </>
  )
}

export default App
