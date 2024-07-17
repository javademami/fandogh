import axios from "axios"

const BASE_URL="https://maps.googleapis.com/maps/api/place"
const API_KEY="AIzaSyBS7eF0EwWB2PJVGSVm597hfmupug-2M2Q"


const nearByPlace=(lat,lng)=>axios.get(BASE_URL+
    "/nearbysearch/json?"+
    "&location="+lat+","+lng+"&radius=1500&type=restaurant"
    +"&key="+API_KEY)


  

export default{
    nearByPlace,
    
}