const btn = document.getElementById("btn")
const userDiv =document.getElementById("users")
btn.addEventListener("click",async()=>{

    const token = localStorage.getItem("token")

    const response = await fetch(
        "http://localhost:3000/admin",
        {
            method:"GET",
            headers:{
                    "Authorization":token
            }
        }
    )
    const users = await response.json()
    

    userDiv.innerHTML = ""
    users.forEach((user)=> {
        userDiv.innerHTML+=`
        <div id="${user._id}">
        <h1>${user.username}</h1>
        <button onClick="deleteUser('${user._id}')">Delete</button>
        <hr>
        </div>
        `
    });
})
async function deleteUser(id){
    const token = localStorage.getItem("token")

    const response = await fetch(
        `http://localhost:3000/admin/${id}`,
        {
            method:"DELETE",
            headers:{
                    "Authorization":token
            }
        }
    )
    const result = await response.json()
    alert(result.message);
    document.getElementById(id).remove()
}