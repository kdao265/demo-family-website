import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Upload,
  Image as ImageIcon,
  Heart,
} from 'lucide-react';
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { supabase } from '../../lib/supabase';

interface Moment {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
  is_favorite: boolean;
  created_at: string;
}

export default function Moments() {
  const [moments, setMoments] = useState<Moment[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMoment, setEditingMoment] =
    useState<Moment | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadMoments();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function loadMoments() {
    setLoading(true);
    setErrorMessage('');

    const { data, error } = await supabase
      .from('moments')
      .select(
        'id, title, description, image_url, category, is_favorite, created_at'
      )
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error('Load moments error:', error);
      setErrorMessage(
        'Không thể tải danh sách khoảnh khắc.'
      );
    } else {
      setMoments(data ?? []);
    }

    setLoading(false);
  }

  function resetForm() {
    setTitle('');
    setDescription('');
    setCategory('');
    setIsFavorite(false);

    setSelectedFile(null);

    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl('');
    setEditingMoment(null);
    setErrorMessage('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function openAddModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function openEditModal(moment: Moment) {
    setEditingMoment(moment);

    setTitle(moment.title);
    setDescription(moment.description ?? '');
    setCategory(moment.category ?? '');
    setIsFavorite(moment.is_favorite);

    setSelectedFile(null);

    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(moment.image_url ?? '');
    setErrorMessage('');
    setIsModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setIsModalOpen(false);
    resetForm();
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn một file ảnh.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrorMessage(
        'Ảnh không được lớn hơn 10MB.'
      );
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);

    if (previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  async function uploadMomentImage(
    file: File,
    momentId: string
  ) {
    const extension =
      file.name.split('.').pop()?.toLowerCase() || 'jpg';

    const filePath =
      `moments/${momentId}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from('family-moments')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error(
        'Upload moment image error:',
        error
      );

      throw new Error(
        'Không thể tải ảnh khoảnh khắc lên.'
      );
    }

    const { data } = supabase.storage
      .from('family-moments')
      .getPublicUrl(filePath);

    return {
      filePath,
      publicUrl: data.publicUrl,
    };
  }

  function getStoragePathFromUrl(
    imageUrl: string | null
  ) {
    if (!imageUrl) return null;

    const marker =
      '/storage/v1/object/public/family-moments/';

    const index = imageUrl.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return imageUrl.substring(index + marker.length);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(
        'Vui lòng nhập tiêu đề khoảnh khắc.'
      );
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      /*
       * =========================
       * CHỈNH SỬA
       * =========================
       */
      if (editingMoment) {
        let imageUrl = editingMoment.image_url;
        let uploadedFilePath: string | null = null;

        /*
         * Upload ảnh mới nếu có.
         */
        if (selectedFile) {
          const uploadResult =
            await uploadMomentImage(
              selectedFile,
              editingMoment.id
            );

          imageUrl = uploadResult.publicUrl;
          uploadedFilePath = uploadResult.filePath;
        }

        const { error: updateError } =
          await supabase
            .from('moments')
            .update({
              title: title.trim(),
              description:
                description.trim() || null,
              category:
                category.trim() || null,
              is_favorite: isFavorite,
              image_url: imageUrl,
            })
            .eq('id', editingMoment.id);

        /*
         * Nếu database thất bại,
         * xóa ảnh mới vừa upload.
         */
        if (updateError) {
          if (uploadedFilePath) {
            await supabase.storage
              .from('family-moments')
              .remove([uploadedFilePath]);
          }

          console.error(
            'Update moment error:',
            updateError
          );

          throw new Error(
            'Không thể cập nhật khoảnh khắc.'
          );
        }

        /*
         * Nếu DB thành công và có ảnh mới,
         * xóa ảnh cũ.
         */
        if (
          selectedFile &&
          editingMoment.image_url
        ) {
          const oldPath =
            getStoragePathFromUrl(
              editingMoment.image_url
            );

          if (oldPath) {
            const { error: deleteError } =
              await supabase.storage
                .from('family-moments')
                .remove([oldPath]);

            if (deleteError) {
              console.error(
                'Delete old moment image error:',
                deleteError
              );
            }
          }
        }

        await loadMoments();

        setSaving(false);
        closeModal();
        return;
      }

      /*
       * =========================
       * THÊM MỚI
       * =========================
       */
      const { data: newMoment, error: insertError } =
        await supabase
          .from('moments')
          .insert({
            title: title.trim(),
            description:
              description.trim() || null,
            category:
              category.trim() || null,
            is_favorite: isFavorite,
            image_url: null,
          })
          .select('id')
          .single();

      if (insertError || !newMoment) {
        console.error(
          'Insert moment error:',
          insertError
        );

        throw new Error(
          'Không thể thêm khoảnh khắc.'
        );
      }

      if (selectedFile) {
        const uploadResult =
          await uploadMomentImage(
            selectedFile,
            newMoment.id
          );

        const { error: updateError } =
          await supabase
            .from('moments')
            .update({
              image_url:
                uploadResult.publicUrl,
            })
            .eq('id', newMoment.id);

        /*
         * Cleanup nếu update thất bại.
         */
        if (updateError) {
          await supabase.storage
            .from('family-moments')
            .remove([
              uploadResult.filePath,
            ]);

          console.error(
            'Update new moment image error:',
            updateError
          );

          throw new Error(
            'Đã tạo khoảnh khắc nhưng không thể lưu ảnh.'
          );
        }
      }

      await loadMoments();

      setSaving(false);
      closeModal();
    } catch (error) {
      console.error(
        'Save moment error:',
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Không thể lưu khoảnh khắc.'
      );

      setSaving(false);
    }
  }

  async function handleDelete(moment: Moment) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa "${moment.title}"?`
    );

    if (!confirmed) return;

    setErrorMessage('');

    /*
     * Xóa ảnh trước nếu có.
     */
    if (moment.image_url) {
      const filePath =
        getStoragePathFromUrl(
          moment.image_url
        );

      if (filePath) {
        const { error: storageError } =
          await supabase.storage
            .from('family-moments')
            .remove([filePath]);

        if (storageError) {
          console.error(
            'Delete moment image error:',
            storageError
          );
        }
      }
    }

    const { error } = await supabase
      .from('moments')
      .delete()
      .eq('id', moment.id);

    if (error) {
      console.error(
        'Delete moment error:',
        error
      );

      setErrorMessage(
        'Không thể xóa khoảnh khắc.'
      );

      return;
    }

    await loadMoments();
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
              Khoảnh khắc
            </h1>

            <p className="font-body-lg text-on-surface-variant max-w-2xl mt-4">
              Lưu giữ những hình ảnh đáng nhớ của đại gia đình.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md hover:bg-primary-container transition-colors"
          >
            <Plus className="w-5 h-5" />
            Thêm khoảnh khắc
          </button>
        </div>
      </section>

      {/* Error */}
      {errorMessage && !isModalOpen && (
        <div className="px-margin-mobile md:px-margin-desktop pt-6">
          <div className="max-w-container-max mx-auto rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
            <p className="font-body-md text-sm text-primary">
              {errorMessage}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <p className="font-body-md text-on-surface-variant">
                Đang tải khoảnh khắc...
              </p>
            </div>
          ) : moments.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-low rounded-3xl border border-outline/10">
              <ImageIcon className="w-10 h-10 text-primary/40 mx-auto mb-4" />

              <h2 className="font-headline-md text-xl text-secondary mb-2">
                Chưa có khoảnh khắc nào
              </h2>

              <p className="font-body-md text-on-surface-variant mb-6">
                Hãy thêm khoảnh khắc đầu tiên của gia đình.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center gap-2 text-primary font-label-md"
              >
                <Plus className="w-5 h-5" />
                Thêm khoảnh khắc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {moments.map((moment) => (
                <article
                  key={moment.id}
                  className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline/10 family-card-shadow"
                >
                  <div className="relative h-60 bg-surface-container-low">
                    {moment.image_url ? (
                      <img
                        src={moment.image_url}
                        alt={moment.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-primary/30" />
                      </div>
                    )}

                    {moment.is_favorite && (
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary fill-current" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {moment.category && (
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {moment.category}
                        </span>
                      )}
                    </div>

                    <h2 className="font-headline-md text-xl text-secondary">
                      {moment.title}
                    </h2>

                    {moment.description && (
                      <p className="font-body-md text-on-surface-variant mt-3">
                        {moment.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-6 pt-5 border-t border-outline/10">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(moment)
                        }
                        className="inline-flex items-center gap-2 text-primary font-label-md"
                      >
                        <Pencil className="w-4 h-4" />
                        Sửa
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(moment)
                        }
                        className="inline-flex items-center gap-2 text-secondary font-label-md hover:text-primary transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
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
                  {editingMoment
                    ? 'Chỉnh sửa'
                    : 'Khoảnh khắc mới'}
                </p>

                <h2 className="font-headline-lg text-headline-lg text-secondary">
                  {editingMoment
                    ? 'Sửa khoảnh khắc'
                    : 'Thêm khoảnh khắc'}
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

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Title */}
              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Tiêu đề
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Ví dụ: Tết sum vầy 2026"
                  required
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Danh mục
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  placeholder="Ví dụ: Tết, Sinh nhật, Đám cưới"
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Mô tả
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Một vài dòng về khoảnh khắc này..."
                  className="w-full bg-surface border border-outline/30 rounded-2xl px-4 py-3 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block font-label-md text-sm text-secondary mb-2">
                  Ảnh
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="w-full border-2 border-dashed border-outline/30 rounded-2xl px-6 py-8 hover:border-primary/40 hover:bg-surface-container-low transition-colors"
                >
                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-4">
                      <img
                        src={previewUrl}
                        alt="Ảnh xem trước"
                        className="w-full max-w-md h-56 rounded-2xl object-cover"
                      />

                      <div className="flex items-center gap-2 text-primary font-label-md">
                        <Upload className="w-4 h-4" />
                        {editingMoment
                          ? 'Đổi ảnh'
                          : 'Đổi ảnh'}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="w-6 h-6 text-primary" />

                      <p className="font-label-md text-secondary">
                        Chọn ảnh từ máy
                      </p>

                      <p className="font-body-md text-xs text-on-surface-variant">
                        JPG, PNG, WEBP — tối đa 10MB
                      </p>
                    </div>
                  )}
                </button>
              </div>

              {/* Favorite */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(event) =>
                    setIsFavorite(
                      event.target.checked
                    )
                  }
                  className="w-5 h-5 accent-primary"
                />

                <span className="font-label-md text-secondary flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  Đánh dấu yêu thích
                </span>
              </label>

              {/* Error */}
              {errorMessage && (
                <div className="rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
                  <p className="font-body-md text-sm text-primary">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 px-5 py-3 rounded-full border border-outline/30 text-secondary font-label-md hover:bg-surface-container-low transition-colors disabled:opacity-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-5 py-3 rounded-full font-label-md hover:bg-primary-container transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />

                  {saving
                    ? 'Đang lưu...'
                    : editingMoment
                      ? 'Lưu thay đổi'
                      : 'Lưu khoảnh khắc'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
