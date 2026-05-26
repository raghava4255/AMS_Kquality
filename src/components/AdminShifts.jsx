import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

export const AdminShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', code: '', startTime: '09:00', endTime: '18:00', 
    breakTime: 60, graceTime: 15, shiftType: 'General', 
    weeklyOffs: 'Saturday,Sunday', status: 'Active'
  });

  const fetchShifts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/shifts`);
      if (!res.ok) throw new Error('Failed to fetch shifts');
      const data = await res.json();
      setShifts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleOpenModal = (shift = null) => {
    if (shift) {
      setEditingShift(shift);
      setFormData({ ...shift });
    } else {
      setEditingShift(null);
      setFormData({
        name: '', code: '', startTime: '09:00', endTime: '18:00', 
        breakTime: 60, graceTime: 15, shiftType: 'General', 
        weeklyOffs: 'Saturday,Sunday', status: 'Active'
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingShift ? `${API_BASE_URL}/shifts/${editingShift.id}` : `${API_BASE_URL}/shifts`;
      const method = editingShift ? 'PUT' : 'POST';
      
      const payload = { ...formData };
      if (editingShift) payload.id = editingShift.id;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to save shift');
      
      setShowModal(false);
      fetchShifts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shift?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/shifts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete shift');
      fetchShifts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Shift Management</h3>
        <button className="btn-primary" onClick={() => handleOpenModal()} style={{ padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Plus size={16} /> Create Shift
        </button>
      </div>

      {loading ? (
        <p>Loading shifts...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Name / Code</th>
                <th style={{ padding: '12px' }}>Timings</th>
                <th style={{ padding: '12px' }}>Break (min)</th>
                <th style={{ padding: '12px' }}>Type</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map(shift => (
                <tr key={shift.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '500' }}>{shift.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{shift.code}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {shift.startTime} - {shift.endTime}
                  </td>
                  <td style={{ padding: '12px' }}>{shift.breakTime}</td>
                  <td style={{ padding: '12px' }}>{shift.shiftType}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem',
                      background: shift.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: shift.status === 'Active' ? '#10b981' : '#ef4444'
                    }}>
                      {shift.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleOpenModal(shift)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(shift.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel" style={{ width: '500px', padding: '24px', position: 'relative' }}>
            <h3 style={{ margin: '0 0 20px 0' }}>{editingShift ? 'Edit Shift' : 'Create Shift'}</h3>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}><XCircle size={20} /></button>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label>Shift Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="glass-input" style={{ width: '100%', padding: '10px' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label>Shift Code</label>
                  <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="glass-input" style={{ width: '100%', padding: '10px' }} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label>Start Time</label>
                  <input required type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="glass-input" style={{ width: '100%', padding: '10px' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label>End Time</label>
                  <input required type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="glass-input" style={{ width: '100%', padding: '10px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label>Break Time (mins)</label>
                  <input required type="number" value={formData.breakTime} onChange={e => setFormData({...formData, breakTime: parseInt(e.target.value)})} className="glass-input" style={{ width: '100%', padding: '10px' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label>Grace Time (mins)</label>
                  <input required type="number" value={formData.graceTime} onChange={e => setFormData({...formData, graceTime: parseInt(e.target.value)})} className="glass-input" style={{ width: '100%', padding: '10px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label>Type</label>
                  <select value={formData.shiftType} onChange={e => setFormData({...formData, shiftType: e.target.value})} className="glass-input" style={{ width: '100%', padding: '10px', background: 'transparent', color: 'var(--text-primary)' }}>
                    <option style={{color: 'black'}} value="General">General</option>
                    <option style={{color: 'black'}} value="Day">Day</option>
                    <option style={{color: 'black'}} value="Night">Night</option>
                    <option style={{color: 'black'}} value="Custom">Custom</option>
                  </select>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label>Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="glass-input" style={{ width: '100%', padding: '10px', background: 'transparent', color: 'var(--text-primary)' }}>
                    <option style={{color: 'black'}} value="Active">Active</option>
                    <option style={{color: 'black'}} value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '10px' }}>
                {editingShift ? 'Save Changes' : 'Create Shift'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
