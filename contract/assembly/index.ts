import { Product, productsMap, products, ProductsResult, Order } from "./model";
import {
  logging,
  storage,
  ContractPromiseBatch,
  Context,
  u128,
} from "near-sdk-as";

// --- contract code goes below

// The maximum number of latest messages the contract returns.
const MESSAGE_LIMIT: i32 = 50;
const XCC_GAS: u64 = 20_000_000_000_000;

/**
 * Adds a new product under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */
export function addProduct(
  _name: string,
  _price: u128,
  _coin: string,
  _description: string,
  _options: string[]
): Product {
  const product = new Product(_name, _price, _coin, _description, _options);

  product.save();

  logging.log("[ADD_PRODUCT]: " + product.toString());

  return product;
}

/**
 * Returns an array of Product with page and limit.
 */
export function getProducts(_page: i32, _limit: i32): ProductsResult {
  const response = new ProductsResult();

  if (!_page) _page = 1;
  if (!_limit) _limit = MESSAGE_LIMIT;
  // limit the limit params
  if (_limit > MESSAGE_LIMIT) _limit = MESSAGE_LIMIT;

  const offset = _limit * _page - _limit;
  let numProducts = _limit * _page;
  if (products.length < _limit * _page) numProducts = products.length;

  if (numProducts - offset > 0) {
    const result = new Array<Product>(numProducts - offset);

    let index = 0;

    for (let i: i32 = offset; i < numProducts; i++) {
      result[index] = products[i];
      index++;
    }

    response.products = result;
  }
  response.success = true;
  response.limit = _limit;
  response.page = _page;
  logging.log("[GET_PRODUCTS]: " + response.toString());
  return response;
}

export function newOrder(_productId: u32): Order {
  assert(_productId, "[productId] is required");
  assert(productsMap.contains(_productId), "[productId] not found");

  const product = productsMap.getSome(_productId);

  assert(
    Context.attachedDeposit >= product.price,
    `Product price is ${product.price}`
  );

  const order = new Order(product.id);
  order.save();

  // * Refund if they send more than product.price
  if (Context.attachedDeposit <= product.price) return order;

  const to_self = Context.contractName;
  const to_buyer = Context.sender;

  ContractPromiseBatch.create(to_buyer)
    .transfer(u128.sub(Context.attachedDeposit, product.price))
    .then(to_self)
    .function_call("on_refund_complete", order, u128.Zero, XCC_GAS);
  return order;
}

export function on_refund_complete(productId: u64): void {
  logging.log(`[${productId}] refund complete`);
}
