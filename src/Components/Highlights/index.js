import { BrowserView, MobileView } from "react-device-detect";

export default function Highlight(){

    return (
        <>
            <BrowserView>
                
                <div className="highlight">
                    <div className="highlight-item">
                        <div className="highlight-item-image">
                            <i className="fa fa-tree"></i>
                        </div>
                        <div className="highlight-item-text">
                        <div className="highlight-item-heading">
                            <span>100% organic and toxic free</span>
                        </div>
                        <div className="highlight-item-subtitle">
                            <span>Our products are made up of soy wax</span>
                        </div>
                        </div>
                    </div>
                    <div className=" highlight-item">
                        <div className="highlight-item-image">
                            <i className="fas fa-heart"></i>
                        </div>
                        <div className="highlight-item-text">
                        <div className="highlight-item-heading">
                            <span>Handmade with love</span>
                        </div>
                        <div className="highlight-item-subtitle">
                            <span>Our products are made up of soy wax</span>
                        </div>
                        </div>
                    </div>
                    <div className=" highlight-item">
                        <div className="highlight-item-image">
                            <i className="fas fa-truck"></i>
                        </div>
                        <div className="highlight-item-text">
                        <div className="highlight-item-heading">
                            <span>Free shipping and delivery</span>
                        </div>
                        <div className="highlight-item-subtitle">
                            <span>On all orders above 1500 all over India</span>
                        </div>
                        </div>
                    </div>
                </div>
            </BrowserView>
            <MobileView>
            <div className="highlight">
                    <div className="highlight-item">
                        <div className="highlight-item-image">
                            <i className="fa fa-tree"></i>
                        </div>
                        <div className="highlight-item-text">
                        <div className="highlight-item-heading">
                            <span>100% organic and toxic free</span>
                        </div>
                        <div className="highlight-item-subtitle">
                            <span>Our products are made up of soy wax</span>
                        </div>
                        </div>
                    </div>
                    <div className=" highlight-item">
                        <div className="highlight-item-image">
                            <i className="fas fa-heart"></i>
                        </div>
                        <div className="highlight-item-text">
                        <div className="highlight-item-heading">
                            <span>Handmade with love</span>
                        </div>
                        <div className="highlight-item-subtitle">
                            <span>Our products are made up of soy wax</span>
                        </div>
                        </div>
                    </div>
                    <div className=" highlight-item">
                        <div className="highlight-item-image">
                            <i className="fas fa-truck"></i>
                        </div>
                        <div className="highlight-item-text">
                        <div className="highlight-item-heading">
                            <span>Free shipping and delivery</span>
                        </div>
                        <div className="highlight-item-subtitle">
                            <span>On all orders above 1500 all over India</span>
                        </div>
                        </div>
                    </div>
                </div>
            </MobileView>
        </>
    )
}