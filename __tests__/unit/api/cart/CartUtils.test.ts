import {
  parseCustomerData,
  parseToShippingCartProduct,
  addRealStockToProducts,
  calculateProductRealStock,
  verifyProductStock
} from "@/lib/cart/cartUtils";
import {
  RawCustomerData,
  RawProduct,
  ApiProduct,
} from "@/lib/cart/types";
import { ShippingCartProduct } from "@/lib/types/shipping/CourierTypes";

describe("CartUtils tests", () => {
  describe("parseCustomerData", () => {
    it("should parse raw customer data correctly", () => {
      const rawData: RawCustomerData = {
        name: "Juan Pérez",
        shipping_street: "Calle Principal 123",
        commune: "Santiago",
        phone: "+56912345678",
      };

      const result = parseCustomerData(rawData);

      expect(result).toEqual({
        name: "Juan Pérez",
        shippingStreet: "Calle Principal 123",
        commune: "Santiago",
        phone: "+56912345678",
      });
    });

    it("should handle special characters in names", () => {
      const rawData: RawCustomerData = {
        name: "María José García-López",
        shipping_street: "Av. O'Higgins #456",
        commune: "Valparaíso",
        phone: "+56987654321",
      };

      const result = parseCustomerData(rawData);

      expect(result.name).toBe("María José García-López");
      expect(result.shippingStreet).toBe("Av. O'Higgins #456");
    });
  });

  describe("parseToShippingCartProduct", () => {
    const mockRawProduct: RawProduct = {
      productId: "101",
      price: "29.99",
      quantity: "2",
      discount: "5.00",
    };

    const mockApiProduct: ApiProduct = {
      id: 101,
      title: "Laptop",
      stock: 50,
      rating: 4.5,
      dimensions: {
        width: 35,
        height: 25,
        depth: 2,
      },
    };

    it("should convert raw product and API product to shipping cart product", () => {
      const result = parseToShippingCartProduct(
        mockRawProduct,
        mockApiProduct
      );

      expect(result).toEqual({
        id: "101",
        name: "Laptop",
        price: 29.99,
        quantity: 2,
        discount: 5.0,
        stock: 50,
        rating: 4.5,
        width: 35,
        height: 25,
        depth: 2,
      });
    });

    it("should convert string values to numbers", () => {
      const result = parseToShippingCartProduct(
        mockRawProduct,
        mockApiProduct
      );

      expect(typeof result.price).toBe("number");
      expect(typeof result.quantity).toBe("number");
      expect(typeof result.discount).toBe("number");
    });

    it("should handle numeric input values", () => {
      const numericRawProduct: RawProduct = {
        productId: 102,
        price: 49.99,
        quantity: 1,
        discount: 10,
      };

      const result = parseToShippingCartProduct(
        numericRawProduct,
        mockApiProduct
      );

      expect(result.price).toBe(49.99);
      expect(result.quantity).toBe(1);
      expect(result.discount).toBe(10);
    });
  });

  describe("calculateProductRealStock", () => {
    it("should calculate real stock as floor(stock / rating)", () => {
      const product: ShippingCartProduct = {
        id: "1",
        name: "Test Product",
        price: 100,
        quantity: 1,
        discount: 0,
        stock: 100,
        rating: 4.5,
        width: 10,
        height: 10,
        depth: 10,
      };

      const result = calculateProductRealStock(product);

      expect(result).toBe(Math.floor(100 / 4.5));
      expect(result).toBe(22);
    });

    it("should handle high ratings (stock < rating)", () => {
      const product: ShippingCartProduct = {
        id: "2",
        name: "Premium Product",
        price: 500,
        quantity: 1,
        discount: 0,
        stock: 3,
        rating: 4.8,
        width: 20,
        height: 20,
        depth: 20,
      };

      const result = calculateProductRealStock(product);

      expect(result).toBe(0);
    });

    it("should handle integer ratings", () => {
      const product: ShippingCartProduct = {
        id: "3",
        name: "Popular Product",
        price: 50,
        quantity: 2,
        discount: 5,
        stock: 100,
        rating: 5,
        width: 15,
        height: 15,
        depth: 15,
      };

      const result = calculateProductRealStock(product);

      expect(result).toBe(20);
    });
  });

  describe("addRealStockToProducts", () => {
    it("should add realStock to all products", () => {
      const products: ShippingCartProduct[] = [
        {
          id: "1",
          name: "Product 1",
          price: 100,
          quantity: 1,
          discount: 0,
          stock: 100,
          rating: 5,
          width: 10,
          height: 10,
          depth: 10,
        },
        {
          id: "2",
          name: "Product 2",
          price: 50,
          quantity: 2,
          discount: 10,
          stock: 50,
          rating: 2.5,
          width: 5,
          height: 5,
          depth: 5,
        },
      ];

      const result = addRealStockToProducts(products);

      expect(result).toHaveLength(2);
      expect(result[0].realStock).toBe(20);
      expect(result[1].realStock).toBe(20);
    });

    it("should not mutate original array", () => {
      const products: ShippingCartProduct[] = [
        {
          id: "1",
          name: "Product 1",
          price: 100,
          quantity: 1,
          discount: 0,
          stock: 100,
          rating: 5,
          width: 10,
          height: 10,
          depth: 10,
        },
      ];

      const result = addRealStockToProducts(products);

      expect(products[0]).not.toHaveProperty("realStock");
      expect(result[0]).toHaveProperty("realStock");
    });

    it("should handle empty array", () => {
      const result = addRealStockToProducts([]);

      expect(result).toEqual([]);
    });

    it("should preserve all original product properties", () => {
      const product: ShippingCartProduct = {
        id: "123",
        name: "Test Product",
        price: 99.99,
        quantity: 3,
        discount: 15,
        stock: 60,
        rating: 4.2,
        width: 12,
        height: 14,
        depth: 8,
      };

      const result = addRealStockToProducts([product]);

      expect(result[0]).toMatchObject(product);
      expect(result[0].realStock).toBeDefined();
    });
  });

  describe("verifyProductStock", () => {
    const products: ShippingCartProduct[] = [
      {
        id: "1",
        name: "Product 1",
        price: 100,
        quantity: 2,
        discount: 0,
        stock: 50,
        rating: 5,
        width: 10,
        height: 10,
        depth: 10,
        realStock: 20,
      },
      {
        id: "2",
        name: "Product 2",
        price: 50,
        quantity: 1,
        discount: 10,
        stock: 30,
        rating: 3,
        width: 5,
        height: 5,
        depth: 5,
        realStock: 15,
      },
    ];

    it("should return true if all products have sufficient stock", () => {
      const result = verifyProductStock(products);
      expect(result).toBe(true);
    });

    it("should return false if any product has insufficient stock", () => {
      const insufficientStockProducts = [
        ...products,
        {
          id: "3",
          name: "Product 3",
          price: 75,
          quantity: 5,
          discount: 5,
          stock: 20,
          rating: 4,
          width: 8,
          height: 8,
          depth: 8,
          realStock: 3,
        },
      ];

      const result = verifyProductStock(insufficientStockProducts);
      expect(result).toBe(false);
    });

    it("should handle empty product array", () => {
      const result = verifyProductStock([]);
      expect(result).toBe(true);
    });
  });
});
