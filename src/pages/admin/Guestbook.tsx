import {
  Check,
  Trash2,
  EyeOff,
  MessageSquare,
} from 'lucide-react';
import {
  useEffect,
  useState,
} from 'react';
import { supabase } from '../../lib/supabase';

interface GuestbookMessage {
  id: string;
  sender_name: string;
  recipient_id: string | null;
  recipient_name: string | null;
  message: string;
  is_approved: boolean;
  created_at: string;
}

type FilterType = 'all' | 'pending' | 'approved';

export default function GuestbookAdmin() {
  const [messages, setMessages] = useState<
    GuestbookMessage[]
  >([]);

  const [filter, setFilter] =
    useState<FilterType>('all');

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState('');

  async function loadMessages() {
    setLoading(true);
    setErrorMessage('');

    let query = supabase
      .from('guestbook_messages')
      .select(
        'id, sender_name, recipient_id, recipient_name, message, is_approved, created_at'
      )
      .order('created_at', {
        ascending: false,
      });

    if (filter === 'pending') {
      query = query.eq('is_approved', false);
    }

    if (filter === 'approved') {
      query = query.eq('is_approved', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error(
        'Load admin guestbook error:',
        error
      );

      setErrorMessage(
        'Không thể tải danh sách lời chúc.'
      );
    } else {
      setMessages(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadMessages();
  }, [filter]);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString(
      'vi-VN',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  }

  async function approveMessage(
    messageId: string
  ) {
    setErrorMessage('');

    const { error } = await supabase
      .from('guestbook_messages')
      .update({
        is_approved: true,
      })
      .eq('id', messageId);

    if (error) {
      console.error(
        'Approve message error:',
        error
      );

      setErrorMessage(
        'Không thể duyệt lời chúc.'
      );

      return;
    }

    await loadMessages();
  }

  async function hideMessage(
    messageId: string
  ) {
    setErrorMessage('');

    const confirmed = window.confirm(
      'Bạn có chắc muốn ẩn lời chúc này?'
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from('guestbook_messages')
      .update({
        is_approved: false,
      })
      .eq('id', messageId);

    if (error) {
      console.error(
        'Hide message error:',
        error
      );

      setErrorMessage(
        'Không thể ẩn lời chúc.'
      );

      return;
    }

    await loadMessages();
  }

  async function deleteMessage(
    message: GuestbookMessage
  ) {
    setErrorMessage('');

    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa lời chúc của "${message.sender_name}"?`
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from('guestbook_messages')
      .delete()
      .eq('id', message.id);

    if (error) {
      console.error(
        'Delete message error:',
        error
      );

      setErrorMessage(
        'Không thể xóa lời chúc.'
      );

      return;
    }

    await loadMessages();
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
            Lưu bút
          </h1>

          <p className="font-body-lg text-on-surface-variant max-w-2xl mt-4">
            Quản lý những lời nhắn được gửi tới các thành viên
            trong gia đình.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-full font-label-md text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low border border-outline/20 text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              Tất cả
            </button>

            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`px-5 py-2.5 rounded-full font-label-md text-sm transition-colors ${
                filter === 'pending'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low border border-outline/20 text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              Chờ duyệt
            </button>

            <button
              type="button"
              onClick={() => setFilter('approved')}
              className={`px-5 py-2.5 rounded-full font-label-md text-sm transition-colors ${
                filter === 'approved'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low border border-outline/20 text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              Đã duyệt
            </button>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="mb-6 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
              <p className="font-body-md text-sm text-primary">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="text-center py-16">
              <p className="font-body-md text-on-surface-variant">
                Đang tải lời chúc...
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-surface-container-low rounded-3xl border border-outline/10 p-12 text-center">
              <MessageSquare className="w-10 h-10 text-primary/40 mx-auto mb-4" />

              <h2 className="font-headline-md text-xl text-secondary mb-2">
                Không có lời chúc
              </h2>

              <p className="font-body-md text-on-surface-variant">
                Chưa có lời chúc nào trong mục này.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className="bg-surface-container-lowest rounded-3xl border border-outline/10 family-card-shadow p-6 md:p-7"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                    {/* Message */}
                    <div className="flex gap-4 min-w-0">
                      <div className="shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display-lg text-xl">
                          {message.sender_name
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-headline-md text-lg text-secondary">
                            {message.sender_name}
                          </h2>

                          <span className="text-xs text-on-surface-variant/70">
                            {formatDate(
                              message.created_at
                            )}
                          </span>
                        </div>

                        {message.recipient_name && (
                          <p className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            Gửi {message.recipient_name}
                          </p>
                        )}

                        <p className="font-body-md text-on-surface-variant leading-relaxed mt-4">
                          {message.message}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="shrink-0">
                      {message.is_approved ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          <Check className="w-4 h-4" />
                          Đã duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant text-xs font-medium border border-outline/10">
                          Chờ duyệt
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-5 border-t border-outline/10 flex flex-wrap gap-3">
                    {!message.is_approved && (
                      <button
                        type="button"
                        onClick={() =>
                          approveMessage(message.id)
                        }
                        className="inline-flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-full font-label-md text-sm hover:bg-primary-container transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Duyệt
                      </button>
                    )}

                    {message.is_approved && (
                      <button
                        type="button"
                        onClick={() =>
                          hideMessage(message.id)
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline/20 text-secondary font-label-md text-sm hover:bg-surface-container-low transition-colors"
                      >
                        <EyeOff className="w-4 h-4" />
                        Ẩn
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        deleteMessage(message)
                      }
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline/20 text-secondary font-label-md text-sm hover:text-primary hover:border-primary/30 transition-colors"
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
    </div>
  );
}
