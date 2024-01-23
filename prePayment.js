import AddAddressForm from "@/components/Address";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { useRouter } from "next/router";

export default function PrePayment() {
  const [prePaymentData, setPrePaymentData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addAddress, setAddAddress] = useState(false);
  const [counter, setCounter] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // Create an asynchronous function
      try {
        const buyingData = JSON.parse(sessionStorage.getItem("buyingData"));
        const user = JSON.parse(sessionStorage.getItem("user"));
        const { email } = user;
        const response = await axios.post("/api/getAddress", { email });

        if (response.data.status === "ok") {
          //console.log(response);
          const userAddress = response.data.userAddress;
          const data = [buyingData, user, userAddress];
          setPrePaymentData(data);
        } else {
          setPrePaymentData([]);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchData(); // Call the asynchronous function immediately
  }, [counter]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  if (!prePaymentData) {
    return <h1>Error</h1>;
  }
  // console.log(prePaymentData);

  const makePayment = async () => {
    console.log("here...");
    const res = await initializeRazorpay();

    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }

    // Make API call to the serverless API
    const data = await axios.post("/api/razorpay", { prePaymentData });
    //const user = JSON.parse(sessionStorage.getItem("user"));
    console.log(data);
    var options = {
      key: "rzp_test_TZTV3OMyHAZGrU", // Enter the Key ID generated from the Dashboard/* process.env.RAZORPAY_KEY */
      name: "Art Relics Pvt Ltd",
      currency: data.currency,
      amount: total * 10,
      order_id: data.id,
      description: "Thankyou for your test donation",
      image: "https://manuarora.in/logo.png",
      handler: function (response) {
        // Validate payment at server - using webhooks is a better idea.
        console.log(response);
        //alert(response.razorpay_payment_id);
        if (response) {
          const user = JSON.parse(sessionStorage.getItem("user"));
          console.log(selectedAddress);
          let productQuantityList = prePaymentData[0].cartList.map((item) => {
            return {
              productId: item.product._id,
              quantity: item.quantity,
            };
          });
          const record = {
            userId: user._id,
            product: productQuantityList,
            addressId: selectedAddress,
            paymentId: response.razorpay_payment_id,
            total: total,
          };
          saveRecord(record);
          //console.log(record);
        }
      },
      prefill: {
        name: "News-Bits",
        email: "NewsBits@gmail.com",
        contact: "9999999999",
      },
    };

    const saveRecord = async (record) => {
      try {
        console.log(record);
        const response = await axios.post("/api/saveOrder", record);
        if (response.data.status === "ok") {
          sessionStorage.setItem("buyingData", JSON.stringify({}));
          localStorage.setItem("isAdmin", true);
          alert(response.data.message);
          router.push("/");
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
  let total;
  if (prePaymentData && prePaymentData[0] && prePaymentData[0].cartList)
    total = prePaymentData[0].cartList.reduce(
      (total, item) => total + item.quantity * item.product.productPrice,
      0
    );
  return (
    <>
      <Navbar />
      <div className="flex w-full justify-between items-center">
        <div className="prepayment-steps rounded border min-w-[50%] max-w-[55%] mx-auto p-4">
          <h3 className="text-2xl font-semibold mb-4">
            Select Delivery Address
          </h3>
          <div className="w-full space-y-4">
            {prePaymentData && prePaymentData[2] ? (
              <div>
                {prePaymentData[2].map((item, id) => (
                  <div
                    key={id}
                    className={`border p-4 text-xs ${
                      item.id === selectedAddress
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <label className="flex  items-center space-x-2">
                      <input
                        type="radio"
                        name="address"
                        value={item._id}
                        required
                        checked={item._id === selectedAddress}
                        onChange={() => handleAddressSelect(item._id)}
                        className="text-blue-500"
                      />
                      <span>{item.addressLine1}</span>
                    </label>
                    <p>{item.addressLine2}</p>
                    <p>
                      {item.city}, {item.postalCode}, {item.region}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No user address data available.</p>
            )}
            <button onClick={() => setAddAddress((prev) => !prev)}>
              Add new Address &#43;
            </button>
          </div>
          {addAddress && (
            <AddAddressForm signup="false" setCounter={setCounter} />
          )}
          <div className="bg-gradient-to-r from-[#3e4044] to-[#1D2328] p-[1px] rounded-md mb-4">
            <button
              onClick={makePayment}
              className="bg-gradient-to-r from-[#2E3137] to-[#1D2328] rounded-md w-full py-4 shadow-xl drop-shadow-2xl text-gray-300 font-bold"
            >
              Purchase Now!
            </button>
          </div>
          <p className="w-[60%] text-xs">
            Need help? Check our help pages or contact us
            </p>
            <br/> 
            <p className="w-[60%]  text-xs">When your order is
            placed, we'll send you an e-mail message acknowledging receipt of
            your order. If you choose to pay using an electronic payment method
            (credit card, debit card or net banking), you will be directed to
            your bank's website to complete your payment. Your contract to
            purchase an item will not be complete until we receive your
            electronic payment and dispatch your item. If you choose to pay
            using Pay on Delivery (POD), you can pay using cash/card/net banking
            when you receive your item.</p>
            <p className="w-[60%] text-xs"> See Our Return Policy</p>
        </div>
        <div className="prepayment-steps rounded border min-w-[40%] mx-auto p-4">
          <h3 className="text-2xl font-semibold">Order Summary</h3>
          <hr className="w-[98%] bg-[#d5d5d5] h-1 mx-auto" />
          <div className="flex w-full justify-between items-center">
            <div className="min-w-[200px]">Item</div>
            <div className="flex justify-between items-center">
              <div className="mr-4">Price</div>
              <div>Quantity</div>
            </div>
          </div>
          {prePaymentData && prePaymentData[0] && prePaymentData[0].cartList ? (
            <>
              {prePaymentData[0].cartList.map((item, index) => (
                <div
                  key={index}
                  className="flex text-sm mb-2 w-full justify-between items-center"
                >
                  <div className="max-w-[200px]">
                    {item.product.productName}
                  </div>
                  <div className="flex justify-between min-w-[110px] items-center">
                    <div className="mr-4">{item.product.productPrice}</div>
                    <div>{item.quantity}</div>
                  </div>
                </div>
              ))}
              <hr className="w-[98%] bg-[#d5d5d5] h-1 mx-auto" />
              <div className="flex w-full justify-between items-center">
                <div className="max-w-[200px]">Total</div>
                <div className="flex justify-between items-center min-w-[110px]">
                  <div className="mr-4">{total}</div>
                  <div>
                    {prePaymentData[0].cartList.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>No items in Cart</p>
          )}
        </div>
      </div>
    </>
  );
}
