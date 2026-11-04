import { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../api';

function Settings() {
  const [organizationName, setOrganizationName] = useState('');
  const [threshold, setThreshold] = useState('5');
  const [errorMessage, setErrorMessage] = useState('');
  const [savedMessage, setSavedMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await apiGet('/settings');
        setOrganizationName(data.organizationName);
        setThreshold(String(data.defaultLowStockThreshold));
      } catch (err) {
        setErrorMessage(err.message);
      }
      setLoading(false);
    }

    loadSettings();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setSavedMessage('');

    if (threshold === '' || Number(threshold) < 0) {
      setErrorMessage('threshold must be zero or a positive number');
      return;
    }

    setSaving(true);
    try {
      const data = await apiPut('/settings', { defaultLowStockThreshold: threshold });
      setThreshold(String(data.defaultLowStockThreshold));
      setSavedMessage('settings saved');
    } catch (err) {
      setErrorMessage(err.message);
    }
    setSaving(false);
  }

  if (loading) {
    return <p className="muted">loading settings...</p>;
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p className="muted small">used when a product has no threshold of its own</p>
        </div>
      </div>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <div className="field field--full">
          <label>Organization</label>
          <input value={organizationName} disabled />
        </div>

        <div className="field">
          <label htmlFor="threshold">Default low stock threshold</label>
          <input
            id="threshold"
            type="number"
            min="0"
            value={threshold}
            onChange={(event) => setThreshold(event.target.value)}
          />
        </div>

        {errorMessage && <p className="error-text field--full">{errorMessage}</p>}
        {savedMessage && <p className="success-text field--full">{savedMessage}</p>}

        <div className="field--full form-actions">
          <button className="button" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
