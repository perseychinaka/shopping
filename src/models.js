import Realm from 'realm';
import React from 'react';

const ProductsContext = React.createContext();
const StockContext = React.createContext();
const CategoryContext = React.createContext();
const ProductDetailContext = React.createContext();
const CustomerContext = React.createContext();
const PurchaseContext = React.createContext();
const PurchaseItemContext = React.createContext();

class BaseModel extends Realm.Object {
  static schema = {
    primaryKey: 'id',
    properties: {
      id: 'string',
    },
  };
}

class Category extends BaseModel {
  static schema = {
    ...BaseModel.schema,
    name: 'Category',
    properties: {
      ...BaseModel.schema.properties,
      name: 'string',
      description: 'string',
    },
  };
}

class Product extends BaseModel {
  static schema = {
    ...BaseModel.schema,
    name: 'Product',
    properties: {
      ...BaseModel.schema.properties,
      name: 'string',
      description: 'string',
      category: 'Category',
    },
  };
}

class Stock extends BaseModel {
  static schema = {
    ...BaseModel.schema,
    name: 'Stock',
    properties: {
      ...BaseModel.schema.properties,
      date: 'date',
      total: 'double',
    },
  };
}

class ProductDetail extends BaseModel {
  static schema = {
    ...BaseModel.schema,
    name: 'ProductDetail',
    properties: {
      ...BaseModel.schema.properties,
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

class Customer extends BaseModel {
  static schema = {
    ...BaseModel.schema,
    name: 'Customer',
    properties: {
      ...BaseModel.schema.properties,
      name: 'string',
      number: 'string',
    },
  };
}

class Purchase extends BaseModel {
  static schema = {
    ...BaseModel.schema,
    name: 'Purchase',
    properties: {
      ...BaseModel.schema.properties,
      customer: 'Customer',
      at: 'date',
      total_paid: 'double',
    },
  };
}

class PurchaseItem extends BaseModel {
  static schema = {
    ...BaseModel.schema,
    name: 'PurchaseItem',
    properties: {
      ...BaseModel.schema.properties,
      purchase: 'Purchase',
      detail: 'ProductDetail',
      quantity: 'int',
    },
  };
}

export {Category, Product, Stock, ProductDetail, Customer, Purchase, PurchaseItem, ProductsContext, StockContext, CategoryContext, ProductDetailContext, CustomerContext, PurchaseContext, PurchaseItemContext};