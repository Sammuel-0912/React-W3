import { useState, useEffect, useRef } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import ReactDOM from 'react-dom';
import ProductModal from './component/ProductModal';
import Pagination from './component/Pagination'; 

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
  const [pagination, setPagination] = useState({});

  //取得產品列表(GET)
  const getProducts = async (page=1) => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
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
        imagesUrl : [...tempProduct.imagesUrl.filter((url) => url !== '')],
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
                <Pagination pagination={pagination} changePage={getProducts} />
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
      <ProductModal
        tempProduct = {tempProduct}
        handleModalInputChange = {handleModalInputChange}
        handleImageChange = {handleImageChange}
        handleAddImage = {handleAddImage}
        handleRemoveImage = {handleRemoveImage}
        closeModal = {closeModal}
        updateProduct = {updateProduct}
      >
      </ProductModal>
    </>
  )
}

export default App
