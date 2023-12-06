import { useNavigate } from 'react-router-dom';
import {Navbar,Nav,Container, NavDropdown} from 'react-bootstrap'
import {FaShoppingCart,FaUser,FaListUl } from 'react-icons/fa';
import logo from "../assets/logo.png";
import {LinkContainer} from 'react-router-bootstrap';
import { useSelector,useDispatch} from 'react-redux';
import {useLogoutMutation} from '../slices/usersApiSlice.js';
import {logout} from '../slices/authSlice.js';

const Header = () => {
    const {userInfo}=useSelector((state)=>state.auth);
    
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const[logoutApiCall]=useLogoutMutation();

    const logoutHandler=async()=>{
        try{
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');

        }catch(err){
            console.log(err);
        }
    }
    return (
    <header>
        <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand >
                    <img src={logo} alt="FestivityFinder"/>
                        FestivityFinder
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-control="basic-navbar-nav"/>
                <Navbar.Collapse id="basic.navbar-nav">
                    <Nav className="ms-auto">
                        <LinkContainer to='/filter'>
                        <Nav.Link><FaListUl/>Filter
                        </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/filter'>
                        <Nav.Link><FaShoppingCart/>Cart
                        </Nav.Link>
                        </LinkContainer>
                        {userInfo ? (
                            <NavDropdown title={userInfo.name} id='username'>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item>Profile</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ):(
                        
                            <LinkContainer to='/login'>
                            <Nav.Link href='/login'><FaUser/>Sign in
                            </Nav.Link>
                            </LinkContainer>
                        )}
                        {userInfo && userInfo.isAdmin &&(
                            <NavDropdown title="Admin" id='adminmenu'>
                            <LinkContainer to='/admin/productlist'>
                                <NavDropdown.Item>Products</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/userlist'>
                                <NavDropdown.Item>Users</NavDropdown.Item>
                            </LinkContainer>
                            
                        </NavDropdown>
                        )}
                        
                    </Nav>
                </Navbar.Collapse>
            
            </Container>
        </Navbar>
    </header>
  )
}

export default Header