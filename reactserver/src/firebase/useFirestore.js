import { database } from './Firebase';

const db = database.ref('/orders');

class OrdersDataService {
  getAll() {
    let filter = [];
    const orderQuery = db.orderByChild('currentStatus').equalTo('Pending Approval');
    // .orderByChild('currentStatus')
    // .equalTo('Approved')
    orderQuery.once('value', (snapshot) => {
      snapshot.forEach((child) => {
        const key = child.key;
        const data = child.val();
        console.log(key, data);

        if (data.isActive === true && filter.length < 20) filter.push({ key, data });
      });
    });
    console.log(filter);

    // return db;
  }
  create(order) {
    return db.push(order);
  }
  update(key, value) {
    return db.child(key).update(value);
  }
  delete(key) {
    return db.child(key).remove();
  }
  deleteAll() {
    return db.remove();
  }
}

export default new OrdersDataService();
