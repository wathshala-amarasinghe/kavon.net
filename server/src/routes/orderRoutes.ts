import express from 'express';
import { 
    addOrderItems, 
    getMyOrders, 
    getOrderById, 
    updateOrderToPaid, 
    updateOrderToDelivered, 
    updateOrderStatus,
    getOrders, 
    getOrderForTracking,
    updateOrderTracking
} from '../controllers/orderController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, admin, getOrders);
router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.get('/track/:id', getOrderForTracking);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, admin, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/tracking', protect, admin, updateOrderTracking);

export default router;
