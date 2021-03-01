import buildMakeGetOrders from './get-orders';
import buildMakeUpdateOrder from './update-order';
import buildMakeCreateOrder from './create-order';

import { ArchivedList, ConfirmationList, PendingList, OrderModel } from '../data-access/index.js';
import { AppError } from '../error-handling/index.js';

const makeGetOrder = buildMakeGetOrders({ AppError, ArchivedList, ConfirmationList, PendingList });
const makeUpdateOrder = buildMakeUpdateOrder({ OrderModel });
const makeCreateOrder = buildMakeCreateOrder({ AppError, OrderModel });

const useCases = Object.freeze({
  makeCreateOrder,
  makeGetOrder,
  makeUpdateOrder,
});

export default useCases;
