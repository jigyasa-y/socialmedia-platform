    const bio=document.querySelector("#bio");
    const p_name=document.querySelector("#profileName");
    const edit_button=document.querySelector('#edit');
    const edit_menu=document.querySelector(".edit_menu");
    const change_button=document.querySelector("#change_button");
    const currentPic=document.querySelector("#currentPic");
    const email=document.querySelector("#userName");
    
window.onload=async()=>{  //This function see properly

const token=localStorage.getItem("token");
if(!token){
  window.location="loginPage.html";
  return ;
}

 const response = await fetch("http://localhost:3000/api/auth/checkAuth",{
  method: "POST",
  headers: {
    Authorization: ` Bearer ${token}`, 
  }
});
const data=await response.json();
// const res=await axios.post("http://localhost:3000/api/auth/checkAuth",{token});


  currentPic.src=data.profilePic?data.profilePic:"../../public/avatar.jpeg";
  p_name.textContent=data.fullName;
  email.textContent=`Email: ${data.email}`;



}
   edit_button.addEventListener('click',()=>{
    edit_menu.classList.toggle("hidden");

})

change_button.addEventListener('click', async (event)=>{
  event.preventDefault();
edit_menu.classList.add('hidden');
  const fileInput = document.querySelector("#fileInput");
  const selectedFile = fileInput.files[0];

  if (!selectedFile) {
    alert("Please select a file");
    return;
  }

  const formData = new FormData();
  formData.append("image", selectedFile);
  const token = localStorage.getItem("token");

   try {
 const response = await fetch("http://localhost:3000/api/auth/profile-update",{
  method: "POST",
  headers: {
    Authorization: ` Bearer ${token}`, 
  },
  body: formData,
}
);
    
   const data = await response.json();
   console.log(data);
        if (!data.success) 
      alert("Upload failed!");
    currentPic.src=data.link;
      } catch (error) {
        console.error(error);
        alert("Error uploading image.");
      } 



  });