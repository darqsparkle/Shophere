import React, { createContext, useState,useEffect } from "react";


export const ShopContext =  createContext(null);



const ShopContextProvider = (props) => {

  const getDefaultCart = ()=>{
    let cart = {};
    for (let index = 0; index < 300+1; index++) {
        cart[index] = 0;
    }
    return cart;
}

    const [cartItems,setCartItems] = useState(getDefaultCart());
    const [all_product,setAll_Product]=useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/allproducts') 
              .then((res) => res.json()) 
              .then((data) => setAll_Product(data))
    
              if(localStorage.getItem("auth-token"))
                {
                  fetch('http://localhost:4000/getcart', {
                  method: 'POST',
                  headers: {
                    Accept:'application/form-data',
                    'auth-token':`${localStorage.getItem("auth-token")}`,
                    'Content-Type':'application/json',
                  },
                  body: JSON.stringify(),
                })
                  .then((resp) => resp.json())
                  .then((data) => {setCartItems(data)});
                }
    
    }, [])
    
    // const addToCart = (itemId) => {
    //   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    //   if(localStorage.getItem("auth-token"))
    //   {
    //     fetch('http://localhost:4000/addtocart', {
    //     method: 'POST',
    //     headers: {
    //       Accept:'application/form-data',
    //       'auth-token':`${localStorage.getItem("auth-token")}`,
    //       'Content-Type':'application/json',
    //     },
    //     body: JSON.stringify({"itemId":itemId}),
    //   })
    //     .then((resp) => resp.json())
    //     .then((data) => {console.log(data)});
    //   }
    // };

    const addToCart = (itemId) => {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
      if (localStorage.getItem("auth-token")) {
        fetch('http://localhost:4000/addtocart', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'auth-token': `${localStorage.getItem("auth-token")}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemId: itemId }),
        })
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Failed to add item to cart");
          }
          // Check if response is JSON
          const contentType = resp.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return resp.json(); // Parse JSON response
          } else {
            return resp.text(); // Treat response as plain text
          }
        })
        .then((data) => {
          console.log(data); // Log the response from the server
          // Handle the response as needed
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle any errors that occur during the fetch request
        });
      }
    };
    

    const removeFromCart = (itemId) =>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
    }
    
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
          if (cartItems[item] > 0) {
            let itemInfo = all_product.find((product) => product.id === Number(item));
            totalAmount += cartItems[item] * itemInfo.new_price;
          }
        }
        return totalAmount;
      }

      const getTotalCartItems = () =>{
        let totalItem = 0;
        for(const item in cartItems)
        {
            if(cartItems[item]>0)
            {
                totalItem+= cartItems[item];
            }
        }
        return totalItem;
      }

    const contextValue = {getTotalCartItems,getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart};
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;