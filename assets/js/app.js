let cl = console.log;

const productForm = document.getElementById('productForm');
const productModal = document.getElementById('productModal');
const addProductModal = document.getElementById('addProductModal');
const backdrop = document.getElementById('backdrop');
const closeModal = [...document.getElementsByClassName('closeModal')]
const loader = document.getElementById('loader');
const title = document.getElementById('title')
const imageUrl = document.getElementById('imageUrl')
const rating = document.getElementById('rating')
const description = document.getElementById('description')
const productStatus = document.getElementById('status')
const addBtn = document.getElementById('addBtn')
const updateBtn = document.getElementById('updateBtn')
const cancelbtn = document.getElementById('cancelbtn')

const baseUrl = `https://productmodal-mt-default-rtdb.asia-southeast1.firebasedatabase.app`
const productUrl = `${baseUrl}/productModal.json`

const loadertoggle = () => {
    loader.classList.toggle('d-none')
}

const snackBar = (msg , icon , timer) => {
    swal.fire({
        title : msg,
        icon : icon ,
        timer : timer 
    })
}

const objToArr = (obj) => {
    let productArr = [];
    for (const key in obj) {
         productArr.push({...obj[key] , id : key})
        }
        // cl(productArr)
        return productArr;
    }

const templating = (arr) => {
    productContainer.innerHTML = arr.map(obj => {
        return ` 
        <div class="col-md-4">
            <div class="card mb-4">
           <figure class="productCard" id="${obj.id}">
              <img src="${obj.imageUrl}"
               alt="${obj.title}">
               <figcaption>
                <div class="statusSection">
                    <div class="row">
                    <div class="col-md-10 col-sm-10 col-xs-10">
                        <h3>${obj.title}</h3>
                        <span>${obj.status}</span>
                    </div>
                    <div class="col-md-2 col-sm-2 col-xs-2">
                    ${obj.rating > 5 ? `<p class="text-success"></p>` : obj.rating >= 2 && obj.rating <= 3?
                   `<p class="text-warning">${obj.rating}</p>` : `<p class="text-danger">${obj.rating} </p>`}
                    </div>
                    </div>
                </div>
                <div class="discriptionSection">
                    <h4>${obj.title}</h4>
                    <em>Discription</em>
                    <p>${obj.description}</p>
                    <div class="buttons">
                        <button type="button" class="btn btn-primary" onclick="onEdit(this)">Edit</button>
                        <button type="button" class="btn btn-danger" onclick="onDelete(this)">Delete</button>
                    </div>
                </div>
               </figcaption>
           </figure>
        </div>
    </div>
                `
    }).join('')
}    

const makeAPIcall = async (apiUrl , methodName , msgbody = null) => {
    loadertoggle()
   try{
    msgbody = msgbody ? JSON.stringify(msgbody) : null 
      let res = await fetch(apiUrl , {
        method : methodName,
        body : msgbody
      })
      return res.json()
    }
    catch(err){
        cl(err)
    }finally{
        loadertoggle()
    }
}

const fetchProduct = async () => {
    try{
       let data = await makeAPIcall(productUrl , 'GET')
      // objToArr   
      let productArr = objToArr(data)
    //   templating
     templating(productArr.reverse())
    }catch(err){cl}
    finally{cl}
}
fetchProduct()

const onEdit = async (ele) => {
    let editId = ele.closest('.productCard').id;
    localStorage.setItem('editId', editId)
    let editUrl = `${baseUrl}/productModal/${editId}.json`
    let res = await makeAPIcall(editUrl , 'GET' )
    cl(res)
    title.value = res.title;
    imageUrl.value = res.imageUrl;
    rating.value  = res.rating;
    description.value = res.description;
    productStatus.value = res.status;

    if(editId === editId){
    addBtn.classList.add('d-none')
    updateBtn.classList.remove('d-none')
    onshowhideModal()
    }else{
        onCancel
    }
}

const onCancel = () => {
    productForm.reset()
    addBtn.classList.remove('d-none')
    updateBtn.classList.add('d-none')
}

