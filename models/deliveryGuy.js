

import mongoose from "mongoose";



const DeliveryGuySchema = new mongoose.Schema ({

   
     name : {
        type : String,
        required : true,
        unique : true
     },
     truckModel : {
        type : String, 
        required : false
     },
      productsOwned: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // references the Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        

      },
    ],

      
      
},

{
    timestamps : true

})

const DeliveryGuy = mongoose.model("deliveryGuy",DeliveryGuySchema);
export default DeliveryGuy;