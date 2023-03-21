const orderStatus = {
  100: {
    status: 'Үүссэн',
    color: 'blue',
  },
  200: {
    status: 'Төлбөр хийгдсэн',
    color: 'cyan',
  },
  201: {
    status: 'Хүлээн авсан',
    color: 'green',
  },
  202: {
    status: 'Хүргэж өгсөн',
    color: 'gray',
  },
  301: {
    status: 'Цуцалсан',
    color: 'red',
  },
  302: {
    status: 'Хугацаа дууссан',
    color: 'yellow',
  },
  303: {
    status: 'Цуцлагдсан',
    color: 'yellow',
  },
};

module.exports.orderStatus = orderStatus;
