// ////////// Caractéristiques d'un produit, id + lentille //////////
class Product {
    constructor(id, lenseSelected) {
        this.lenses = lenseSelected;
        this.id = id;
    }
}

// // // ////////// Récupérer l'id dans l'URL //////////
function getUrlId(){
    let urlId = new URLSearchParams(document.location.search.substring(1)).get("id");
    return urlId
};


////////// Fonction de récupération d'un produit auprès de l'API par son ID pour l'afficher sur la page produit //////////
function getCamera(url) { // Appel de l'API en fetch
    fetch(url)
    .then ((res) => res.json())
    .then ((data) => {
        let place2 = '<div></div>'; // Création du html à intégrer pour la carte produit
        place2 += `
            <div class="col-12 col-md-5 mx-auto">
                <div class="card shadow mb-5">
                    <img class="card-img-top" src="${data.imageUrl}"></>
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
        document.getElementById('productcontainer').innerHTML = place2; // Choix de l'emplacement dans le document html

        let place3 = '<option>Merci de choisir une option</option>'; // Création du html à intégrer pour le choix des lentilles
        for (let i = 0; i < data.lenses.length; i = i +1){ // Implémentation automatique en fonction du nbre de lentilles
            place3 += `<option value="${data.lenses[i]}">${data.lenses[i]}</option>`    
            document.getElementById('select').innerHTML = place3; // Choix de l'emplacement dans le document html
        }

        const btn = document.getElementById("btn"); 
        btn.addEventListener('click', function(){  // Action d'ajouter l'article sélectionné dans le local storage au click sur le bouton
            const lenses = document.getElementsByTagName("select");         
            const lenseSelected = lenses[0].value;
            addToBasket(lenseSelected);
            alert("Votre article a été ajouté au panier"); // Fenêtre pop-up alert pour signaler que l'action au click a été réalisée
        });
        function addToBasket(lenseSelected){ // Fonction pour ajouter un produit au local storage
            let basketContent = JSON.parse(localStorage.getItem("basketContent"));
            if (basketContent === null){
                basketContent = [];
            }
            let product = new Product(id, lenseSelected); 
            basketContent.push(product); // ajouter un élément au tableau
            localStorage.setItem("basketContent", JSON.stringify(basketContent));    
        }
    })
}

// ////////// Appel de la fonction définie pour tout exécuter //////////
const id = getUrlId();
getCamera("http://localhost:3000/api/cameras/" + id);
