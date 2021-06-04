import { context, u128, PersistentVector, PersistentMap } from "near-sdk-as";

// ----------------------------------------------------------------------------
// Product
// ----------------------------------------------------------------------------
@nearBindgen
export class Product {
  id: i32;
  sender: string;
  name: string;
  coin: string;
  price: u128;
  description: string;
  options: string[];
  createdAt: u64 = context.blockTimestamp;

  constructor(
    _name: string,
    _price: u128,
    _coin: string,
    _description: string,
    _options: string[]
  ) {
    assert(_name, "[name] is required");
    assert(_price, "[price] is required");
    assert(_price > u128.from(0), "[price] must be greater than 0");

    this.id = products.length;
    this.name = _name;
    this.price = _price;
    this.description = _description;
    this.sender = context.sender;
    this.options = _options || [];

    // Use Near as default
    if (!_coin) this.coin = "NEAR";
    else this.coin = _coin;
  }

  public toString(): string {
    return `id: ${this.id}, name: ${this.name}, price: ${this.price}, coin: ${this.coin}, description: ${this.description}`;
  }

  public save(): void {
    products.push(this);
    productsMap.set(this.id, this);
  }
}

// ----------------------------------------------------------------------------
// Order
// ----------------------------------------------------------------------------
@nearBindgen
export class Order {
  id: i32;
  productId: i32;
  customerId: string;
  shippingAddress: string;
  orderEmail: string;

  createdAt: u64 = context.blockTimestamp;

  constructor(_id: i32) {
    this.id = orders.length;
    this.productId = _id;
    this.customerId = context.sender;
  }

  public getKey(): string {
    return `${this.productId}_${this.customerId}_${context.blockTimestamp}`;
  }

  public save(): void {
    orders.push(this);
    ordersMap.set(this.id, this);
  }
}

// ----------------------------------------------------------------------------
// OrderDetail
// ----------------------------------------------------------------------------
@nearBindgen
export class OrderDetail {
  id: i32;
  orderId: i32;
  productId: i32;
  quantity: number;
  createdAt: u64 = context.blockTimestamp;

  constructor(_orderId: i32, _productId: i32, _quantity: number) {
    this.id = orderDetails.length;
    this.orderId = _orderId;
    this.productId = _productId;
    this.quantity = _quantity || 1;
  }

  public getKey(): string {
    return `${this.productId}_${context.blockTimestamp}`;
  }

  public save(): void {
    orderDetails.push(this);
    orderDetailsMap.set(this.id, this);
  }
}

export class Setting {
  domain: string; // custom domain like example_near_swag.com
}

// ----------------------------------------------------------------------------
// Data
// ----------------------------------------------------------------------------
export const products = new PersistentVector<Product>("p");
export const productsMap = new PersistentMap<u32, Product>("pm");

export const orders = new PersistentVector<Order>("o");
export const ordersMap = new PersistentMap<u32, Order>("om");

export const orderDetails = new PersistentVector<OrderDetail>("od"); // Map <orderID, OrderDetail>
export const orderDetailsMap = new PersistentMap<u32, OrderDetail>("odm"); // Map <orderID, OrderDetail>

export const settings = new PersistentVector<Setting>("s");
export const settingsMap = new PersistentVector<Setting>("sm");

/**
 * All interface for return data
 *
 *
 */
@nearBindgen
export class ProductsResult {
  products: Product[];
  page: i32;
  limit: i32;
  success: bool;
  error: string;

  constructor() {
    this.success = false;
    this.products = [];
  }

  public toString(): string {
    return `products: ${this.products.length}, page: ${this.page}, limit: ${this.limit}, success: ${this.success}`;
  }
}
