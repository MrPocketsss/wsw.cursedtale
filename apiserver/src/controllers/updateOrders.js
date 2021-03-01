export default function makeUpdateOrders({ AppError, updateOrder }) {
  return async function updateOrders(req, res, next) {
    const orderNumber = req.body.orderNumber;
    const order = req.body.order;

    if (!orderNumber) return next(new AppError(`No order id provided`, 400));
    if (!order) return next(new AppError(`No order provided`, 400));

    const orderUpdated = await updateOrder(orderNumber, order);

    if (!orderUpdated) return next(new AppError(`Could not update that order`, 401));

    res.sendStatus(201);
  };
}
