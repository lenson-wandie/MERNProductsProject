import PaymentService from "../services/paymentService.js";
import {validationResult} from "express-validator";
import logger from "../utils/logger.js";

class PaymentController {
    static async createPaymentIntent(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { amount, currency, metadata } = req.body;
      const userId = req.user.id;

      const result = await PaymentService.createPaymentIntent(
        userId,
        amount,
        currency,
        metadata
      );

      res.status(201).json({
        success: true,
        message: 'Payment intent created successfully',
        data: result
      });
    } catch (error) {
      logger.error('Create payment intent error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create payment intent',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get transaction history
  static async getTransactionHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page, limit, status, dateFrom, dateTo } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (dateFrom) filters.dateFrom = dateFrom;
      if (dateTo) filters.dateTo = dateTo;

      const result = await PaymentService.getTransactionHistory(
        userId,
        parseInt(page) || 1,
        parseInt(limit) || 20,
        filters
      );

      res.json({
        success: true,
        message: 'Transaction history retrieved successfully',
        data: result
      });
    } catch (error) {
      logger.error('Get transaction history error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve transaction history'
      });
    }
  }

  // Process refund
  static async processRefund(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { transactionId } = req.params;
      const { amount, reason } = req.body;

      const refund = await PaymentService.processRefund(
        transactionId,
        amount,
        reason
      );

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: refund
      });
    } catch (error) {
      logger.error('Process refund error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process refund',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}
export default PaymentController;