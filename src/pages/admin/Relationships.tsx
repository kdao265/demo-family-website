import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Member {
  id: string;
  full_name: string;
  family_id: string;
}

interface Relationship {
  id: string;
  parent_id: string;
  child_id: string;
}

export default function Relationships() {
  const [members, setMembers] = useState<Member[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  const [parentId, setParentId] = useState('');
  const [childId, setChildId] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setErrorMessage('');

    const [membersResult, relationshipsResult] = await Promise.all([
      supabase
        .from('family_members')
        .select('id, full_name, family_id')
        .order('full_name', { ascending: true }),

      supabase
        .from('family_relationships')
        .select('id, parent_id, child_id')
        .order('created_at', { ascending: true }),
    ]);

    if (membersResult.error) {
      console.error('Load members error:', membersResult.error);
      setErrorMessage('Không thể tải danh sách thành viên.');
    }

    if (relationshipsResult.error) {
      console.error(
        'Load relationships error:',
        relationshipsResult.error
      );
      setErrorMessage('Không thể tải danh sách quan hệ.');
    }

    setMembers(membersResult.data ?? []);
    setRelationships(relationshipsResult.data ?? []);

    setLoading(false);
  }

  function getMemberName(id: string) {
    return (
      members.find((member) => member.id === id)?.full_name ??
      'Không xác định'
    );
  }

  async function handleAddRelationship() {
    if (!parentId || !childId) {
      setErrorMessage('Vui lòng chọn cha/mẹ và con.');
      return;
    }

    if (parentId === childId) {
      setErrorMessage('Một người không thể là cha/mẹ của chính mình.');
      return;
    }

    const alreadyExists = relationships.some(
      (relationship) =>
        relationship.parent_id === parentId &&
        relationship.child_id === childId
    );

    if (alreadyExists) {
      setErrorMessage('Quan hệ này đã tồn tại.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    const { error } = await supabase
      .from('family_relationships')
      .insert({
        parent_id: parentId,
        child_id: childId,
        relationship_type: 'parent_child',
      });

    if (error) {
      console.error('Insert relationship error:', error);
      setErrorMessage('Không thể tạo quan hệ.');
      setSaving(false);
      return;
    }

    setParentId('');
    setChildId('');

    await loadData();

    setSaving(false);
  }

  async function handleDeleteRelationship(
    relationship: Relationship
  ) {
    const parentName = getMemberName(relationship.parent_id);
    const childName = getMemberName(relationship.child_id);

    const confirmed = window.confirm(
      `Xóa quan hệ "${parentName} → ${childName}"?`
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('family_relationships')
      .delete()
      .eq('id', relationship.id);

    if (error) {
      console.error('Delete relationship error:', error);
      setErrorMessage('Không thể xóa quan hệ.');
      return;
    }

    await loadData();
  }

  return (
    <div className="pt-[72px] min-h-screen bg-surface">
      {/* Header */}
      <section className="py-14 px-margin-mobile md:px-margin-desktop bg-surface-container-low border-b border-outline/10">
        <div className="max-w-container-max mx-auto">
          <p className="font-label-md text-primary uppercase tracking-[0.15em]">
            Quản trị
          </p>

          <h1 className="font-display-lg text-display-lg text-secondary mt-3">
            Quan hệ gia phả
          </h1>

          <p className="font-body-lg text-on-surface-variant max-w-2xl mt-4">
            Xác định mối quan hệ cha mẹ và con cái để xây dựng cây gia phả.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-10 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mx-auto">
          <div className="bg-surface-container-lowest rounded-3xl border border-outline/10 family-card-shadow p-6 md:p-8">
            <h2 className="font-headline-md text-xl text-secondary mb-6">
              Thêm quan hệ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Cha / Mẹ
                </label>

                <select
                  value={parentId}
                  onChange={(event) => setParentId(event.target.value)}
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Chọn cha / mẹ</option>

                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden md:block text-primary text-2xl pb-2">
                →
              </div>

              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Con
                </label>

                <select
                  value={childId}
                  onChange={(event) => setChildId(event.target.value)}
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Chọn con</option>

                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-5 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
                <p className="font-body-md text-sm text-primary">
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddRelationship}
              disabled={saving || members.length < 2}
              className="mt-6 inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md hover:bg-primary-container transition-colors disabled:opacity-60"
            >
              <Plus className="w-5 h-5" />
              {saving ? 'Đang lưu...' : 'Thêm quan hệ'}
            </button>
          </div>
        </div>
      </section>

      {/* Existing relationships */}
      <section className="pb-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline-md text-xl text-secondary mb-5">
            Các quan hệ đã tạo
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="font-body-md text-on-surface-variant">
                Đang tải...
              </p>
            </div>
          ) : relationships.length === 0 ? (
            <div className="bg-surface-container-low rounded-3xl border border-outline/10 p-8 text-center">
              <p className="font-body-md text-on-surface-variant">
                Chưa có quan hệ nào.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {relationships.map((relationship) => (
                <div
                  key={relationship.id}
                  className="bg-surface-container-lowest rounded-2xl border border-outline/10 px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-body-md text-secondary truncate">
                      {getMemberName(relationship.parent_id)}
                    </span>

                    <span className="text-primary text-lg">
                      →
                    </span>

                    <span className="font-body-md text-secondary truncate">
                      {getMemberName(relationship.child_id)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteRelationship(relationship)
                    }
                    className="shrink-0 p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                    aria-label="Xóa quan hệ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
