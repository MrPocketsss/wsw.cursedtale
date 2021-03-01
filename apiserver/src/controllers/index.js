import makeGetOrders from './getOrders';
import makeUpdateOrders from './updateOrders';
import makeCreateOrders from './createOrders';

import useCases from '../use-cases/index.js';
import { AppError } from '../error-handling/index.js';

const getOrder = useCases.makeGetOrder;
const updateOrder = useCases.makeUpdateOrder;
const createOrder = useCases.makeCreateOrder;

const getOrders = makeGetOrders({ AppError, getOrder });
const updateOrders = makeUpdateOrders({ AppError, updateOrder });
const createOrders = makeCreateOrders({ AppError, createOrder });

const controllers = Object.freeze({
  getOrders,
  updateOrders,
  createOrders,
});

export default controllers;
