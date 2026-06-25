import { http, HttpResponse } from "msw";

export const MOCK_MENU = [
  { id: 1, name: "Margherita Pizza", description: "Classic pizza", price: 12.99, image: "" },
  { id: 2, name: "Cheeseburger", description: "Juicy burger", price: 9.99, image: "" },
];

export const MOCK_ORDER = {
  id: 1,
  customer_name: "John Doe",
  address: "123 Main St",
  phone: "1234567890",
  status: "Order Received",
  items: [{ menu_item_id: 1, quantity: 2 }],
};

export const handlers = [
  http.get("/menu/", () => HttpResponse.json(MOCK_MENU)),
  http.post("/orders/", () => HttpResponse.json(MOCK_ORDER, { status: 201 })),
  http.get("/orders/", () => HttpResponse.json([MOCK_ORDER])),
  http.get("/orders/1", () => HttpResponse.json(MOCK_ORDER)),
];
