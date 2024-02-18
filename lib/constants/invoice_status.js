const invoiceStatus = {
  100: {
    status: 'Үүссэн',
    color: 'blue',
  },
  101: {
    status: 'Батлах хүсэлт',
    color: 'orange',
  },
  200: {
    status: 'Батлагдсан',
    color: 'cyan',
  },
  201: {
    status: 'Төлбөрийн батлах хүсэлт',
    color: 'green',
  },
  202: {
    status: 'Төлбөр батлагдсан',
    color: 'gray',
  },
  300: {
    status: 'Цуцалсан',
    color: 'red',
  },
  301: {
    status: 'Хугацаа дууссан',
    color: 'yellow',
  },
};

module.exports.invoiceStatus = invoiceStatus;
