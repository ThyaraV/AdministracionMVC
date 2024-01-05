import asyncHandler from "../middleware/asyncHandler.js";
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Supplier from '../models/supplierModel.js';
import SupplierType from '../models/supplierTypeModel.js';

export const getRecommendations = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const likedCategories = new Set();
    const usedProductIds = new Set();
    const recommendedProducts = new Set();
    const supplierRatings = new Map();

    // Obtener todos los productos de los pedidos anteriores y sus SupplierTypes
    const orders = await Order.find({ user: userId }).populate({
        path: 'orderItems.product',
        populate: { path: 'supplierType' }
    });

    // Analizar los pedidos para encontrar SupplierTypes que el usuario ha calificado positivamente
    orders.forEach(order => {
        order.orderItems.forEach(item => {
            usedProductIds.add(item.product._id.toString());
            const positiveReviews = item.product.reviews.filter(review => review.user.toString() === userId.toString() && review.rating >= 4);
            if (positiveReviews.length > 0) {
                likedCategories.add(item.product.supplierType.category);
            }
        });
    });

    // Obtén los IDs de SupplierType que coincidan con las categorías
    const supplierTypes = await SupplierType.find({
        category: { $in: [...likedCategories] }
    });

    const supplierTypeIds = supplierTypes.map(st => st._id);

    // Busca los productos que tengan un supplierType en ese conjunto de IDs y que no hayan sido pedidos antes
    const productsInLikedCategories = await Product.find({
        supplierType: { $in: supplierTypeIds },
        _id: { $nin: [...usedProductIds] }
    }).populate('supplierType').populate('reviews');

    const filteredProductsInLikedCategories = productsInLikedCategories.filter(product => {
        const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;
        return averageRating >= 3;
    });

    filteredProductsInLikedCategories.forEach(product => {
        recommendedProducts.add(product);
    });

    // Buscar proveedores asociados con los SupplierTypes encontrados y agrupar sus calificaciones
    for (const supplierType of supplierTypes) {
        const suppliers = await Supplier.find({
            supplierType: supplierType._id,
            ratings: { $gte: 5 }
        });

        suppliers.forEach(supplier => {
            const supplierId = supplier._id.toString();
            const existingSupplier = supplierRatings.get(supplierId);
            if (existingSupplier) {
                // Si el proveedor ya existe, agregamos la nueva categoría con su rating
                existingSupplier.categories.push({ name: supplierType.category, rating: supplier.ratings });
            } else {
                // Si es la primera vez que encontramos al proveedor, lo agregamos al mapa
                supplierRatings.set(supplierId, {
                    ...supplier.toObject(),
                    categories: [{ name: supplierType.category, rating: supplier.ratings }]
                });
            }
        });
    }

    // Convertir los sets y mapas en arrays para la respuesta
    const recommendations = {
        products: Array.from(recommendedProducts),
        suppliers: Array.from(supplierRatings.values()).map(supplier => ({
            ...supplier,
            // Calculamos el rating promedio de las categorías
            rating: supplier.categories.reduce((acc, cat) => acc + cat.rating, 0) / supplier.categories.length,
            // Unimos los nombres de las categorías y sus ratings en la descripción
            description: supplier.categories.map(cat => `${cat.name}: ${cat.rating} stars`).join(', ')
        }))
    };

    res.json(recommendations);
});