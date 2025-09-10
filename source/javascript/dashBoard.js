const posts=document.querySelector(".posts");
const list=document.querySelector(".results");
const wrapper=document.querySelector(".wrapper");
const searchBar=document.querySelector("#search");
const postFile=document.querySelector("#postFile");
const friendsPage=document.querySelector("#friends");
const friendSection=document.querySelector(".friends");
const createPost=document.querySelector("#createPost");
const previewDiv=document.querySelector(".previewDiv");
const addComment=document.querySelector("#doneComment");
const userDetails=document.querySelector(".userDetails");
const userComments=document.querySelector(".userComments");
const commentButtons=document.querySelectorAll(".comment");
const uploadButton=document.querySelector("#uploadButton");
const friendsAppend=document.querySelector("#friendsAppend");
const currentUser_name=document.querySelector("#current_user");
const commentSection=document.querySelector(".comment_section");
const currentUser_Pic=document.querySelector("#currentUser_profile");
const uploadSelectedImg=document.querySelector("#uploadSelectedImg");

let token=null;
let userId=null;

window.onload=async ()=>{
   token =await localStorage.getItem("token");
   loadUser();

}
const loadUser=async()=>{
 console.log(token)
if(!token){
    window.location="loginPage.html";
    return ;
}
try{
 const response = await fetch("http://localhost:3000/api/auth/checkAuth",{
  method: "POST",
  headers: {
    Authorization: ` Bearer ${token}`, 
  }
});
const data=await response.json()

currentUser_name.textContent=data.fullName || "User";
currentUser_Pic.src=data.profilePic;
userId=data._id;
  loadPosts();
}catch(error){
 console.log("Error: ",error.message);
}

}
const loadPosts=async()=>{
 
try{

  const response=await axios.get(`http://localhost:3000/api/auth/getPosts/${userId}`)
posts.innerHTML=""
const users=(response.data).reverse();

users.forEach(post=>{

posts.innerHTML+=
`
    <div class="post">

        <div class="author_section">
            
        <div class="authorDetails">
              <img src="${post.profilePic}" alt="" id="userProfile">
              <span id="userName">${post.fullName}</span>
          </div>
          <p id="userCaption"> Lorem , deleniti est. Non illum repellat beatae, provident dolore minima </p>
        </div>
        <img src="${post.img}" alt="" id="postImage">
        <div class="counts">
<span id="likes">${post.likes.length}</span>
<span id="comments">4568 Comments</span>
        </div>
        <div class="intraction">
            <span id="like" class="like" onclick="likePost('${post._id}')">Like</span>
            <span id="comment" class="comment">Comment</span>
        </div>
    </div> `


})
}
catch(error){

console.log(error.message);
}
}

window.onclick=async()=>{
  setTimeout(() => {
    loadPosts();
    
  }, 500);


}

createPost.addEventListener("click",()=>{
    postFile.click();
    previewDiv.classList.add("hidden");

})

postFile.addEventListener("change",(e)=>{
const file=e.target.files[0];
if(file){
uploadSelectedImg.src=URL.createObjectURL(file);
}
previewDiv.classList.remove("hidden");

})

