import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Home from './Containers/Home';
import Account from './Containers/Account/account';
import AccountOverview from './Containers/Account/account_overview';
import Address from './Containers/Account/address';
import Profile from './Containers/Account/profile';
import Wishlist from './Containers/Account/wishlist';
import Orders from './Containers/Account/orders';
import Productlist from './Containers/Productlist';
import Productdetails from './Containers/Productdetails';
import Pages from './Containers/Pages';
import Cart from './Containers/Cart';
import Search from './Containers/Search';
import HelpandSupport from './Containers/Account/help_support';
import Aboutus from './Containers/Account/about_us';
import OrderDetails from './Containers/Account/order_details';
import Error404 from './Containers/Error/error_404';
import TagsProduct from './Containers/Tagsproducts';
import CategoryProduct from './Containers/Categoryproduct';
import Blog from './Containers/Blog';
import ContactUs from './Containers/ContactUs';
import BlogsDetails from './Containers/BlogsDetails';
import Category from './Containers/Category';
import CartCheckout from './Containers/Cart/checkout';
import CartAddress from './Containers/Cart/address';
import ChangePassword from './Containers/Account/change_password';
import Thankyou from './Containers/Cart/thankyou';
import Testimonials from './Containers/Testimonials';
import ResetPasswordLink from './Containers/ResetPasswordLink';
import Collection from './Containers/Collection';
import CancelPayment from './Containers/Cart/cancel_payment';
import Feedback from './Containers/FeedBack';
import Career from './Containers/Career';
import TrackOrder from './Containers/TrackOrder';
import MeetTheMakers from './Containers/MeetTheMakers';
import Gifting from './Containers/Gifting';
import OrderStatus from './Containers/Account/order_status';
import PartnerWithUs from './Containers/PartnerWithUs';


import Makers from './Containers/Makers';
import FAQ from './Containers/FAQ';

function App() {
  return (
    <div className="App">
       <Router>
        <Routes>
          <Route exact path='/' activeClassName="active" element={<Home />} />
 
          {/* Account Routes Section */}
          <Route path="/account" activeClassName="active" element={<Account />} />
            <Route path="/account/account-overview" activeClassName="active" element={<AccountOverview />} />
            <Route path="/account/address" activeClassName="active" element={<Address />} />
            <Route path="/account/profile" activeClassName="active" element={<Profile />} />
            <Route path="/account/wishlist" activeClassName="active" element={<Wishlist />} />
            <Route path="/account/orders" activeClassName="active" element={<Orders />} />
            <Route path="/account/help-and-support" activeClassName="active" element={<HelpandSupport />} />
            <Route path="/account/about-us" activeClassName="active" element={<Aboutus />} />
            <Route path="/account/change-password" activeClassName="active" element={<ChangePassword />} />
            <Route path="/account/order-details/:id" activeClassName="active" element={<OrderDetails />} />
            <Route path="/account/order-status/:id" activeClassName="active" element={<OrderStatus />} />
          {/* End */}
          
          <Route path="/search" activeClassName="active" element={<Search />} />
          <Route path="/feedback-form" activeClassName="active" element={<Feedback />} />
          <Route path="/career" activeClassName="active" element={<Career />} />
          <Route path="/cart" activeClassName="active" element={<Cart />} />
          <Route path="/address" activeClassName="active" element={<CartAddress />} />
          <Route path="/checkout" activeClassName="active" element={<CartCheckout />} />
          <Route path="/thankyou/:id" activeClassName="active" element={<Thankyou />} />
          <Route path="/cancel-payment" activeClassName="active" element={<CancelPayment />} />
          <Route path="/error_404" activeClassName="active" element={<Error404 />} />
          <Route path="/blogs" activeClassName="active" element={<Blog />} />
          <Route exact path='/blogs/:type/:slug' activeClassName="active" element={ <Blog /> }/>
          <Route exact path='/blogs/:slug' activeClassName="active" element={ <BlogsDetails /> }/>
          <Route path="/contact-us" activeClassName="active" element={<ContactUs />} />
          <Route path="/category" activeClassName="active" element={<Category />} />
          <Route path="/testimonials" activeClassName="active" element={<Testimonials />} />
          <Route exact path='/product/:slug' activeClassName="active" element={<Productdetails />} />
          <Route path="/track-order" activeClassName="active" element={<TrackOrder />} />
          <Route path="/meet-the-makers" activeClassName="active" element={<MeetTheMakers />} />
          <Route path="/gifting" activeClassName="active" element={<Gifting />} />   
          <Route path="/frequently-asked-questions" activeClassName="active" element={<FAQ />} />  
          <Route path="/partner-with-us" activeClassName="active" element={<PartnerWithUs />} />        


          <Route path='/makers/:slug' activeClassName="active" element={<Makers />} />
          <Route exact path='/collection/:type/:slug?' activeClassName="active" element={<Collection />} />
          <Route exact path='/category/:slug' activeClassName="active" element={<CategoryProduct />} />
          <Route exact path='/tag/:slug' activeClassName="active" element={<TagsProduct />} />
          <Route exact path='/all-products' activeClassName="active" element={<Productlist />} />
          <Route exact path='/resetpasswordlink' activeClassName="active" element={<ResetPasswordLink />} />

          <Route exact path='/:slug' activeClassName="active" element={<Pages />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
