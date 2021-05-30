import {
  Product,
  productsMap,
  products,
  ProductsResult,
  orders,
  ordersMap,
  Order,
} from "./model";
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

/**
 * Adds a new product under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */
export function addProduct(
  _name: string,
  _price: u128,
  _coin: string,
  _description: string
): Product {
  // Creating a new product and populating fields with our data
  let lastId: u32 = storage.getPrimitive<u32>("lastId", 100);
  const product = new Product(
    lastId,
    _name,
    _price,
    _coin,
    _description
  );

  // Adding the message to end of the the persistent collection
  productsMap.set(lastId, product);
  products.push(product);

  logging.log("[ADD_PRODUCT]: " + product.toString());

  // new uuid
  storage.set<u32>("lastId", lastId + 1);

  return product;
}

/**
 * Returns an array of last N messages.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
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

export function newOrder(_productId: u32): void {
  assert(_productId, "[productId] is required");

  const product = productsMap.get(_productId, null);

  assert(product, "[product] not found");

  if (!product) return;
  if (!product.price) return;
  logging.log(Context.accountBalance);
  logging.log(product.price);
  assert(Context.accountBalance > product.price, "Out of money");

  const promise = ContractPromiseBatch.create(Context.contractName).transfer(
    product.price
  ); // send 1 near
  logging.log("[ContractPromiseBatch]: ");
  logging.log(promise.id);

  const order = new Order(product.id);
  logging.log("[Order]: ");
  logging.log(order);

  orders.push(order);
  ordersMap.set(order.getKey(), order);
}
