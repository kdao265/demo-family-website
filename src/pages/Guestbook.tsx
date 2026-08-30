import {
  MessageSquare,
  Quote,
  Send,
} from 'lucide-react';
import React, {
  FormEvent,
  useEffect,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';

interface Member {
  id: string;
  full_name: string;
}

interface GuestbookMessage {
  id: string;
  sender_name: string;
  recipient_id: string | null;
  recipient_name: string | null;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export default function Guestbook() {
  const [messages, setMessages] = useState<
    GuestbookMessage[]
  >([]);

  const [members, setMembers] = useState<Member[]>([]);

  const [senderName, setSenderName] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [message, setMessage] = useState('');

  const [loadingMessages, setLoadingMessages] =
    useState(true);

  const [loadingMembers, setLoadingMembers] =
    useState(true);

  const [sending, setSending] = useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  useEffect(() => {
    loadGuestbook();
  }, []);

  async function loadGuestbook() {
    setLoadingMessages(true);
    setLoadingMembers(true);
    setErrorMessage('');

    const [messagesResult, membersResult] =
      await Promise.all([
        supabase
          .from('guestbook_messages')
          .select(
            'id, sender_name, recipient_id, recipient_name, message, is_approved, created_at'
          )
          .eq('is_approved', true)
          .order('created_at', {
            ascending: false,
          }),

        supabase
          .from('family_members')
          .select('id, full_name')
          .order('full_name', {
            ascending: true,
          }),
      ]);

    if (messagesResult.error) {
      console.error(
        'Load guestbook messages error:',
        messagesResult.error
      );

      setErrorMessage(
        'Không thể tải những lời chúc.'
      );
    } else {
      setMessages(messagesResult.data ?? []);
    }

    if (membersResult.error) {
      console.error(
        'Load guestbook members error:',
        membersResult.error
      );

      setErrorMessage(
        'Không thể tải danh sách thành viên.'
      );
    } else {
      setMembers(membersResult.data ?? []);
    }

    setLoadingMessages(false);
    setLoadingMembers(false);
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    const trimmedSender = senderName.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSender) {
      setErrorMessage(
        'Vui lòng nhập tên của bạn.'
      );
      return;
    }

    if (!recipientId) {
      setErrorMessage(
        'Vui lòng chọn người nhận.'
      );
      return;
    }

    if (!trimmedMessage) {
      setErrorMessage(
        'Vui lòng nhập lời chúc.'
      );
      return;
    }

    if (trimmedMessage.length < 5) {
      setErrorMessage(
        'Lời chúc cần có ít nhất 5 ký tự.'
      );
      return;
    }

    setSending(true);

    try {
      const recipient = members.find(
        (member) => member.id === recipientId
      );

      const { error } = await supabase
        .from('guestbook_messages')
        .insert({
          sender_name: trimmedSender,
          recipient_id: recipientId,
          recipient_name:
            recipient?.full_name ?? null,
          message: trimmedMessage,
          is_approved: false,
        });

      if (error) {
        console.error(
          'Send guestbook message error:',
          error
        );

        throw new Error(
          'Không thể gửi lời chúc. Vui lòng thử lại.'
        );
      }

      setSenderName('');
      setRecipientId('');
      setMessage('');

      setSuccessMessage(
        'Lời chúc đã được gửi đến gia đình ❤️'
      );

      await loadGuestbook();
    } catch (error) {
      console.error(
        'Guestbook submit error:',
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Không thể gửi lời chúc.'
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="pt-[72px]">
      {/* Page Header */}
      <section className="py-12 px-margin-mobile md:px-margin-desktop text-center border-b border-outline/10 bg-surface">
        <h1 className="font-display-lg text-display-lg text-secondary mb-4 animate-fade-in-up">
          Lưu bút yêu thương
        </h1>

        <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full mb-6"></div>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Gửi những lời chúc tốt đẹp đến những người bạn
          yêu thương trong gia đình.
        </p>
      </section>

      {/* Guestbook Content */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Messages */}
          <div className="lg:col-span-2 space-y-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {loadingMessages ? (
              <div className="text-center py-16">
                <p className="font-body-md text-on-surface-variant">
                  Đang tải lời chúc...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="bg-surface-container-low p-10 rounded-3xl border border-outline/10 text-center">
                <MessageSquare className="w-10 h-10 text-primary/40 mx-auto mb-4" />

                <h3 className="font-headline-md text-xl text-secondary mb-2">
                  Chưa có lời chúc nào
                </h3>

                <p className="font-body-md text-on-surface-variant">
                  Hãy là người đầu tiên gửi một lời yêu
                  thương cho gia đình.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-surface-container-lowest p-6 rounded-2xl border border-outline/10 family-card-shadow flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display-lg text-xl">
                      {msg.sender_name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                      <h4 className="font-label-md text-on-surface">
                        {msg.sender_name}
                      </h4>

                      <span className="text-xs text-on-surface-variant/70">
                        {formatTime(
                          msg.created_at
                        )}
                      </span>
                    </div>

                    {msg.recipient_name && (
                      <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium mb-3">
                        Gửi {msg.recipient_name}
                      </span>
                    )}

                    <p className="font-body-md text-on-surface-variant italic relative pl-3">
                      <Quote className="absolute -left-2 -top-2 w-4 h-4 text-outline/30 rotate-180" />

                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Form */}
          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline/10 h-fit sticky top-[100px]">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-primary w-6 h-6" />

              <h2 className="font-headline-md text-headline-md text-on-surface">
                Viết lời chúc
              </h2>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Name */}
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">
                  Tên của bạn
                </label>

                <input
                  type="text"
                  value={senderName}
                  onChange={(event) =>
                    setSenderName(
                      event.target.value
                    )
                  }
                  placeholder="Nhập tên..."
                  maxLength={100}
                  className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md"
                />
              </div>

              {/* Recipient */}
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">
                  Gửi đến
                </label>

                <select
                  value={recipientId}
                  onChange={(event) =>
                    setRecipientId(
                      event.target.value
                    )
                  }
                  disabled={
                    loadingMembers ||
                    members.length === 0
                  }
                  className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md disabled:opacity-60"
                >
                  <option value="">
                    {loadingMembers
                      ? 'Đang tải thành viên...'
                      : 'Chọn người nhận'}
                  </option>

                  {members.map((member) => (
                    <option
                      key={member.id}
                      value={member.id}
                    >
                      {member.full_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">
                  Lời chúc
                </label>

                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  placeholder="Viết những lời chân thành nhất..."
                  maxLength={1000}
                  className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md min-h-[120px] resize-none"
                />

                <p className="text-right text-xs text-on-surface-variant/60 mt-1">
                  {message.length}/1000
                </p>
              </div>

              {/* Success */}
              {successMessage && (
                <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
                  <p className="font-body-md text-sm text-primary">
                    {successMessage}
                  </p>
                </div>
              )}

              {/* Error */}
              {errorMessage && (
                <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
                  <p className="font-body-md text-sm text-primary">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  sending ||
                  loadingMembers ||
                  members.length === 0
                }
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending
                  ? 'Đang gửi...'
                  : 'Gửi lời chúc'}

                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
