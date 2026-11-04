import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { apiGet, apiPost, apiPut } from '../api';

const emptyForm = {
  name: '',
  sku: '',
  description: '',
  quantityOnHand: '0',
  costPrice: '',
  sellingPrice: '',
  lowStockThreshold: '',
};

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  // in edit mode load the product into the form
  useEffect(() => {
    if (!isEdit) return;

    async function loadProduct() {
      try {
        const product = await apiGet('/products/' + id);
        setForm({
          name: product.name || '',
          sku: product.sku || '',
          description: product.description || '',
          quantityOnHand: String(product.quantityOnHand),
          costPrice: product.costPrice === null ? '' : String(product.costPrice),
          sellingPrice: product.sellingPrice === null ? '' : String(product.sellingPrice),
          lowStockThreshold:
            product.lowStockThreshold === null ? '' : String(product.lowStockThreshold),
        });
      } catch (err) {
        setErrorMessage(err.message);
      }
      setLoading(false);
    }

    loadProduct();
  }, [id, isEdit]);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (!form.name.trim() || !form.sku.trim()) {
      setErrorMessage('name and sku are required');
      return;
    }

    if (form.quantityOnHand !== '' && Number(form.quantityOnHand) < 0) {
      setErrorMessage('quantity cannot be negative');
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await apiPut('/products/' + id, form);
      } else {
        await apiPost('/products', form);
      }
      navigate('/products');
    } catch (err) {
      setErrorMessage(err.message);
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="muted">loading product...</p>;
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>{isEdit ? 'Edit product' : 'Add product'}</h1>
          <p className="muted small">name and sku are required, the rest is optional</p>
        </div>
        <Link className="button button--ghost" to="/products">
          Back to list
        </Link>
      </div>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Name *</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="blue t-shirt" />
        </div>

        <div className="field">
          <label htmlFor="sku">SKU *</label>
          <input id="sku" name="sku" value={form.sku} onChange={handleChange} placeholder="TS-BLUE-01" />
        </div>

        <div className="field">
          <label htmlFor="quantityOnHand">Quantity on hand</label>
          <input id="quantityOnHand" name="quantityOnHand" type="number" min="0" value={form.quantityOnHand} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="lowStockThreshold">Low stock threshold</label>
          <input id="lowStockThreshold" name="lowStockThreshold" type="number" min="0" value={form.lowStockThreshold} onChange={handleChange} placeholder="leave empty for default" />
        </div>

        <div className="field">
          <label htmlFor="costPrice">Cost price</label>
          <input id="costPrice" name="costPrice" type="number" step="0.01" min="0" value={form.costPrice} onChange={handleChange} placeholder="0.00" />
        </div>

        <div className="field">
          <label htmlFor="sellingPrice">Selling price</label>
          <input id="sellingPrice" name="sellingPrice" type="number" step="0.01" min="0" value={form.sellingPrice} onChange={handleChange} placeholder="0.00" />
        </div>

        <div className="field field--full">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="3" value={form.description} onChange={handleChange} placeholder="optional notes about this product" />
        </div>

        {errorMessage && <p className="error-text field--full">{errorMessage}</p>}

        <div className="field--full form-actions">
          <button className="button" type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create product'}
          </button>
          <Link className="button button--ghost" to="/products">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
