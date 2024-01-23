import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Pricing() {
    const navigate =  useNavigate();
    const makePayment = async (total) => {
        console.log("here...");
        const res = await initializeRazorpay();
    
        if (!res) {
          alert("Razorpay SDK Failed to load");
          return;
        }
    
        // Make API call to the serverless API
        const data = await axios.post("http://localhost:8080/api/razorpay",);
        //const user = JSON.parse(sessionStorage.getItem("user"));
        console.log(data);
        var options = {
          key: "rzp_test_53UwnGSa6SKvAT", // Enter the Key ID generated from the Dashboard/* process.env.RAZORPAY_KEY */
          name: "News-Bits",
          currency: data.currency,
          amount: total * 100,
          order_id: data.id,
          description: "Thankyou for your test donation",
          image: "https://manuarora.in/logo.png",
          handler: function (response) {
            // Validate payment at server - using webhooks is a better idea.
            console.log(response);
            //alert(response.razorpay_payment_id);
        
            if (response) {
                if (response.razorpay_payment_id) {
                    const proUser = JSON.parse(localStorage.getItem("proUser"));
                    console.log(proUser);
                    const record = {
                        paymentId: response.razorpay_payment_id,
                        userId: proUser._id,
                        ammount: total
                    }
                    saveRecord(record);
                }
            }

          },
          prefill: {
            name: "NewsBits",
            email: "NewsBits@gmail.com",
            contact: "9999999999",
          },
        };
        
        const saveRecord = async (record) => {
          try {
            console.log(record);
            const response = await axios.post("http://localhost:8080/api/saveOrder", record);
            console.log(response);
            if (response.data.status === "ok") {
              sessionStorage.setItem("buyingData", JSON.stringify({}));
              alert(response.data.message);
              //router.push("/");
              const proUser = JSON.parse(localStorage.getItem("proUser"));
              if (proUser) {
                proUser.isAdmin = true;
                localStorage.setItem("proUser", JSON.stringify(proUser));
                localStorage.setItem("isAdmin", "true");
              } 
              navigate("../", {replace: true})
            } else {
              alert(response.data.message);
            }
          } catch (error) {
            alert("Internal Server Error");
          }
        };
    
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      };
      const initializeRazorpay = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          // document.body.appendChild(script);
    
          script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };
    
          document.body.appendChild(script);
        });
      };
   
    return (
        <>
            <section className="bg-light text-gray-600 py-5">
                <div className="container py-5">
                    <div className="row" >
                        <div className="col-lg-12 text-center mb-5">
                            <h1 className="display-4 mb-4 text-dark">Buy Premium</h1>
                            <p className="lead">Buy Premium subscription to get access of different categories on news</p>

                        </div>
                            <div className="col-lg-3 col-md-6" >
                                <div className="card mb-4 rounded-lg border border-primary">
                                    <div className="card-body p-4">
                                        <h2 className="h6 mb-2 text-uppercase font-weight-bold">Monthly</h2>
                                        <h1 className="display-4 text-dark mb-4">
                                            <span class="font-weight-normal">Rs 50</span>
                                        </h1>
                                        <p className="text-gray-600 mb-2">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Bussiness News
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Technology News
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Science News
                                        </p>
                                        <p className="text-gray-600 mb-6">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Entertainment News
                                        </p>
                                        <button className="btn btn-primary btn-block" onClick={() => makePayment(50)}>Buy Now</button>
                                        <p className="small text-gray-600 mt-3">
And many more categories.......                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="card mb-4 rounded-lg border border-secondary">
                                    <div className="card-body p-4">
                                        <h2 className="h6 mb-2 text-uppercase font-weight-bold">Half-Yearly</h2>
                                        <h1 className="display-4 text-dark mb-4">
                                            <span class="font-weight-normal">Rs 200</span>
                                        </h1>
                                       
                                        <p className="text-gray-600 mb-2">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Technology News
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Science News
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Bussiness News
                                        </p>
                                        <p className="text-gray-600 mb-6">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Entertainment News
                                        </p>
                                        <button className="btn btn-primary btn-block" onClick={() => makePayment(200)}>Buy Now</button>
                                        <p className="small text-gray-600 mt-3">
And many more categories.......                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="card mb-4 rounded-lg border border-secondary">
                                    <div className="card-body p-4">
                                        <h2 className="h6 mb-2 text-uppercase font-weight-bold">Yearly</h2>
                                        <h1 className="display-4 text-dark mb-4">
                                            <span class="font-weight-normal">Rs 300</span>
                                        </h1>
                                       
                                        <p className="text-gray-600 mb-2">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Technology News
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Science News
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Bussiness News
                                        </p>
                                        <p className="text-gray-600 mb-6">
                                            <span className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-6 h-6" viewBox="0 0 24 24">
                                                    <path d="M20 6L9 17l-5-5" />
                                                </svg>
                                            </span>
                                            Entertainment News
                                        </p>
                                        <button className="btn btn-primary btn-block" onClick={() =>makePayment(300)}>Buy Now</button>
                                        <p className="small text-gray-600 mt-3">
And many more categories.......                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </section>

        </>
    )
}