const createUpdatedCard = (obj) => {
    let card = [...document.getElementById(obj.id).children]
    card.id = obj.id
    card[0].innerHTML = `
    <figure class="productCard" id="${obj.id}">
    <img src="${obj.imageUrl}"
     alt="${obj.title}">
                 `
    card[1].innerHTML = `
    <figcaption>
    <div class="statusSection">
        <div class="row">
        <div class="col-md-10 col-sm-10 col-xs-10">
            <h3>${obj.title}</h3>
            <span>${obj.status}</span>
        </div>
        <div class="col-md-2 col-sm-2 col-xs-2">
        ${obj.rating > 5 ? `<p class="text-success"></p>` : obj.rating >= 2 && obj.rating <= 3?
        `<p class="text-warning">${obj.rating}</p>` : `<p class="text-danger">${obj.rating} </p>`}
        </div>
        </div>
    </div>
    <div class="discriptionSection">
        <h4>${obj.title}</h4>
        <em>Discription</em>
        <p>${obj.description}</p>
        <div class="buttons">
            <button type="button" class="btn btn-primary" onclick="onEdit(this)">Edit</button>
            <button type="button" class="btn btn-danger" onclick="onDelete(this)">Delete</button>
        </div>
    </div>
   </figcaption>
</figure>
                        `      
}

const onUpdatePost = async () => {
    try{
    let updateId = localStorage.getItem('editId')
    let updateUrl = `${baseUrl}/productModal/${updateId}.json`
    let updatedObj = {
        title : title.value,
        imageUrl : imageUrl.value,
        rating : rating.value,
        description : description.value,
        status : productStatus.value,
        id : updateId
    }
        let data = await makeAPIcall(updateUrl , 'PATCH', updatedObj)
         createUpdatedCard(updatedObj)
        addBtn.classList.remove('d-none')
        updateBtn.classList.add('d-none')
        snackBar('new product is updated successfully !!!' , "success" , 2000)

}   
    catch(err){ snackBar('err' , 'error' , 1500)}
    finally{
        productForm.reset()
        onshowhideModal()
    }
}
 
const createCard = (obj) => {
    let card = document.createElement('div')
    card.className = 'card mb-4'
    card.innerHTML = `
    <figure class="productCard" id="${obj.id}">
    <img src="${obj.imageUrl}"
     alt="${obj.title}">
     <figcaption>
      <div class="statusSection">
          <div class="row">
          <div class="col-md-10 col-sm-10 col-xs-10">
              <h3>${obj.title}</h3>
              <span>${obj.status}</span>
          </div>
          <div class="col-md-2 col-sm-2 col-xs-2">
          ${obj.rating > 5 ? `<p class="text-success"></p>` : obj.rating >= 2 && obj.rating <= 3?
          `<p class="text-warning">${obj.rating}</p>` : `<p class="text-danger">${obj.rating} </p>`}
          </div>
          </div>
      </div>
      <div class="discriptionSection">
          <h4>${obj.title}</h4>
          <em>Discription</em>
          <p>${obj.description}</p>
          <div class="buttons">
              <button type="button" class="btn btn-primary" onclick="onEdit(this)">Edit</button>
              <button type="button" class="btn btn-danger" onclick="onDelete(this)">Delete</button>
          </div>
      </div>
     </figcaption>
 </figure>
                    `
   
           productContainer.prepend(card)
}

const onDelete = async (ele) => {
    let deleteId = ele.closest('.productCard').id
    cl(deleteId)
    let deleteUrl = `${baseUrl}/productModal/${deleteId}.json`
    try{
      let res = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
                makeAPIcall(deleteUrl , 'DELETE' )
                document.getElementById(deleteId).remove()
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
            }
          });
    }catch(err){ snackBar('err' , 'error' , 1500)}
    finally{cl}
}

const onAddproduct = async (e) => {
     e.preventDefault()
     let productObj ={
        title : title.value,
        imageUrl : imageUrl.value,
        rating : rating.value,
        description : description.value,
        status : productStatus.value
     }
    try{
        let res = await makeAPIcall(productUrl , 'POST' , productObj)
        productObj.id = res.name
        cl(res)
        createCard(productObj)
        snackBar('new product is added successfully !!!' , "success" , 2000)
    }catch(err){
        snackBar('err' , 'error' , 1500)
    }
    finally{
        productForm.reset()
        onshowhideModal()
    }
}

const onshowhideModal = () => {
    productModal.classList.toggle('active')
    backdrop.classList.toggle('active')
}
 
productForm.addEventListener('submit' , onAddproduct)
addProductModal.addEventListener('click' , onshowhideModal)
closeModal.forEach(hideall => {
    hideall.addEventListener('click' , onshowhideModal)
})
updateBtn.addEventListener('click' , onUpdatePost)
cancelbtn.addEventListener('click' , onCancel)