uploadButton.addEventListener("click",async()=>{
  const selectedFile = postFile.files[0];
  if (!selectedFile) {
    alert("Please select a file");
    return;
  }
  previewDiv.classList.add("hidden");
  const formData = new FormData();
  formData.append("image", selectedFile);
  const token = localStorage.getItem("token");
console.log(formData)
   try {
 const response = await fetch("http://localhost:3000/api/auth/upload-post",{
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`, 
  },
  body: formData,
}
);
const data = await response.json();
console.log(data);
        if (!data.success) 
      alert("Upload failed!");
      else {
        await loadPosts();
      }
      } catch (error) {
        console.log(error.message);
        alert("Error uploading image.");
      } 
})

userDetails.addEventListener("click",()=>{

window.location="profilePage.html";

});

commentButtons.forEach(button=>{
button.addEventListener("click",()=>{
commentSection.classList.toggle("hidden");
wrapper.classList.toggle("blur");

    })
});

commentSection.addEventListener("click",()=>{

addComment.addEventListener("click",()=>{

    const myComment=document.querySelector("#myComment").value;
    const comment=document.createElement('span');
    comment.textContent=myComment;
    userComments.appendChild(comment);
    
})
});

friendsPage.addEventListener("click",async()=>{


try{

  const response=await axios.post(`http://localhost:3000/api/friends/requests/${userId}`);
friendSection.innerHTML="";
if(response.data.length==0)
{
  alert("No friend request found");
  return;
}
friendSection.classList.toggle("hidden");
response.data.forEach(user=>{

console.log(user.status)
 friendSection.innerHTML +=
`    <div class="friendsDetails">
 
<div class="friendInfo">
    <img src="../../public/avatar.jpeg" alt="" class="friendProfilePic"> 
    <span class="friendName">${user.sender.fullName}</span>
</div>  

<div class="myResponse">
    <button class="requestAccept" onclick="acceptRequest('${user._id}')"><i class="fa-solid fa-check"></i></button>
    <button class="requestReject" onclick="rejectRequest('${user._id}')"><i class="fa-solid fa-xmark"></i></button>
</div>

    </div>
`



})


}
catch(error){
console.log(error.message)
}

});

searchBar.addEventListener("input",async ()=>{
    
    const name=document.querySelector("#search").value;
    list.innerHTML="";
    if(!name){
    list.style.display="none";
    return ;
    }
    const response=await axios.post("http://localhost:3000/api/friends/search",{name});
    const users=response.data;
    if(users.length===0){
    list.style.display="none";
    return ;
}


list.innerHTML="";
users.forEach(user=>{
   
const SearchedUserInfo=document.createElement("div");
SearchedUserInfo.innerHTML=`
<div class="searchedUserDetails">
<img src="../../public/avatar.jpeg" id="searchedUserProfile">
<span id="searchedUserName">${user.fullName}</span>
</div>
<button id="addFriend" onclick="sendFriendRequest('${user._id}')">Add Friend</button>`;
SearchedUserInfo.classList.add("SearchedUserInfo");

list.appendChild(SearchedUserInfo);

});
list.style.display="block";
});

const sendFriendRequest= async(receiverId)=> {
const senderId=userId;

try{
    const response=await axios.post("http://localhost:3000/api/friends/sendRequest",
        {
            senderId,
            receiverId
        }
    );
alert(response.data.message);
}
catch(error){
  alert(error?.response.data.message);
console.log(error?.response.data.message);
}
}

const acceptRequest=async(requestId)=>{


try{
  const response=await fetch(`http://localhost:3000/api/friends/accept`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({requestId})
  });

const data=await response.json();
console.log(data);
alert(data.message);


}
catch(error){
  console.log(error.message);
}

}

const rejectRequest=async(requestId)=>{
try{
const response=await fetch(`http://localhost:3000/api/friends/reject`,
{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({requestId})
  }
)
const data=await response.json();
console.log(data.message);
}
catch(error){
  console.log(error.message);
}


}

const appendFriends=async()=>{
friendSection.classList.toggle("hidden");
  try{
const response=await fetch(`http://localhost:3000/api/friends/list/${userId}`,{
  method:"POST"}
);
const friends=await response.json();

friendSection.innerHTML="";
friends.forEach(friend=>{
  friendSection.innerHTML +=
`    <div class="friendsDetails">
<div class="friendInfo">
    <img src="${friend.sender.profilePic}" alt="" class="friendProfilePic"> 
    <span class="friendName">${friend.sender.fullName}</span>
</div>  
    </div>
`

})



  }
  catch(error){
    console.log(error.message);
  }

}

friendsAppend.addEventListener("click",()=>{

  appendFriends();
})

const likePost=async (postId)=>{


  try{
const response=await axios.post("http://localhost:3000/api/auth/likePost",{
  postId,
  userId
})

updateLike(response.data.success);
  }catch(error){

    console.log(error.message);
  }

}
