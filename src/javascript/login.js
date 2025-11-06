const loginButton=document.querySelector("#loginButton");

loginButton.addEventListener("click",async(event)=>{
event.preventDefault();
 
const email=document.querySelector("#email").value;
const password=document.querySelector("#password").value;
try{
const response=await axios.post("https://socialmedia-platform-server.onrender.com/api/auth/login",
    {
        email,
        password
    }
);

localStorage.setItem("token", response.data.token);
   console.log(response.data.token);
   await showToast(response.data.message,"success");

   window.location='dashBoard.html';

}
catch(error){
    showToast(error.response?.data?.message || error.message,"error");
}
})


