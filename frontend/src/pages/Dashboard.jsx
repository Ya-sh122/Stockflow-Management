import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadSummary() {
    setLoading(true);
    try {
      const data = await apiGet('/dashboard');
      setSummary(data);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadSummary();
  }, []);

  if (loading) {
    return <p className="muted">loading dashboard...</p>;
  }

  if (errorMessage) {
    return <p className="error-text">{errorMessage}</p>;
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted small">overview of your stock right now</p>
        </div>
        <Link className="button" to="/products/new">
          Add product
        </Link>
      </div>

      <div className="card-grid">
        <div className="card">
          <p className="muted small">Total products</p>
          <h2 className="stat">{summary.totalProducts}</h2>
        </div>
        <div className="card">
          <p className="muted small">Total quantity on hand</p>
          <h2 className="stat">{summary.totalQuantity}</h2>
        </div>
        <div className="card">
          <p className="muted small">Low stock items</p>
          <h2 className="stat">{summary.lowStockItems.length}</h2>
        </div>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Low stock items</h2>
          <p className="muted small">
            quantity is at or below the threshold (default {summary.defaultLowStockThreshold})
          </p>
        </div>

        {summary.lowStockItems.length === 0 ? (
          <p className="muted small">nothing is low on stock right now.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Quantity on hand</th>
                <th>Low stock threshold</th>
              </tr>
            </thead>
            <tbody>
              {summary.lowStockItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td className="mono">{item.sku}</td>
                  <td>{item.quantityOnHand}</td>
                  <td>{item.lowStockThreshold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
