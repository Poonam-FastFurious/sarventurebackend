import { ApiError } from "../../utils/ApiError.js";
import { Order } from "../Order/Order.model.js";
import { User } from "../User/User.model.js";
import {Product} from "../Product/Product.models.js"
import { asyncHandler } from "../../utils/asyncHandler.js";

const DashBoardHeaderData = asyncHandler(async (req, res) => {
    const { userId } = req.query; // Assuming the product ID is passed in the URL parameter
    let totalOrderValue = 0, totalOrderCount = 0, totalUserCount = 0, recentOrderCount = 0, earnings = 0, refunds = 0, 
        conversionRatio = 0;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    const orderData = await Order.find({});

    totalOrderValue = orderData.reduce((acc, curr) => acc + curr.totalAmount, 0);
    totalOrderCount = orderData.length;
    
    const recentOrdersData = orderData.filter(doc => doc.createdAt > sevenDaysAgo);

    recentOrderCount = recentOrdersData.length;

    const recentOrdersSelectedFileds = recentOrdersData.map(order => {
      return {
          orderID: order.orderID,
          customer: order.customer,
          products: order.products.map(product => product.product),
          totalAmount: order.totalAmount,
          status:order.status,
          Review:''
      };
  });

  console.log(recentOrdersSelectedFileds)
  const resOrderData = (recentOrdersSelectedFileds) => {
    const result = [];
  
    for (const order of orders) {
      const { orderID, customer, totalAmount, products } = order;
      console.log(products)
      for (const product of products) {
        const productName = getProductNameById(product.product);
        result.push({
          orderID,
          customer,
          product: productName,
          amount: product.price
        });
      }
    }
  
    return result;
  };
    
    const result1 = await User.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 } 
        }
      }
    ]);
    if (result1.length > 0) {
      totalUserCount = result1[0].count;
    }
    return res.json({
      success: true,
      data: {totalOrderValue : totalOrderValue,totalOrderCount : totalOrderCount, totalUserCount : totalUserCount, 
              recentOrderCount: recentOrderCount, earnings: earnings, refunds: refunds, conversionRatio: conversionRatio, 
              recentOrdersData: resOrderData},
      message: "DashBoard Data get successfully",
    });
  });

const getProductNameById = (productId) => {
  
    const product = Product.find({_id:productId});
    //console.log(product);
    return product ? product.name : 'Unknown Product';
};
const DashBoardBSProductData = asyncHandler(async (req, res) => {
  
  const result = await Order.aggregate([
    {$unwind: "$products" },
    {
      $group: {
        _id: '$products.product',
        totalQuantity: { $sum: '$products.quantity' },
        totalTurnover: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
      }
    },
    {
      $sort: { totalQuantity: -1 }
    },
    {
      $limit: 5
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    {
      $unwind: "$productDetails"
    },
    {
      $project: {
        ProductID: "$productDetails._id",
        Product : "$productDetails.name",
        Category : "$productDetails.category",
        RemainingQuantity : "$productDetails.stock.quantity",
        turnOver: "$totalTurnover",
        IncreaseBy: "0",
      }
    }
  ]);

  if (result.length > 0) {
    console.log('Best Selling Product ID:', result[0]._id);
    console.log('Total Quantity Sold:', result[0].totalQuantity);
  } else {
    console.log('No data found');
  }
  return res.json({
    success: true,
    data: {result: result},
    message: "DashBoard Data get successfully",
  });
});

const DashBoardRecentUserData = asyncHandler(async (req, res) => {
  
  const result = await User.aggregate([
    {$unwind: "$products" },
    {
      $group: {
        _id: '$products.product',
        totalQuantity: { $sum: '$products.quantity' },
        totalTurnover: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
      }
    },
    {
      $sort: { totalQuantity: -1 }
    },
    {
      $limit: 5
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    {
      $unwind: "$productDetails"
    },
    {
      $project: {
        ProductID: "$productDetails._id",
        Product : "$productDetails.name",
        Category : "$productDetails.category",
        RemainingQuantity : "$productDetails.stock.quantity",
        turnOver: "$totalTurnover",
        IncreaseBy: "0",
      }
    }
  ]);

  if (result.length > 0) {
    console.log('Best Selling Product ID:', result[0]._id);
    console.log('Total Quantity Sold:', result[0].totalQuantity);
  } else {
    console.log('No data found');
  }
  return res.json({
    success: true,
    data: {result: result},
    message: "DashBoard Data get successfully",
  });
});

export { DashBoardHeaderData, DashBoardBSProductData, DashBoardRecentUserData };
