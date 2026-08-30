import {
  CoreValue,
  TimelineEvent,
  TimelineSnippetEvent,
} from './types';

export const timelineEvents: TimelineEvent[] = [
  {
    year: '1980',
    title: 'Lễ Thành Hôn',
    description:
      'Ngày khởi đầu của hành trình Love Family, khi hai tâm hồn cùng thề nguyện xây dựng một tổ ấm bền vững.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA-MmuUBEP1ttnc0pyamwi887lxKaGZXWrhgD3m_BbvFMWRaYRS_N3Z2YmDxcVGx3-sF-BpJy3QV_3eZlFGMumtXWgsWO213iYIz7kO8FXHYyQL2TJumhcfQZTGHusVLIMrSCqIdHS5dG-vvTkgsfoHWdf07Gtxvfjt5x6rjgagoHZ2C7dAjQ3A39Vf0bGGa8vKq29uDjn-d1crVRbcq-7SNJjyK_KmQ57VgNn5HnE-JYKYUSUy5w',
    imageAlt: 'Wedding',
  },
  {
    year: '1985',
    title: 'Ngôi Nhà Đầu Tiên',
    description:
      'Viên gạch đầu tiên được đặt xuống, nơi lưu giữ những tiếng cười và ký ức tuổi thơ của các thế hệ.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC4zDfjA0xlFdU_oxKXUUl5PPiHdF82wzVolkje0tdfrhBFZHrDhnHO5Bo9iaJgbQZFO-8_YbNKLgT0C8UMlCDF_nLSF_knobMSbye9srzAg-LfMBI99ZsGwWLvalDZqBR3r7ThN0-C0yniEL1W1xfPLe1bWcfvCPf3dL-3MOjyyJDyFSlWB-rzWwg6_7QVkySDBx3oYOdC5MbMBF_TD-moGgNmRKKacyJIJGTV69zVgpdhcrMQoQ',
    imageAlt: 'First Home',
  },
  {
    year: '2000',
    title: 'Thế Hệ Kế Thừa',
    description:
      'Sự chào đời của những thành viên mới, mang theo niềm hy vọng và trách nhiệm tiếp nối di sản gia đình.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAXJRQtvDmoJZpHEaCIWaM6pbRivARoQpG3ZVDivQoa5wQDzv3kA8GoAwu2a2YmKT5vnxLK4cD8RBcgO4Umq5XRVLhiUR90AT_BDNM5awTJt8V46y8aEpiPPJJMsBs4NAYIU5IZYcUeyxc_926xQ0iLBm3Vgkg2gEQL9DU94y6o6scGu5k7GwPus6nEwse4MTFMzO03dUZ5h2kTisYwvTtLJZ4jtU5xmpDVjOJt4s7fr6hkw9-wtA',
    imageAlt: 'New Generation',
  },
];

export const coreValues: CoreValue[] = [
  {
    id: '1',
    iconName: 'Heart',
    title: 'Yêu Thương',
    description:
      'Nền tảng gắn kết mọi thành viên, nơi sự thấu hiểu và sẻ chia luôn được đặt lên hàng đầu trong mọi hành động.',
  },
  {
    id: '2',
    iconName: 'Award',
    title: 'Tôn Trọng',
    description:
      'Trân trọng sự khác biệt của mỗi cá nhân và gìn giữ lễ nghĩa, tạo nên một môi trường gia đình hòa thuận, văn minh.',
  },
  {
    id: '3',
    iconName: 'BookOpen',
    title: 'Truyền Thống',
    description:
      'Gìn giữ những phong tục và bài học quý giá từ tổ tiên, làm kim chỉ nam cho sự phát triển của thế hệ sau.',
  },
];

export const timelineSnippet: TimelineSnippetEvent[] = [
  {
    id: '1',
    time: '08:00 AM',
    title: 'Lễ rước dâu tại phố cổ',
    description:
      'Đoàn xích lô mang trầu cau đi qua những con phố rợp bóng cây.',
  },
  {
    id: '2',
    time: '11:30 AM',
    title: 'Tiệc trà thân mật',
    description:
      'Bạn bè và đồng nghiệp quây quần chúc phúc tại nhà riêng.',
  },
  {
    id: '3',
    time: '06:00 PM',
    title: 'Chụp ảnh kỷ niệm tại Bờ Hồ',
    description:
      'Khoảnh khắc hoàng hôn lãng mạn bên Hồ Gươm.',
  },
];
