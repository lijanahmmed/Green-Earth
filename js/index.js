const cardContainer = document.getElementById("card-container");
const categoriesContainer = document.getElementById("categories-container");
const detailsContainer = document.getElementById("details-container");
const cartContainer = document.getElementById("cart-container");

let plantCarts = [];


// Load categories button
const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
};

// Load All Plants
const loadAllPlants = () => {
    fetch("https://openapi.programming-hero.com/api/plants")
        .then(res => res.json())
        .then(data => displayAllPlants(data.plants))
}

// Load Category Plants
const loadCategoryPlants = (id) => {
    manageSpinner(true);
    fetch(`https://openapi.programming-hero.com/api/category/${id}`)
        .then(res => res.json())
        .then(data => {
            removeClassList();
            const categoryBtn = document.getElementById(`category-active-${id}`);
            categoryBtn.classList.add("bg-green-800", "text-white");
            displayAllPlants(data.plants)
        })
}

// Load Plants Details
const loadPlantsDetails = (id) => {
    fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
        .then(res => res.json())
        .then(data => displayPlantsDetails(data.plants))
}

// Display Plants Details
const displayPlantsDetails = (plants) => {
    detailsContainer.innerHTML = `
            <div class="space-y-2">
                <h3 class="text-xl font-bold">${plants.name}</h3>
                <img class="h-52 lg:h-64 w-full object-cover rounded-md" src="${plants.image}" alt="">
                <p><span class="font-bold">Category : </span>${plants.category}</p>
                <p><span class="font-bold">Price : </span>৳${plants.price}</p>
                <p><span class="font-bold">Description : </span>${plants.description}</p>
            </div>
    `
    document.getElementById("plant_modal").showModal();
}

// Remove Class
const removeClassList = () => {
    const categoryButton = document.querySelectorAll(".category-btn");
    categoryButton.forEach(btn => btn.classList.remove("bg-green-800", "text-white"))
}

// Manage Spinner
const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("card-container").classList.add("hidden");
    }
    else {
        document.getElementById("spinner").classList.add("hidden");
        document.getElementById("card-container").classList.remove("hidden");
    }
}

// Display categories button
const displayCategories = (categories) => {
    categories.forEach(category => {
        const categoryBtn = document.createElement("div");
        categoryBtn.innerHTML = `
        <div id="category-active-${category.id}" onclick="loadCategoryPlants(${category.id})" class="w-full p-2 border border-gray-300 rounded-md lg:border-none cursor-pointer hover:bg-green-600 hover:text-white category-btn">
            ${category.category_name}
        </div>
        `;
        categoriesContainer.append(categoryBtn);
    })
}


// Display All Plants
const displayAllPlants = (plants) => {
    cardContainer.innerHTML = "";
    plants.forEach(plant => {
        const card = document.createElement("div")
        card.innerHTML = `
                <div class="space-y-2 bg-white p-3 rounded-lg h-full">
                    <img class="h-52 w-full object-cover rounded-md" src="${plant.image}" alt="">
                    <h3 id="${plant.id}" onclick="loadPlantsDetails(${plant.id})" class="font-bold text-lg cursor-pointer">${plant.name}</h3>
                    <p class="text-gray-700">${plant.description}</p>
                    <div class="flex justify-between items-center">
                        <p class="btn bg-green-100 text-green-800 rounded-2xl">${plant.category}</p>
                        <p class="text-lg font-bold">৳<span>${plant.price}</span></p>
                    </div>
                    <button class="btn w-full rounded-3xl text-white bg-green-700">Add to Cart</button>
                </div>
        `;
        cardContainer.append(card)
    })
    manageSpinner(false);
}

// Functionalities for Cart container
cardContainer.addEventListener("click", (e) => {
    if (e.target.innerText == "Add to Cart") {
        handleClickCart(e);
    }
})

// Create array for Cart Container
const handleClickCart = (e) => {
    const plantId = e.target.parentNode.children[1].id;
    const plantName = e.target.parentNode.children[1].innerText;
    const plantPrice = e.target.parentNode.children[3].children[1].children[0].innerText;
    alert(`${plantName} has been added to the cart`)

    plantCarts.push({
        id: plantId,
        name: plantName,
        price: plantPrice
    })
    showCart(plantCarts)
}

// Show Cart Container
const showCart = (plantCarts) => {
    cartContainer.innerHTML = "";
    let totalAmount = 0;
    plantCarts.forEach(plant => {
        cartContainer.innerHTML += `
        <div class="bg-gray-50 p-2 mb-1 flex justify-between items-center">
            <div>
                <p class="font-bold">${plant.name}</p>
                <p>৳${plant.price}</p>
            </div>
            <P onclick="removeCart(${plant.id})" class="cursor-pointer">❌</p>
        </div>
        `
        totalAmount += parseInt(`${plant.price}`);

    })
    const totalCost = document.getElementById("total-cost");
    totalCost.classList.remove("hidden")
    if(plantCarts.length == 0){
        totalCost.classList.add("hidden")
    }
    document.getElementById("total-price").innerText = totalAmount;
}

// Remove cart
const removeCart = (plantId) => {
    const filtered = plantCarts.filter(plant => plant.id !== `${plantId}`);
    plantCarts = filtered;
    showCart(plantCarts);
}


loadCategories();
loadAllPlants();