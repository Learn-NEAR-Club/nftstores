import { context, u128, PersistentVector, PersistentMap } from "near-sdk-as";

/**
 * Exporting a new class Product so it can be used outside of this file.
 */
@nearBindgen
export class Product {
  id: u64;
  sender: string;
  name: string;
  coin: string; // Buy with diff coin
  price: u128;
  description: string;

  constructor(
    public _id: u64,
    public _name: string,
    public _price: u128,
    public _coin: string,
    public _description: string
  ) {
    assert(_id, "[id] is required");
    assert(_name, "[name] is required");
    assert(_price, "[price] is required");
    assert(_price > u128.from(0), "[price] must be greater than 0");

    this.id = _id;
    this.name = _name;
    this.price = _price;
    this.description = _description;
    this.sender = context.sender;

    // Use Near as default
    if (!_coin) this.coin = "NEAR";
    else this.coin = _coin;
  }

  public toString(): string {
    return `id: ${this.id}, name: ${this.name}, price: ${this.price}, coin: ${this.coin}, description: ${this.description}`;
  }
}

@nearBindgen
export class Order {
  productId: u64;
  owner: string;
  constructor(public _id: u64) {
    this.productId = _id;
    this.owner = context.sender;
  }

  public getKey(): string {
    return `${this.productId}_${this.owner}_${context.blockTimestamp}`;
  }
}

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

/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
export const products = new PersistentVector<Product>("p");
export const productsMap = new PersistentMap<u32, Product>("pm");
export const orders = new PersistentVector<Order>("o");
export const ordersMap = new PersistentMap<string, Order>("om");
