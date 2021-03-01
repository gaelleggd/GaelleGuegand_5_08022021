// ////////// Caractéristiques d'un produit, id + lentille //////////
class Product {
    constructor(id, lenseSelected) {
        this.lenses = lenseSelected;
        this.id = id;
    }
}

// // // ////////// Récuprérer l'id dans l'URL //////////
function getUrlId(){
    let urlId = new URLSearchParams(document.location.search.substring(1)).get("id");
    return urlId
};

////////// Appeler la fonction de récupération de l'API par ID et implémenter la page HTML //////////

function getCamera(url) {
    fetch(url)
    .then ((res) => res.json())
    .then ((data) => {
        let place2 = '<div></div>';
        place2 += `
            <div class="col-12 col-md-5 mx-auto">
                <div class="card shadow mb-5">
                    <a href="Produit.html?id=${data._id}">
                    <img class="card-img-top" src="${data.imageUrl}"></>
                    </a>
                    <div class ="card-body">
                    <h3 class="card-title">${data.name}</h3>
                    <p class="card-text">${data.description}</p>
                    <select id="select">
                    </select>
                    <p class="card-text">${data.price/100} €</p>
                    <button id="btn">Ajouter au panier</button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('productcontainer').innerHTML = place2;

        let place3 = '<option>Merci de choisir une option</option>';
        for (let i = 0; i < data.lenses.length; i = i +1){
            place3 += `<option value="${data.lenses[i]}">${data.lenses[i]}</option>`    
            document.getElementById('select').innerHTML = place3;
        }

        const btn = document.getElementById("btn");
        btn.addEventListener('click', function(){ 
            const lenses = document.getElementsByTagName("select");         
            const lenseSelected = lenses[0].value;
            addToBasket(lenseSelected);
            alert("ajouté au panier");
        });

        function addToBasket(lenseSelected){
            let basketContent = JSON.parse(localStorage.getItem("basketContent"));
            if (basketContent === null){
                basketContent = [];
            }
            let product = new Product(id, lenseSelected);
            basketContent.push(product);
            localStorage.setItem("basketContent", JSON.stringify(basketContent));    
        }
    })
}

const id = getUrlId();
getCamera("http://localhost:3000/api/cameras/" + id);
