
import Realm from 'realm';

class Category extends Realm.Object {
  static schema = {
  primaryKey: 'id',
  name: 'Category',
  properties: {
    id: 'string',
    name: 'string',
    description: 'string',
  },
};
}
class Product extends Realm.Object {
  static schema = {
  primaryKey: 'id',
  name: 'Product',
  properties: {
    id: 'string',
    name: 'string',
    description: 'string',
    category: 'Category',
  },
};
}

class Stock extends Realm.Object {
  static schema = {
  primaryKey: 'id',
  name: 'Stock',
  properties: {
    id: 'string',
    date: 'date',
    total: 'double',
  },
};
}
class ProductDetail extends Realm.Object {
  static schema = {
  primaryKey: 'id',
  name: 'ProductDetail',
  properties: {
    id: 'string',
    product: 'Product',
    quantity: 'int',
    price: 'double',
    size: 'string',
    cost: 'double',
    barcode: 'string',
    expiry_date: 'date',
  },
};
}
class Customer extends Realm.Object {
  static schema = {
  primaryKey: 'id',
  name: 'Customer',
  properties: {
    id: 'string',
    name: 'string',
    number: 'string',
  },
};
}

class Purchase extends Realm.Object {
  static schema = {
  primaryKey: 'id',
  name: 'Purchase',
  properties: {
    id: 'string',
    customer: 'Customer',
    at: 'date',
    total_paid: 'double',
  },
};
}
class PurchaseItem extends Realm.Object {
  static schema = {
  primaryKey: 'id',
  name: 'PurchaseItem',
  properties: {
    id: 'string',
    purchase: 'Purchase',
    detail: 'ProductDetail',
    quantity: 'int',
  },
};
}
export {Category, Product, Stock, ProductDetail, Customer, Purchase, PurchaseItem };