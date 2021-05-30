import { addProduct, getProducts, newOrder } from "..";
import { Product } from "../model";
import { u128 } from "near-sdk-as";

const addNewProduct = (): Product => {
  return addProduct("hello world product1", u128.from(10) , "", "just testing description");
};

describe("addProduct: ", () => {
  it("should be addProduct", () => {
    const product = addNewProduct();
    expect(product.name).toBe("hello world product1");
    expect(product.id).toBe(100);
  });

  it("should be show all product", () => {
    addNewProduct();
    expect(getProducts(1, 10).products.length).toBe(1);

    addNewProduct();
    addNewProduct();
    addNewProduct();

    expect(getProducts(1, 10).products.length).toBe(4);

    expect(getProducts(1, 10).products[0].id).toBe(100);

    expect(getProducts(1, 10).products[1].id).toBe(101);

    expect(getProducts(1, 10).products[2].id).toBe(102);
  });

  it("should be product paging", () => {
    log("test");
    addNewProduct();
    addNewProduct();
    addNewProduct();
    addNewProduct();
    addNewProduct();
    addNewProduct();
    addNewProduct();
    addNewProduct();
    addNewProduct();
    addNewProduct();
    expect(getProducts(1, 5).products.length).toBe(5);
    expect(getProducts(1, 10).products.length).toBe(10);
    expect(getProducts(2, 10).products.length).toBe(0);
    expect(getProducts(3, 10).products.length).toBe(0);

    addNewProduct();
    expect(getProducts(1, 10).products.length).toBe(10);
    expect(getProducts(2, 10).products.length).toBe(1);
    expect(getProducts(3, 10).products.length).toBe(0);
    expect(getProducts(1, 20).products.length).toBe(11);
  });

  it("create new order", () => {
    const product = addNewProduct();
    expect(product.name).toBe("hello world product1");
    expect(product.id).toBe(100);
    newOrder(100)
  });
});
