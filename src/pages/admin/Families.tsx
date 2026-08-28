import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Family {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export default function Families() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadFamilies();
  }, []);

  async function loadFamilies() {
    setLoading(true);
    setErrorMessage('');

    const { data, error } = await supabase
      .from('families')
      .select('id, name, description, created_at')
      .order('created_at', { ascending: true });

    if (error) {
      setErrorMessage('Không thể tải danh sách gia đình.');
      console.error(error);
    } else {
      setFamilies(data ?? []);
    }

    setLoading(false);
  }

  function openAddModal() {
    setEditingFamily(null);
    setName('');
    setDescription('');
    setErrorMessage('');
    setIsModalOpen(true);
  }

  function openEditModal(family: Family) {
    setEditingFamily(family);
    setName(family.name);
    setDescription(family.description ?? '');
    setErrorMessage('');
    setIsModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setIsModalOpen(false);
    setEditingFamily(null);
    setName('');
    setDescription('');
    setErrorMessage('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên gia đình.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    if (editingFamily) {
      const { error } = await supabase
        .from('families')
        .update({
          name: name.trim(),
          description: description.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingFamily.id);

      if (error) {
        setErrorMessage('Không thể cập nhật gia đình.');
        console.error(error);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from('families')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
        });

      if (error) {
        setErrorMessage('Không thể thêm gia đình.');
        console.error(error);
        setSaving(false);
        return;
      }
    }

    await loadFamilies();
    setSaving(false);
    closeModal();
  }

  async function handleDelete(family: Family) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa "${family.name}"?\n\nCác thành viên thuộc gia đình này cũng sẽ bị xóa.`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('families')
      .delete()
      .eq('id', family.id);

    if (error) {
      setErrorMessage('Không thể xóa gia đình.');
      console.error(error);
      return;
    }

    await loadFamilies();
  }

  return (
    <div className="pt-[72px] min-h-screen bg-surface">
      {/* Header */}
      <section className="py-14 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-b border-outline/10">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="font-label-md text-primary uppercase tracking-[0.15em]">
              Quản trị
            </p>

            <h1 className="font-display-lg text-display-lg text-secondary mt-3">
              Quản lý gia đình
            </h1>

            <p className="font-body-lg text-on-surface-variant max-w-2xl mt-4">
              Tạo và quản lý các gia đình nhỏ trong đại gia đình.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md hover:bg-primary-container transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm gia đình
          </button>
        </div>
      </section>

      {/* Content */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          {errorMessage && !isModalOpen && (
            <div className="mb-6 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
              <p className="font-body-md text-sm text-primary">
                {errorMessage}
              </p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <p className="font-body-md text-on-surface-variant">
                Đang tải danh sách gia đình...
              </p>
            </div>
          ) : families.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-low rounded-3xl border border-outline/10">
              <p className="font-headline-md text-xl text-secondary mb-2">
                Chưa có gia đình nào
              </p>

              <p className="font-body-md text-on-surface-variant mb-6">
                Hãy thêm gia đình đầu tiên để bắt đầu xây dựng gia phả.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 text-primary font-label-md"
              >
                <Plus className="w-5 h-5" />
                Thêm gia đình đầu tiên
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {families.map((family) => (
                <article
                  key={family.id}
                  className="bg-surface-container-lowest rounded-3xl border border-outline/10 p-6 family-card-shadow"
                >
                  <h2 className="font-headline-md text-xl text-secondary mb-3">
                    {family.name}
                  </h2>

                  <p className="font-body-md text-on-surface-variant min-h-12">
                    {family.description || 'Chưa có mô tả.'}
                  </p>

                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-outline/10">
                    <button
                      type="button"
                      onClick={() => openEditModal(family)}
                      className="inline-flex items-center gap-2 text-primary font-label-md"
                    >
                      <Pencil className="w-4 h-4" />
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(family)}
                      className="inline-flex items-center gap-2 text-secondary font-label-md hover:text-primary transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-on-surface/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline/10 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-label-md text-primary uppercase tracking-[0.15em] mb-2">
                  {editingFamily ? 'Chỉnh sửa' : 'Thêm mới'}
                </p>

                <h2 className="font-headline-lg text-headline-lg text-secondary">
                  {editingFamily ? 'Sửa gia đình' : 'Thêm gia đình'}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="p-2 rounded-full hover:bg-surface-container-low transition-colors disabled:opacity-50"
                aria-label="Đóng"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Tên gia đình
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ví dụ: Gia đình bác Nguyễn Văn A"
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Mô tả
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  placeholder="Thông tin ngắn về gia đình..."
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {errorMessage && (
                <div className="rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
                  <p className="font-body-md text-sm text-primary">
                    {errorMessage}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 px-5 py-3 rounded-full border border-outline/30 text-secondary font-label-md hover:bg-surface-container-low transition-colors"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-full font-label-md hover:bg-primary-container transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Đang lưu...' : 'Lưu gia đình'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
