import { asyncHandler } from "../../utils/asyncHandler.js";

import { ApiError } from "../../utils/ApiError.js";
import { ReturnPolicyModal } from "./ReturnPolicy.modal.js";

const addReturnPolicy = asyncHandler(async (req, res) => {
      // Get return policy details from the request body
      const { ReturnPolicy } = req.body;

      // Validation - Check if required fields are not empty
      if (!ReturnPolicy) {
            throw new ApiError(400, "Return policy is required");
      }

      // Check if return policy already exists
      const existingReturnPolicy = await ReturnPolicyModal.findOne({ ReturnPolicy });

      if (existingReturnPolicy) {
            throw new ApiError(409, "Return policy already exists");
      }

      // Create the return policy object
      const returnPolicy = await ReturnPolicyModal.create({ ReturnPolicy });

      // Check for return policy creation
      if (!returnPolicy) {
            throw new ApiError(500, "Something went wrong while creating the return policy");
      }

      return res.status(201).json({
            success: true,
            data: returnPolicy,
            message: "Return policy created successfully",
      });
});

export { addReturnPolicy };
