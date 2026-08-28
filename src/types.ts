export interface Member {
  id: string;
  name: string;
  birthDate: string;
  hobbies: string[];
  imageUrl: string;
  imageAlt: string;

  // Thông tin dùng cho gia phả
  relation?: string;
  shortBio?: string;
}

export interface FamilyRelationship {
  parentId: string;
  childId: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
}

export interface GuestbookMessage {
  id: string;
  sender: string;
  timeAgo: string;
  recipient: string;
  message: string;
  recipientType: 'A' | 'B' | 'C'; // Maps to styles
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export interface CoreValue {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface AnniversaryPhoto {
  id: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  liked?: boolean;
}

export interface TimelineSnippetEvent {
  id: string;
  time: string;
  title: string;
  description: string;
}
