import React from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import Accordion from "react-bootstrap/Accordion";


function FAQ() {



  return (
    <> 
    <Header/>
    <section className="section-gap-medium">
  <div className="container">
  <div className="row">
  <div className="col-lg-12">

<div className='mb-5'>
<p>heartswithfingers is a platform dedicated to all the hardworking women artisans and farmers across India striving for a better tomorrow. It is our commitment to bring you a mindfully curated selection of artisanal and handcrafted products, providing a convenient one-stop destination for those seeking unique, authentic and high-quality products created with craftsmanship and care.</p>

<p>Apart from allowing our consumers to make socially conscious and responsible buying decisions, our focus is on positively impacting women’s livelihoods. Check our FAQ section to learn more about heartswithfingers and how we work</p>
<p className='text-hover'>If your question isn’t answered here, feel free to write to us at <a href= "mailto: mombatti@gmail.com">mombatti@gmail.com</a></p>
</div>
<div className='mb-5'>
<h5 className='mb-3'>WHAT WE STAND FOR </h5>

    <Accordion >
    <Accordion.Item eventKey="0" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">We’re a transparent ecosystem of Impact brands </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           
                            <p>We are a sisterhood of women-led micro-enterprises striving for a better future for women artisans and small farmers across India. We showcase high-quality local, handcrafted and sustainable products that can be easily traced back to their makers. You can find out more about how your products were made in our Meet the Makers  section of our website.</p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">We symbolise all things handcrafted with love </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                          
                         <p>Inspired by the Korean finger heart, the heartswithfingers gesture of joining the thumb and index finger to make a heart is a way of connecting with these women and showing support for their hard work and resilience. </p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">We’re for women's empowerment & conscious shopping </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           <p>We all know that mass produced goods come cheap but at a high social and environmental cost. This is where we step in. We support small scale enterprises and brands that promote sustainable livelihoods and the empowerment of rural women, while allowing consumers to make informed, ethical, and sustainable choices while shopping.</p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">Shop to make a difference  </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           <p>The simplest way to become part of the heartswithfingers family is by shopping with us and sharing your experience on Instagram by leaving us a heart. Every time you buy a HwF product, you are pledging your support for a sisterhood of skilled artisans and farmers in pursuit of a better tomorrow. </p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>
             
                  </Accordion>

                  </div>

                  <div>
<h5 className='mb-3'>HOW WE WORK  </h5>

    <Accordion >
    <Accordion.Item eventKey="0" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">How do I track my order? </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           
                            <p>Tracking details will be shared in an email with you as soon as your order has been shipped.</p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">How does hearstwithfingers process orders? Why is the delivery time different for different products?</h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                          
                         <p>heartwithfingers works with many different enterprises all over the country. The items are all stored in different locations. Please check the shipping information tab on the product page to know how long it will take for it to reach you.</p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">How do I know if my product is eligible for return?  </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           <p>Please check the product page for every product where the shipping and returns terms are clearly stated. We do not accept returns of perishables, food products and personal care products. For other products, please refer to our Shipping & Return Policy </p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">Do I have to pay for shipping? </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           <p>We offer free shipping on all orders above Rs. 1500. For orders below this, we charge a standard shipping rate of Rs.100 </p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="4" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">How do I return or exchange a product? </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           <p>Please check the product page to see if your product  qualifies for a return. If yes, you can write to us at support@heartswithfingers.com requesting a return or exchange within 48 hours of receiving the product. Please make sure that the packaging and labels are intact. We will organise a pick up for you accordingly.</p>
                         </div>
                      </Accordion.Body>

                    </Accordion.Item>

                    <Accordion.Item eventKey="5" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">What if I receive a damaged or wrong product? </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           <p>In the unlikely event of receiving damaged or wrong product, please write to support@heartswithfingers.com with a picture of the product within 48 hours of receiving it, so that we can verify and process a refund or replacement. </p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="6" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">How can I cancel my order? </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           <p>Cancellation requests will only be accepted strictly within 24 hours of placing the order as we cannot cancel a shipment that has already been dispatched.You can initiate a return or exchange only within 10 calendar days of placing an order.</p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="7" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">Where do you ship your products? </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           <p>We intend to service customers all over India, however we are currently operating only within Rajasthan and Delhi NCR.</p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="8" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">What are the accepted payment methods? </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           <p>We accept all modes of payment, including Paytm, credit card, debit card, cash on delivery/net banking.</p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="9" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">Can I return only part of my order </h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           <p>Yes, you can return individual items from a larger order. However please note, all our sellers are located in different locations. Therefore if your order contains items from multiple/different sellers, please match the return tracking ID carefully at the time of pick up.</p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="10" className="checkout-accord">
                      <Accordion.Header>
                        <h6 className="mb-0 tx-14">How do I share feedback?</h6>
                      </Accordion.Header>
                      <Accordion.Body>
                         <div className="order-notetextarea">
                           <p>We would love to hear about your experience. You can fll out the Feedback Form on our website. Our MeettheMakers  page allows you to connect with our women artisans directly and ‘send a heart’ of appreciation. Alternatively, you can leave us a review on our website, google or on Instagram.</p>
                         </div>
                      </Accordion.Body>
                    </Accordion.Item>

                  </Accordion>

                  </div>


                  </div>
                  </div>
                  </div>
                  </section>
    <Footer/>
    </>

  )
}

export default FAQ