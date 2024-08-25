import { cartModel } from "../models/cartModel";
import productModel from "../models/productModel";

interface CreateCartForUser {
  userId: string;
}
const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 });
  await cart.save();
  return cart;
};

interface GetActiveCartForUser {
  userId: string;
}

export const getActiveCartForUser = async ({
  userId,
}: GetActiveCartForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }
  return cart;
};

interface AddItemToCart {
  productId: any;
  userId: string;
  quantity: number;
}

export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  // does Items exist in cart?!
  const existsInCart =  cart.items.find((p) => p.product.toString === productId);

  if (existsInCart) {
    return { data: "Item already exist in Cart!", statusCode: 400 };
  }

  //Fetch the product
  const product = await productModel.findById(productId);
  if (!product) {
    return { data: "Product not found!", statusCode: 400 };
  }
  if (product.stock < quantity) {
    return {data: "Low stock for item", statusCode: 400};
  }

   cart.items.push({
    product: productId,
    unitPrice: product.price,
    quantity
  });

  //Update the totalAmount for the cart
  cart.totalAmount += product.price * quantity;


  const updatedCart = await cart.save();

  return {data: updatedCart, statusCode: 201};
};

//update Item on Cart
interface UpdateItemInCart {
  productId: any;  
  userId: string;
  quantity: number;
}

export const updateItemInCart = async ({
  productId,
  quantity,
  userId
}: UpdateItemInCart) => {
  
  const cart = await getActiveCartForUser({ userId });

  
  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existsInCart) {
    return { data: "Item does not exist in cart", statusCode: 400 };
  }
  // fetch the product
  const product = await productModel.findById(productId);

  if(!product) {
    return { data: "Product not found!", statusCode: 400};
  }

  if (product.stock < quantity) {
    return { data: "Low stock for Item", statusCode: 400};
  }

  

  //Calculate total amount for the cart

  const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId)
  console.log(otherCartItems)


  let total = otherCartItems.reduce((sum, product) => {
   sum += product.quantity * product.unitPrice;
   return sum;
  }, 0)

  existsInCart.quantity = quantity;
  total += existsInCart.quantity * existsInCart.unitPrice;
  cart.totalAmount = total;

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200};
};
