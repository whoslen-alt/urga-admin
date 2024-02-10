//   CREATED: 100,
//   ACCEPTED: 200,
//   PROCESSING: 300,
//   DECLINED: 400,
//   REFUNDED: 500,

const refundStatus = {
  100: {
    status: 'Үүссэн',
    color: 'blue',
  },
  200: {
    status: 'Зөвшөөрөгдсөн',
    color: 'green',
  },
  300: {
    status: 'Шалгаж буй',
    color: 'yellow',
  },
  400: {
    status: 'Цуцалсан',
    color: 'red',
  },
  500: {
    status: 'Буцаан олгогдсон',
    color: 'yellow',
  },
};

module.exports.refundStatus = refundStatus;
