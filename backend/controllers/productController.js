import asyncHandler from "../middleware/asyncHandler.js";
import Product from '../models/productModel.js';


//@desc Fetch all products
//@route GET/api/products
//@access Public
/*const getProducts=asyncHandler(async(req,res)=>{
    const products = await Product.find({});
    res.json(products);
});*/
const getProducts = asyncHandler(async (req, res) => {
    const budget = req.query.budget;

    let query = {};

    if (budget) {
        query.price = { $lte: budget };
    }
    // Incluye información de 'service' y 'supplierType'
    const products = await Product.find(query)
                                  .populate('service', 'type') // Asumiendo que 'service' es la referencia y 'type' es el campo que deseas incluir
                                  .populate('supplierType', 'category'); // Asumiendo que 'supplierType' es la referencia y 'category' es el campo que deseas incluir

    res.json(products);
});


//@desc Create a product
//@route POST/api/products
//@access Private/admin
const createProduct = asyncHandler(async (req, res) => {
    console.log(req.body);
    try{
        const { name, price, image, brand, category, description, service, supplierType } = req.body;

        const product = new Product({
            name: name || "Sample name",
            price: price || 0,
            user: req.user._id,
            image: image || '/images/sample.jpg',
            brand: brand || 'Sample brand',
            category: category || 'Sample category',
            description: description || 'Sample description',
            service, // Asumiendo que se envían estos datos en el cuerpo de la solicitud
            supplierType
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: error.message || "Error creating product" });
    }
    
});




//@desc Fetch all products
//@route GET/api/products/:id
//@access Public
const getProductById=asyncHandler(async(req,res)=>{
    const product= await Product.findById(req.params.id).populate('service').populate('supplierType');;

    if(product){
        res.json(product);
    }
    res.status(404);
    throw new Error('Resource not found');
});

//@desc Update product
//@route PUT/api/products
//@access Private/Admin
// Actualizar un producto
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, service, supplierType } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.service = service !== undefined ? service : product.service;
        product.supplierType = supplierType !== undefined ? supplierType : product.supplierType;
        
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});



//@desc Delete product
//@route DELETE/api/products
//@access Private/Admin
const deleteProduct=asyncHandler(async(req,res)=>{
    const product = await Product.findById(req.params.id);

    if(product){
        await Product.deleteOne({_id:product._id});
        res.status(200).json({message:'Product deleted'});

    }else{
        res.status(404);
        throw new Error('Resource not found');
    }
});

export {getProducts,getProductById,createProduct,updateProduct,deleteProduct};
