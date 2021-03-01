/////////////////////////////////////// Confirmation de la commade /////////////////////////////////
function addConfirmationText(){
    const confirmationId = localStorage.getItem("orderConfirmation"); // récuperation de l'ID dans le local storage
    const totalPrice = localStorage.getItem("totalPriceConfirmationPage"); //récuperation du prix dans le local storage
    const confirmation = document.getElementById("confirmation");
    const messageConfirmation = document.createElement("p");
    messageConfirmation.innerHTML = "Nous vous remercions pour votre commande n° "+ confirmationId;
    messageConfirmation.setAttribute("class", "confirmation-title pt-5 text-center")

    const confirmationPrice = document.createElement("p");
    confirmationPrice.innerHTML = "Prix total de votre commande: "+ totalPrice/100 + " €";
    confirmationPrice.setAttribute("class", "confirmation-title text-center")

    confirmation.appendChild(messageConfirmation);
    confirmation.appendChild(confirmationPrice);
}

addConfirmationText();


