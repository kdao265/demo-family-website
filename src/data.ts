import {
  AnniversaryPhoto,
  CoreValue,
  GalleryItem,
  GuestbookMessage,
  Member,
  TimelineEvent,
  TimelineSnippetEvent,
} from './types';

export const members: Member[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    birthDate: '15/05/1980',
    hobbies: ['Đọc sách', 'Làm vườn', 'Nấu ăn'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJHPu9KxZjOzDzFqql8XS_g-wZsZDdTLYBKht07qphPV3OUMy4BfHA99ptAjzzAkBMZ5rS_cLWF4oCULA4stL9I0nwnEfb2GBUJvEdFCPTjN0zORZenpXX34UQ0Bf3e5d1X9vQHxQ37H4NqiHorvzIP6IPYkwMWO-tIaXoC07l5VsM61y2_fAcUAIWLUUbFI0Czhp7x8GeoWUtN5Sm-gTSSbM4Wa-sy8t3FgJOgKUtHp-k6TdmIw',
    imageAlt: 'Father portrait',
  },
  {
    id: '2',
    name: 'Trần Thị B',
    birthDate: '20/09/1985',
    hobbies: ['Yoga', 'Du lịch', 'Cắm hoa'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBlqd7tuuwgEa2poxQQQH0bRK91LV74Qg0RgRl3t22R07aeXYgrx2kW3yBlWLhOp4bTHNycTFOHkWkO8nT3rwLd6UbieUfSY9Rv8YlBWNXPkg0-9OX20qGo6M0RkzfYrVVYu5DrPWIqYF2kkuqSd5Ege1qj6SmCWkqzbueKpLMVapIiaBgxe7k8_KYqtjgo9L9cl_5l7UNzj9ASi38fbtlJr5yFU87t_MGZ6_l9aTzcjnLFhLTUNA',
    imageAlt: 'Mother portrait',
  },
  {
    id: '3',
    name: 'Nguyễn Minh C',
    birthDate: '10/12/2010',
    hobbies: ['Bóng đá', 'Gaming', 'Lập trình'],
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2HXNYL9_p_WSBsRbyqpitCINKuPmAhDP0wQljf66DhRGKwYPHVRlZfG2GdqFRiYxsmhTwp_RipkYpJ5jvf10frfgyJqNMWzOv1setL1DkuUiaJryjaHh1thV25hGD5UWOVMTeUhwRroQQl6_gO1_xtJWL4nB1DcLKYBcTfVFroC-y0kzg41auNR20d26KvecNLkVgRFX7WAuWASgrH-aa0eRrUFhIdzG5NYpkRPaQKlVGnI22pQ',
    imageAlt: 'Son portrait',
  },
];

export const homeGallery: GalleryItem[] = [
  {
    id: '1',
    title: 'Dã ngoại cuối tuần - 2023',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuChlaHE_DPqUKUzIsj9yEfRnr88FoDYIg9qdvm-W36X4PaHhZQIoi7P-6TANrON4N_qL9587ZuS4itVztmGBKxJbN4kWHyyAyshb_cYnB7HgMaZ9AOimZsqgi5T8Aj3dcmP0SvDhWvvKdOv3KvWTDVhQ1DWIux9q7WeFFbUduVgAcwTYhJTmE75MqvVBnOPB_8vAPnWRA2CLRKSdwb0lNg2RyQlFy7r3j4BJjSmtki8si6ApYP2Yw',
    imageAlt: 'Picnic',
  },
  {
    id: '2',
    title: 'Bữa tối ấm áp - Giáng sinh',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCtQoEAo9I9aKZanewxIdc-ke1dPUjlIGNl6CS0hapQY7OIycSdxnEiIyw_Dn-LKQXRZCVGjQ9r2Hzrmr1NVEFLvC3VvSXriH9CD7RPAHc42ag436HGai7cpWWh9O3NXWSwsgjIw6-Bn3jy3TbKkQI_nAOQYNiLJ8aIR-ASrICTV3_4zHluMdpw1gpP-8e0dcu59yh2Ry18OxXnZtkOa7p-T_O50raI601frrpuP7ZXUUUOJ-k6hA',
    imageAlt: 'Dinner',
  },
  {
    id: '3',
    title: 'Du lịch biển Vũng Tàu',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBn_I7xZ0ieVnihVb6LFoD9HgzqB8E7uAOHs6FebRNvXGwHNr6MVD5EBxo150EjwvkSJ4vVQerSAN-GWV9q0ShWmO8XfXpASbmcm0pZLdjJYSYEZp7y6s2yWZbLDQU3YddfmOw2Ge7S3vYHAgZXU2SGxLShQHHNYepf_y13cRXp3nX18iEkjgPY9TVkg2WwLW9CdqvNSaDSz50N4Qieswom49-9i40VYcJayZoTyVz9U4daNcrNSA',
    imageAlt: 'Beach',
  },
  {
    id: '4',
    title: 'Sinh nhật 10 tuổi của Minh',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC92FxOQvL9qAQvAVG7xqFs7iyKDKD2MO6-OwRB-dgqLA4phkVoeUzuIuh9DoYLzI4c-ZSc1DVYL2LnJfZjFbmy5KzDBR2EYMCY6NCrkxNpH4ZwbATugNBbDDwfhqhaXb8EaNHF6vKTL6cg2dRVDk0WFVFAQS1pnjQIucMdtgmuLyI-5noHIziIvxJO0buhqaQ-hn1KGIYmQHYQ9xrNvTdQa4ZvjRS_iQPoUL6wKj1B9Nm4dGGBNA',
    imageAlt: 'Birthday',
  },
  {
    id: '5',
    title: 'Khoảnh khắc yêu thương',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3MdbIODyMDCq2ltXVmvfR9-vEObMFbbcBSbVqx9NQ_5RSjOlJwVV8b4HhtvuXxRLGY5VCz3mSgJwCn8HQfLX9KZv_PeC9hoVbqVDrRLse-QE7Ch-AmKO6zcGX-9LG4vit0M3awpAC--MNK9-FqgHbLmQPoik4tSM1IxPo4pwTlHIv6DKOXf-g5X-oeNfdIcwqnyY5UqNMwcVR2Bnw-TpMbd8qLJSkxayU9NxWx__GPEXRQ_6CTA',
    imageAlt: 'Hug',
  },
];

export const guestbookMessages: GuestbookMessage[] = [
  {
    id: '1',
    sender: 'Bác Hùng',
    timeAgo: '12 giờ trước',
    recipient: 'Gửi Mẹ B',
    message: '"Chúc mừng sinh nhật em gái! Chúc em luôn tươi trẻ, hạnh phúc và là hậu phương vững chắc cho cả nhà. Cả nhà mình luôn yêu em!"',
    recipientType: 'B',
  },
  {
    id: '2',
    sender: 'Bạn Lan',
    timeAgo: 'Hôm qua',
    recipient: 'Gửi Minh C',
    message: '"Chúc mừng sinh nhật Minh nhé! Chúc ông bạn tuổi mới học giỏi hơn, đá bóng hay hơn và luôn vui vẻ cùng gia đình!"',
    recipientType: 'C',
  },
  {
    id: '3',
    sender: 'Cô Hoa',
    timeAgo: '2 ngày trước',
    recipient: 'Gửi Bố A',
    message: '"Chúc mừng tuổi mới anh trai. Chúc anh luôn mạnh khỏe, thành đạt và mãi là người đàn ông tuyệt vời của gia đình mình."',
    recipientType: 'A',
  },
];

export const timelineEvents: TimelineEvent[] = [
  {
    year: '1980',
    title: 'Lễ Thành Hôn',
    description: 'Ngày khởi đầu của hành trình Love Family, khi hai tâm hồn cùng thề nguyện xây dựng một tổ ấm bền vững.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA-MmuUBEP1ttnc0pyamwi887lxKaGZXWrhgD3m_BbvFMWRaYRS_N3Z2YmDxcVGx3-sF-BpJy3QV_3eZlFGMumtXWgsWO213iYIz7kO8FXHYyQL2TJumhcfQZTGHusVLIMrSCqIdHS5dG-vvTkgsfoHWdf07Gtxvfjt5x6rjgagoHZ2C7dAjQ3A39Vf0bGGa8vKq29uDjn-d1crVRbcq-7SNJjyK_KmQ57VgNn5HnE-JYKYUSUy5w',
    imageAlt: 'Wedding',
  },
  {
    year: '1985',
    title: 'Ngôi Nhà Đầu Tiên',
    description: 'Viên gạch đầu tiên được đặt xuống, nơi lưu giữ những tiếng cười và ký ức tuổi thơ của các thế hệ.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC4zDfjA0xlFdU_oxKXUUl5PPiHdF82wzVolkje0tdfrhBFZHrDhnHO5Bo9iaJgbQZFO-8_YbNKLgT0C8UMlCDF_nLSF_knobMSbye9srzAg-LfMBI99ZsGwWLvalDZqBR3r7ThN0-C0yniEL1W1xfPLe1bWcfvCPf3dL-3MOjyyJDyFSlWB-rzWwg6_7QVkySDBx3oYOdC5MbMBF_TD-moGgNmRKKacyJIJGTV69zVgpdhcrMQoQ',
    imageAlt: 'First Home',
  },
  {
    year: '2000',
    title: 'Thế Hệ Kế Thừa',
    description: 'Sự chào đời của những thành viên mới, mang theo niềm hy vọng và trách nhiệm tiếp nối di sản gia đình.',
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
    description: 'Nền tảng gắn kết mọi thành viên, nơi sự thấu hiểu và sẻ chia luôn được đặt lên hàng đầu trong mọi hành động.',
  },
  {
    id: '2',
    iconName: 'Award',
    title: 'Tôn Trọng',
    description: 'Trân trọng sự khác biệt của mỗi cá nhân và gìn giữ lễ nghĩa, tạo nên một môi trường gia đình hòa thuận, văn minh.',
  },
  {
    id: '3',
    iconName: 'BookOpen',
    title: 'Truyền Thống',
    description: 'Gìn giữ những phong tục và bài học quý giá từ tổ tiên, làm kim chỉ nam cho sự phát triển của thế hệ sau.',
  },
];

export const anniversaryPhotos: AnniversaryPhoto[] = [
  {
    id: '1',
    title: 'Chiếc thiệp cưới năm 1980',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdZtIRuWxv7jnmOGyNwCFpWHHmhcUTcar4xtYv_FVBqjK11rmBKDgPZw8Z2ba6VzuliBl3CokShz0EMyF_azuNELzbx3bwJDPIOCTG0BRBp-QPd_Tf2-Qhxb2Ui_aLaeg2MjZ3R-QDbqO3K54j9hLTbrmXlWfzPXSC6-jSt3XmlvjEAi1mt2NFRJxibLwWDOEff79Ro48Gt6UFwk4z3OfLV71Xkb6uTFQjbHUcgzs9aN4pcE8hdw',
    imageAlt: 'Wedding card',
  },
  {
    id: '2',
    title: 'Nghi thức rước dâu',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiJ-QYUl7m4jlKs4f5TLQfvKwOfpXabKzs-dq6wWX4Y8lI1wjp2Bki8iJGGlJbIahAwv6XmwXFn-nziN-DWc45qU1oxmR8-hN2M9G0eIgleCrn2XIeUIV9ygEQPZE6KnUlW2Aam_vxD6XP2t80MxLn219i8ri286aAQB3SpsKWBPGhdOayDN5ekjIHdq1YQLc_Ekgq66MiqNGOYjKYbeUNu2o4bmfQQL51HT5FMAYxOaufCZiS_g',
    imageAlt: 'Wedding procession',
  },
  {
    id: '3',
    title: 'Tiệc mừng bên gia đình',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1lWQPfy7XTMMkL-0cBIUD3MeG3qEb1Bn9dQ62SZOFJHi3wWsva0CRSlG-HmVeC6p6ipBgR7F1_8UQRHTT21KXhXfE-gOYRrsXKXHw7pHPhUETWbOA6WldVmvSnPAx9p06hA_N5Uw9i2E8kV5ArhXHtJjfOGKXv78MKCeKgv6gj8mHWiZibpuzVOrkv57ilWiW_DpZjm31O0vbtr3J3ycgtsYzjqqWkKqeX_1hY9giJ7OzaX5ilg',
    imageAlt: 'Family party',
  },
  {
    id: '4',
    title: 'Bàn tay gắn kết 40 năm',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnQTcI8irvzVK3muuG11DqAU6PoupLJrRRS93fzoZ4Rjn2jzTFza-wuk2VSsvCXAe6soyj2skXenLxlYDfxcv96ObWSSSOEE5VaAX5UH8Of6lDQii501fMA7PGJm7a7CKjODTidmAbPfrJXXi-fY5N200eUZltqu-NLn3DhmQnJVcB15YtGUSFnLTJKTukEVw9vdx7MVJxMcfvUdAxcG9ScdF6jyRUMSAJQpEg39Xm3dreUwt1UQ',
    imageAlt: 'Holding hands',
    liked: true,
  },
  {
    id: '5',
    title: 'Thế hệ mai sau',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA56IWbglnwQ-W7uIQ_gLCEYouY7Gn0xKl-MSCAYOXevIYal-AFpl8AbYS7JTLGPERpAqMK9K780r82MF2yLmAYWuc9b9KtWAq1ha327HEACWEPV85vKRHCKwF_4RCcoLjagugJzGdPNbQOAlQu0cmGcbJYCrnAqwrmvPn5W0Uuxmg_pmKL17w74XTcQRR6lW3Fh0JkRWWZp1XxzzgaEMaulAaltGThj0piBf9RWQF1EgULPcV53A',
    imageAlt: 'Next generation',
  },
  {
    id: '6',
    title: '', // Missing title in HTML
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEjgxsinwHraXdzw8juRxWIBYoIE_cKzghKpM5JTmAC2YeMYjng_GG4qLblSdEluOh-p0mrBkXG9pNvwjlqulf6eTTMZg2FvUnmusGMUEUHTHKPiU2CM7o0lUDCEMzTdwogbYTq_JZZbwX4llh8JCYUGR5qxlVoklObj6VWKZQNvhf8n5eBuVZsCiuF62iNkjZMKLAX2Rx03XRMdTi-NNwZz8ySBpLWl1ATl_loUDpu-A-vTbvKg',
    imageAlt: 'Cake',
  },
  {
    id: '7',
    title: 'Điệu nhảy đầu tiên',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKrHmzDHiYcU3lgWAjRq08BgJ7MmayNeZg3wubYuIrFDfG3bZGbUgf-ox4ap0eRkEJVZgLhC8CfnFfksUFgk4NEm_9Vb7QNoA2ay1WarNLlI9_SPWg4C_H3GhBkMMg-lZTxlSll2jv8CZspsqgrXu1HK48mT_BDoVkwXs1855NRH0pEP3I_XDA-FPA40sF5R9acP2hJbmW-ayOW_NXfIU5qC7N0HPKnjAQ3WD4jZLtmh-lr0FrFQ',
    imageAlt: 'First dance',
  },
  {
    id: '8',
    title: 'Kỷ vật thời gian',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4HJUN7Bk5astfwxGXgHl6Y6VyGGRF87VfZA3XJZtZi1uW6fcY5SDhA1C_MULJCEqurrIcV602SAywHH_gbVb_Djxmndi-g2WWZGWX7bxyZbfAyGGMYgrqM42gUYnrhb2oC7NQ7LVvywfetPP8DWIxXrR6zP3D8cDaAS1Hns0-jrijmow9SlscTg7QxK6RpdXMh32HoYNCvySldrl4KOLqn17i1dQ2TqlR9MVtqxqDA763q9y1Nw',
    imageAlt: 'Heirlooms',
  },
  {
    id: '9',
    title: 'Đại gia đình hôm nay',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9JJi1Bx3lwH-S-G3u0dXLQZiBnX9YzIh5zSag3xMCsdLRCgKljMalXACLaMB221scsiajgr34pueekxHc3U0SL2vuYT5TnXE3Wx5essqxMMEGtmQnKLZrPwmGnaHyMXrudT4IIxgP1KDj_G0H3Fcou0JCSNixiCkwSIDXGwGr7lyUt2qRF56tVjSKLIoDoW4zfCVCPXpGvHQz4oAS8qJZnqwaa0_UcZsIR4ssHg-b9r02ao3nvg',
    imageAlt: 'Family today',
  },
];

export const timelineSnippet: TimelineSnippetEvent[] = [
  {
    id: '1',
    time: '08:00 AM',
    title: 'Lễ rước dâu tại phố cổ',
    description: 'Đoàn xích lô mang trầu cau đi qua những con phố rợp bóng cây.',
  },
  {
    id: '2',
    time: '11:30 AM',
    title: 'Tiệc trà thân mật',
    description: 'Bạn bè và đồng nghiệp quây quần chúc phúc tại nhà riêng.',
  },
  {
    id: '3',
    time: '06:00 PM',
    title: 'Chụp ảnh kỷ niệm tại Bờ Hồ',
    description: 'Khoảnh khắc hoàng hôn lãng mạn bên Hồ Gươm.',
  },
];
