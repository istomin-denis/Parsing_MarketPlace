// Synthetic fixtures shaped like simplified responses from three marketplace APIs.
// They are hand-written demo data, not captured from real marketplace services.

export const marketplaceFixtures = {
  wildberries: [
    { nmId: '1001', name: 'Беспроводные наушники Studio Air', brandName: 'North Audio', priceU: 599000, salePriceU: 429000, reviewRating: 4.8, feedbacks: 1240, quantity: 23, subjectName: 'Электроника', description: 'Демонстрационная карточка беспроводных наушников.' },
    { nmId: '1004', name: 'Рюкзак городской 20 л', brandName: 'WayPoint', priceU: 289000, salePriceU: 219000, reviewRating: 4.5, feedbacks: 291, quantity: 11, subjectName: 'Аксессуары', description: 'Демонстрационная карточка городского рюкзака.' },
    { nmId: '1007', name: 'Бутылка для воды 750 мл', brandName: 'TrailKit', priceU: 119000, salePriceU: 89000, reviewRating: 4.3, feedbacks: 966, quantity: 42, subjectName: 'Спорт', description: 'Демонстрационная карточка бутылки для воды.' },
    { nmId: '1010', name: 'Коврик для йоги 6 мм', brandName: 'Balance Form', priceU: 179000, salePriceU: 139000, reviewRating: 4.7, feedbacks: 610, quantity: 17, subjectName: 'Спорт', description: 'Демонстрационная карточка коврика для йоги.' },
    { nmId: '1013', name: 'Футболка базовая хлопковая', brandName: 'Everyday', priceU: 149000, salePriceU: 99000, reviewRating: 4.6, feedbacks: 1902, quantity: 65, subjectName: 'Одежда', description: 'Демонстрационная карточка футболки.' },
    { nmId: '1016', name: 'Термокружка 450 мл', brandName: 'TrailKit', priceU: 159000, salePriceU: 119000, reviewRating: 4.4, feedbacks: 440, quantity: 28, subjectName: 'Дом', description: 'Демонстрационная карточка термокружки.' }
  ],
  ozon: [
    { sku: '1002', name: 'Механическая клавиатура Compact 75', brand: 'KeyCraft', marketingPrice: '6790', oldPrice: '7990', rating: '4.7', reviewsCount: 816, stock: 18, category: 'Электроника', description: 'Демонстрационная карточка механической клавиатуры.' },
    { sku: '1005', name: 'Монитор IPS 27 дюймов', brand: 'PixelView', marketingPrice: '18990', oldPrice: '21990', rating: '4.9', reviewsCount: 408, stock: 7, category: 'Электроника', description: 'Демонстрационная карточка монитора.' },
    { sku: '1008', name: 'Внешний SSD 1 ТБ', brand: 'DataNest', marketingPrice: '8990', oldPrice: '10490', rating: '4.8', reviewsCount: 752, stock: 15, category: 'Электроника', description: 'Демонстрационная карточка внешнего накопителя.' },
    { sku: '1011', name: 'Веб-камера Full HD', brand: 'ClearFrame', marketingPrice: '3290', oldPrice: '3790', rating: '4.5', reviewsCount: 227, stock: 9, category: 'Электроника', description: 'Демонстрационная карточка веб-камеры.' },
    { sku: '1014', name: 'Мышь беспроводная эргономичная', brand: 'KeyCraft', marketingPrice: '1890', oldPrice: '2290', rating: '4.6', reviewsCount: 380, stock: 32, category: 'Электроника', description: 'Демонстрационная карточка компьютерной мыши.' },
    { sku: '1017', name: 'Настольная подставка для ноутбука', brand: 'DeskMate', marketingPrice: '2790', oldPrice: '3290', rating: '4.5', reviewsCount: 201, stock: 13, category: 'Аксессуары', description: 'Демонстрационная карточка подставки.' }
  ],
  yandexMarket: [
    { offerId: '1003', offerName: 'Умная колонка Home Mini', vendor: 'ДомЗвук', price: { value: 3490 }, oldPrice: { value: 3990 }, shopRating: 4.6, reviewsCount: 532, available: true, category: 'Электроника', description: 'Демонстрационная карточка умной колонки.' },
    { offerId: '1006', offerName: 'Кофемолка электрическая', vendor: 'Morning Lab', price: { value: 2590 }, oldPrice: { value: 0 }, shopRating: 4.4, reviewsCount: 173, available: false, category: 'Дом', description: 'Демонстрационная карточка кофемолки.' },
    { offerId: '1009', offerName: 'Настольная лампа LED', vendor: 'Luma', price: { value: 1690 }, oldPrice: { value: 1990 }, shopRating: 4.2, reviewsCount: 148, available: true, category: 'Дом', description: 'Демонстрационная карточка настольной лампы.' },
    { offerId: '1012', offerName: 'Органайзер для рабочего стола', vendor: 'DeskMate', price: { value: 790 }, oldPrice: { value: 0 }, shopRating: 4.1, reviewsCount: 84, available: true, category: 'Дом', description: 'Демонстрационная карточка органайзера.' },
    { offerId: '1015', offerName: 'Портативная Bluetooth-колонка', vendor: 'North Audio', price: { value: 4990 }, oldPrice: { value: 5490 }, shopRating: 4.7, reviewsCount: 318, available: false, category: 'Электроника', description: 'Демонстрационная карточка портативной колонки.' },
    { offerId: '1018', offerName: 'Пауэрбанк 20000 мАч', vendor: 'VoltWay', price: { value: 2990 }, oldPrice: { value: 3590 }, shopRating: 4.6, reviewsCount: 590, available: true, category: 'Электроника', description: 'Демонстрационная карточка внешнего аккумулятора.' }
  ]
};
