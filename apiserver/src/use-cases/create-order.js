export default function buildMakeCreateOrder({ AppError, OrderModel }) {
  return async function (order) {
    const order = new OrderModel({ order });
    order.save((error) => {
      if (error) throw error;
    });
    if (!user) throw new AppError('Cannot create user right now', 400);
    return true;
  };
}
