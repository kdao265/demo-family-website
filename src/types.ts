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

export interface TimelineSnippetEvent {
  id: string;
  time: string;
  title: string;
  description: string;
}
