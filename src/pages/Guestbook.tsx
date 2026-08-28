import { MessageSquare, Quote, Send } from 'lucide-react';
import React from 'react';
import { guestbookMessages } from '../data';

export default function Guestbook() {
  return (
    <div className="pt-[72px]">
      {/* Page Header */}
      <section className="py-12 px-margin-mobile md:px-margin-desktop text-center border-b border-outline/10 bg-surface">
        <h1 className="font-display-lg text-display-lg text-secondary mb-4 animate-fade-in-up">
          Lưu Bút Yêu Thương
        </h1>

        <div className="w-16 h-1 bg-primary/30 mx-auto rounded-full mb-6"></div>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto animate-fade-in-up">
          Gửi những lời chúc tốt đẹp nhất đến các thành viên trong gia đình.
        </p>
      </section>

      {/* Guestbook Content */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Messages */}
          <div className="lg:col-span-2 space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {guestbookMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-surface-container-lowest p-6 rounded-2xl border border-outline/10 family-card-shadow flex gap-4"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-display-lg text-xl text-white ${
                      msg.recipientType === 'A'
                        ? 'bg-primary'
                        : msg.recipientType === 'B'
                        ? 'bg-secondary'
                        : 'bg-[#e0a96d]'
                    }`}
                  >
                    {msg.sender.charAt(0)}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <h4 className="font-label-md text-on-surface">
                      {msg.sender}
                    </h4>

                    <span className="text-xs text-on-surface-variant/70">
                      {msg.timeAgo}
                    </span>
                  </div>

                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${
                      msg.recipientType === 'A'
                        ? 'bg-primary/10 text-primary'
                        : msg.recipientType === 'B'
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-[#e0a96d]/20 text-[#c2843f]'
                    }`}
                  >
                    {msg.recipient}
                  </span>

                  <p className="font-body-md text-on-surface-variant italic relative">
                    <Quote className="absolute -left-2 -top-2 w-4 h-4 text-outline/30 rotate-180" />
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline/10 h-fit sticky top-[100px]">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="text-primary w-6 h-6" />

              <h2 className="font-headline-md text-headline-md text-on-surface">
                Viết Lời Chúc
              </h2>
            </div>

            <form className="space-y-4">
              {/* Name */}
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">
                  Tên của bạn
                </label>

                <input
                  type="text"
                  className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md"
                  placeholder="Nhập tên..."
                />
              </div>

              {/* Recipient */}
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">
                  Gửi đến
                </label>

                <select className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md">
                  <option>Bố A</option>
                  <option>Mẹ B</option>
                  <option>Con C</option>
                  <option>Cả gia đình</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block font-label-md text-on-surface-variant mb-2">
                  Lời chúc
                </label>

                <textarea
                  className="w-full bg-surface-container-lowest border border-outline/30 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-body-md min-h-[120px] resize-none"
                  placeholder="Viết những lời chân thành nhất..."
                ></textarea>
              </div>

              {/* Submit */}
              <button
                type="button"
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
              >
                Gửi Lời Chúc
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
