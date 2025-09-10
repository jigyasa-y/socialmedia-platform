const submitButton=document.querySelector("#login");
submitButton.addEventListener("click",async (event)=>{
  event.preventDefault();

  const fullName=document.querySelector("#name").value;
  const email=document.querySelector("#email").value;
  const password=document.querySelector("#password").value;

  try{
const response=await axios.post("http://localhost:3000/api/auth/signup",
  {
    fullName,
    email,
    password
  });
showToast(response.data.message,"success");
  }
  catch(error){
      showToast(error.response?.data?.message || error.message,"error");

  }
});