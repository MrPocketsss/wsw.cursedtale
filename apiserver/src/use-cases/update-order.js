export default function buildMakeUpdateOrder({ OrderModel }) {
  return async function (orderNumber, order) {
    return await OrderModel.updateOne(orderNumber, order);
  };
}
