export default function makeCreateOrders({ AppError, createOrder }) {
  return async function createOrders(req, res, next) {
    const order = req.body.order;

    if (!email) return next(new AppError(`No order provided`, 400));

    const orderCreated = await createOrder(order);

    if (!orderCreated) return next(new AppError(`Could not create that order`, 401));

    res.sendStatus(201);
  };
}
