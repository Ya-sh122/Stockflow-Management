import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiGet, apiDelete } from '../api';

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadProducts(term) {
    setLoading(true);
    try {
      const query = term ? '?search=' + encodeURIComponent(term) : '';
      const data = await apiGet('/products' + query);
      setProducts(data);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProducts('');
  }, []);

  function handleSearch(event) {
    event.preventDefault();
    loadProducts(search.trim());
  }

  async function handleDelete(product) {
    const confirmed = window.confirm('delete "' + product.name + '"? this cannot be undone.');
    if (!confirmed) return;

    try {
      await apiDelete('/products/' + product.id);
      loadProducts(search.trim());
    } catch (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Products</h1>
          <p className="muted small">{products.length} item(s) in this list</p>
        </div>
        <Link className="button" to="/products/new">
          Add product
        </Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="search by name or sku"
        />
        <button className="button button--ghost" type="submit">
          Search
        </button>
        {search && (
          <button
            className="button button--ghost"
            type="button"
            onClick={() => {
              setSearch('');
              loadProducts('');
            }}
          >
            Clear
          </button>
        )}
      </form>

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      <section className="panel">
        {loading ? (
          <p className="muted small">loading products...</p>
        ) : products.length === 0 ? (
          <p className="muted small">
            no products yet. click <strong>Add product</strong> to create your first one.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Selling price</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td className="mono">{product.sku}</td>
                  <td>{product.quantityOnHand}</td>
                  <td>
                    {product.isLowStock ? (
                      <span className="badge badge--warn">low stock</span>
                    ) : (
                      <span className="badge badge--ok">in stock</span>
                    )}
                  </td>
                  <td>{product.sellingPrice === null ? '-' : product.sellingPrice}</td>
                  <td className="right">
                    <button
                      className="button button--ghost button--small"
                      onClick={() => navigate('/products/' + product.id + '/edit')}
                    >
                      Edit
                    </button>
                    <button
                      className="button button--danger button--small"
                      onClick={() => handleDelete(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Products;
