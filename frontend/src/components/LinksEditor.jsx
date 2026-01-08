import { useState } from 'react';
import api from '../utils/api';
import { FiPlus, FiTrash2, FiEdit2, FiToggleLeft, FiToggleRight, FiMove } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const LinksEditor = ({ links, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '' });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!formData.title || !formData.url) return;

    setLoading(true);
    try {
      const { data } = await api.post('/links', formData);
      onUpdate([...links, data]);
      setFormData({ title: '', url: '' });
      setShowAddForm(false);
    } catch (error) {
      alert('Failed to add link');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/links/${id}`, formData);
      onUpdate(links.map((link) => (link._id === id ? data : link)));
      setEditingId(null);
      setFormData({ title: '', url: '' });
    } catch (error) {
      alert('Failed to update link');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await api.delete(`/links/${id}`);
      onUpdate(links.filter((link) => link._id !== id));
    } catch (error) {
      alert('Failed to delete link');
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      const { data } = await api.put(`/links/${id}`, { isActive: !isActive });
      onUpdate(links.map((link) => (link._id === id ? data : link)));
    } catch (error) {
      alert('Failed to toggle link');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately
    onUpdate(items);

    // Update order on server
    try {
      const reorderedLinks = items.map((link, index) => ({
        id: link._id,
        order: index,
      }));
      await api.put('/links/reorder/all', { links: reorderedLinks });
    } catch (error) {
      alert('Failed to reorder links');
    }
  };

  const startEdit = (link) => {
    setEditingId(link._id);
    setFormData({ title: link.title, url: link.url });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', url: '' });
  };

  return (
    <div className="card max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Links</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary flex items-center gap-2"
        >
          <FiPlus />
          Add Link
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6 space-y-3">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input"
            placeholder="Link Title"
            maxLength={100}
          />
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="input"
            placeholder="https://example.com"
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={loading} className="btn btn-primary">
              {loading ? 'Adding...' : 'Add Link'}
            </button>
            <button onClick={() => setShowAddForm(false)} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links List */}
      {links.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No links yet. Add your first link!</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {links.map((link, index) => (
                  <Draggable key={link._id} draggableId={link._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white border rounded-lg p-4 ${
                          snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                        }`}
                      >
                        {editingId === link._id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              className="input"
                            />
                            <input
                              type="url"
                              value={formData.url}
                              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                              className="input"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdate(link._id)}
                                disabled={loading}
                                className="btn btn-primary"
                              >
                                Save
                              </button>
                              <button onClick={cancelEdit} className="btn btn-secondary">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps} className="cursor-move text-gray-400">
                              <FiMove size={20} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{link.title}</h3>
                              <p className="text-sm text-gray-500 truncate">{link.url}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Clicks: {link.clickCount}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggle(link._id, link.isActive)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                {link.isActive ? (
                                  <FiToggleRight size={24} className="text-green-600" />
                                ) : (
                                  <FiToggleLeft size={24} />
                                )}
                              </button>
                              <button
                                onClick={() => startEdit(link)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <FiEdit2 />
                              </button>
                              <button
                                onClick={() => handleDelete(link._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default LinksEditor;
