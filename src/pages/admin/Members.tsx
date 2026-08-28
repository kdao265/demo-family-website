import { Plus, X, Save } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Family {
  id: string;
  name: string;
}

interface FamilyMember {
  id: string;
  family_id: string;
  full_name: string;
  birth_date: string | null;
  relation_title: string | null;
  short_bio: string | null;
  hobbies: string[] | null;
  avatar_url: string | null;
}

export default function Members() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [relationTitle, setRelationTitle] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setErrorMessage('');

    const [membersResult, familiesResult] = await Promise.all([
      supabase
        .from('family_members')
        .select(
          'id, family_id, full_name, birth_date, relation_title, short_bio, hobbies, avatar_url'
        )
        .order('created_at', { ascending: true }),

      supabase
        .from('families')
        .select('id, name')
        .order('created_at', { ascending: true }),
    ]);

    if (membersResult.error) {
      console.error('Load members error:', membersResult.error);
      setErrorMessage('Không thể tải danh sách thành viên.');
    }

    if (familiesResult.error) {
      console.error('Load families error:', familiesResult.error);
      setErrorMessage('Không thể tải danh sách gia đình.');
    }

    setMembers(membersResult.data ?? []);
    setFamilies(familiesResult.data ?? []);

    setLoading(false);
  }

  function openModal() {
    setFullName('');
    setBirthDate('');
    setFamilyId(families[0]?.id ?? '');
    setRelationTitle('');
    setShortBio('');
    setHobbies('');
    setAvatarUrl('');
    setErrorMessage('');
    setIsModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setIsModalOpen(false);
    setErrorMessage('');
  }

  function getFamilyName(id: string) {
    return families.find((family) => family.id === id)?.name ?? 'Không xác định';
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên.');
      return;
    }

    if (!familyId) {
      setErrorMessage('Vui lòng chọn gia đình.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    const hobbiesArray = hobbies
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const { error } = await supabase.from('family_members').insert({
      family_id: familyId,
      full_name: fullName.trim(),
      birth_date: birthDate || null,
      relation_title: relationTitle.trim() || null,
      short_bio: shortBio.trim() || null,
      hobbies: hobbiesArray,
      avatar_url: avatarUrl.trim() || null,
    });

    if (error) {
      console.error('Insert member error:', error);
      setErrorMessage('Không thể thêm thành viên.');
      setSaving(false);
      return;
    }

    await loadData();

    setSaving(false);
    closeModal();
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
              Thành viên
            </h1>

            <p className="font-body-lg text-on-surface-variant max-w-2xl mt-4">
              Thêm và quản lý thành viên của đại gia đình.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            disabled={families.length === 0}
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Thêm thành viên
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
                Đang tải...
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-low rounded-3xl border border-outline/10">
              <h2 className="font-headline-md text-xl text-secondary mb-2">
                Chưa có thành viên nào
              </h2>

              <p className="font-body-md text-on-surface-variant mb-6">
                Hãy thêm thành viên đầu tiên cho gia đình.
              </p>

              {families.length > 0 && (
                <button
                  type="button"
                  onClick={openModal}
                  className="inline-flex items-center gap-2 text-primary font-label-md"
                >
                  <Plus className="w-5 h-5" />
                  Thêm thành viên đầu tiên
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {members.map((member) => (
                <article
                  key={member.id}
                  className="bg-surface-container-lowest rounded-3xl border border-outline/10 overflow-hidden family-card-shadow"
                >
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.full_name}
                      className="w-full h-52 object-cover"
                    />
                  ) : (
                    <div className="w-full h-52 bg-surface-container-low flex items-center justify-center">
                      <span className="font-headline-md text-4xl text-primary/30">
                        {member.full_name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <p className="font-label-md text-primary text-sm mb-2">
                      {getFamilyName(member.family_id)}
                    </p>

                    <h2 className="font-headline-md text-xl text-secondary">
                      {member.full_name}
                    </h2>

                    {member.relation_title && (
                      <p className="font-body-md text-primary mt-2">
                        {member.relation_title}
                      </p>
                    )}

                    {member.short_bio && (
                      <p className="font-body-md text-on-surface-variant mt-3">
                        {member.short_bio}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-on-surface/40 backdrop-blur-sm flex items-center justify-center px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline/10 p-6 md:p-8 my-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-label-md text-primary uppercase tracking-[0.15em] mb-2">
                  Thành viên mới
                </p>

                <h2 className="font-headline-lg text-headline-lg text-secondary">
                  Thêm thành viên
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="p-2 rounded-full hover:bg-surface-container-low transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5 text-on-surface-variant" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Họ và tên
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-label-md text-sm text-secondary mb-2">
                    Ngày sinh
                  </label>

                  <input
                    type="date"
                    value={birthDate}
                    onChange={(event) => setBirthDate(event.target.value)}
                    className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-sm text-secondary mb-2">
                    Thuộc gia đình
                  </label>

                  <select
                    value={familyId}
                    onChange={(event) => setFamilyId(event.target.value)}
                    required
                    className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Chọn gia đình</option>

                    {families.map((family) => (
                      <option key={family.id} value={family.id}>
                        {family.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Tiêu đề dưới tên
                </label>

                <input
                  type="text"
                  value={relationTitle}
                  onChange={(event) => setRelationTitle(event.target.value)}
                  placeholder="Ví dụ: Người giữ lửa"
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Giới thiệu
                </label>

                <textarea
                  value={shortBio}
                  onChange={(event) => setShortBio(event.target.value)}
                  rows={4}
                  placeholder="Một vài dòng giới thiệu về thành viên..."
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Sở thích
                </label>

                <input
                  type="text"
                  value={hobbies}
                  onChange={(event) => setHobbies(event.target.value)}
                  placeholder="Nấu ăn, đọc sách, trồng cây"
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />

                <p className="font-body-md text-xs text-on-surface-variant mt-2">
                  Ngăn cách các sở thích bằng dấu phẩy.
                </p>
              </div>

              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  URL ảnh đại diện
                </label>

                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(event) => setAvatarUrl(event.target.value)}
                  placeholder="https://..."
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />

                <p className="font-body-md text-xs text-on-surface-variant mt-2">
                  Tạm thời dùng URL ảnh. Sau này chúng ta sẽ tích hợp
                  Supabase Storage để tải ảnh trực tiếp.
                </p>
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
                  disabled={saving || families.length === 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-full font-label-md hover:bg-primary-container transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Đang lưu...' : 'Lưu thành viên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
