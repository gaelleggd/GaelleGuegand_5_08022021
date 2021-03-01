////////// Créer et ajouter les articles sur la page HTML //////////
// function addProducts(responseProduct, place){ 
//     const div = document.createElement("div");
//     div.innerHTML = responseProduct.name;
//     div.setAttribute("class", "col-md-5 mt-5 mb-4 mx-auto border");

//     const img = document.createElement("img");
//     img.setAttribute("src", responseProduct.imageUrl);
//     img.setAttribute("width", "100%");

//     const legend = document.createElement("div");
//     legend.innerHTML = responseProduct.description;

//     const lenses = document.createElement("p");
//     lenses.innerHTML = "Choix des optiques: "+ responseProduct.lenses;
    
//     const price = document.createElement("p");
//     price.innerHTML = responseProduct.price/100 + "€";

//     const link = document.createElement("a");
//     link.setAttribute("href", "produit.html?id=" + responseProduct._id);
    
//     let emplacement = document.getElementById("emplacement");

//     emplacement.appendChild(div);
//     div.appendChild(link);
//     link.appendChild(img);
//     div.appendChild(legend);
//     div.appendChild(lenses);
//     div.appendChild(price);
// }

////////// Appeler la fonction de récupération de l'API et sa promise pour implémenter la page HTML //////////
function getCameras(url) {
    fetch(url)
    .then ((res) => res.json())
    .then ((data) => {
                 let place = '<div></div>';
        data.forEach(function(camera){
            place += `
                <div class="col-12 col-md-5 mx-auto">
                    <div class="card shadow mb-5">
                        <a href="Produit.html?id=${camera._id}">
                        <img class="card-img-top" src="${camera.imageUrl}"></>
                        </a>
                        <div class ="card-body">
                        <h3 class="card-title">${camera.name}</h3>
                        <p class="card-text">${camera.description}</p>
                        <p class="card-text"> Choix des optiques : ${camera.lenses}</p>
                        <p class="card-text">${camera.price/100}€</p>
                        </div>
                    </div>
                </div>
            `;
        });
    document.getElementById('emplacement').innerHTML = place;
    })
}
getCameras("http://localhost:3000/api/cameras");
