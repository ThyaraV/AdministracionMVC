import {Row,Col} from 'react-bootstrap';
import Product from '../components/Product.jsx';
import Loader from '../components/Loader.jsx';
import { useGetProductsQuery } from '../slices/productsApiSlice.js';

const HomeScreen = () => {
  const {data:products,isLoading,error}=useGetProductsQuery();

  return (
    <>
      {isLoading ? (
        <Loader/>
      ):
      (<>
        <h1>Latest Events</h1>
        <Row>
          {products && products.map((product)=>(
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product}/>
            </Col>
          ))}
        </Row>      
      </>)}
    </>
  )
}

export default HomeScreen;

