async function getWorks(filter) {
    document.querySelector(".gallery").innerHTML = "";
      document.querySelector(".gallery-modal").innerHTML = "";
    const url = "http://localhost:5678/api/works";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      if (filter) {
        const filtered = json.filter((data) => data.categoryId == filter);

        for (let i = 0; i < filtered.length; i++) {
          setFigure(filtered[i]);
          setModalFigure(filtered[i]);
        }
      }else {
        for (let i = 0; i < json.length; i++) {
            setFigure(json[i]);
            setModalFigure(json[i]);
        }
      }
      //delete
      const trashcans = document.querySelectorAll(".fa-trash-can");

  trashcans.forEach((e)=> e.addEventListener("click",(event)=> deleteWork (event)));
    } catch (error) {
      console.error(error.message);
    }

  }
  getWorks();// Appelle la fonction avec un argument 

function setFigure(data) {
    if (!data || !data.imageUrl || !data.title) {
        console.error("Données invalides pour setFigure:", data);
        return;
    }
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                        <figcaption>${data.title}</figcaption>`;
    document.querySelector(".gallery").append(figure);
    
    
}
function setModalFigure(data) {
  if (!data || !data.imageUrl || !data.title) {
    console.error("Données invalides pour setFigure:", data);
    return;
  }
  const figure = document.createElement( "figure");
  figure.innerHTML = `<div class="image-container">
  <img src="${data.imageUrl}" alt="${data.title}">
        <figcaption>${data.title}</figcaption>
        <i id=${data.id} class="fa-solid fa-trash-can overlay-icon"></i>
    </div>`;
  document.querySelector(".gallery-modal").append(figure);


}


async function getCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
       
        for (let i = 0; i < json.length; i++) {
            setFilter(json[i]);
        }
    } catch (error) {
        console.error(error.message);
    }
}

getCategories();

function setFilter(data) {
    const div = document.createElement("div");
    div.className = data.id;
    div.addEventListener("click" ,() => getWorks(data.id));
    div.innerHTML = `${data.name}`;
    document.querySelector(".div-container").append(div);
}
   document.querySelector(".tous").addEventListener("click", () => getWorks()); 


function displayAdminMode(){
  if (sessionStorage.authToken){
    console.log("ok");
const editBanner = document.createElement("div");
editBanner.className = "edit";
editBanner.innerHTML = '<p><a href="#modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"></i> Mode édition</a></p>';
    document.body.prepend(editBanner);

    const login = document.querySelector(".login a");
    login.href = "#";
    login.textContent ="logout";
    login.addEventListener("click", (event)=> {
      event.preventDefault();
      sessionStorage.removeItem("authToken");
      location.reload();

    })

  }
}
displayAdminMode();// Appelle la fonction pour afficher le mode administrateur
let modal = null; // Initialise la variable modal à null
const focesableSelector = "button,a,input,textarea"// Sélecteur pour les éléments pouvant recevoir le focus
let focusables = []// Initialise un tableau vide pour stocker les éléments pouvant recevoir le focus

const openModal = function (e) {// Fonction pour ouvrir la modal
  e.preventDefault();  // Empêche le comportement par défaut de l'événement 
  modal = document.querySelector(e.target.getAttribute('href'));  // Sélectionne la modal en utilisant l'attribut href de l'élément déclencheur
  focusables = Array.from(modal.querySelectorAll(focesableSelector));  // Récupère tous les éléments pouvant recevoir le focus dans la modal
  focusables[0].focus();  // Donne le focus au premier élément pouvant recevoir le focus
  modal.style.display = null; // Affiche la modal en supprimant le style display
  modal.removeAttribute('aria-hidden');// Supprime l'attribut aria-hidden pour rendre la modal accessible
  modal.setAttribute('aria-modal', 'true');// Ajoute l'attribut aria-modal pour indiquer que la modal est active
  modal.addEventListener('click', closeModal); // Ajoute un écouteur d'événement pour fermer la modal lorsqu'on clique en dehors
  document.querySelector('.js-modal-close').addEventListener('click', closeModal); // Ajoute un écouteur d'événement pour fermer la modal lorsqu'on clique sur le bouton de fermeture
  document.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);  // Ajoute un écouteur d'événement pour empêcher la propagation de l'événement de clic
}

const closeModal = function (e) {// Fonction pour fermer la modal 
  if (modal === null) return; // Si aucune modal n'est ouverte, ne fait rien
  e.preventDefault(); // Empêche le comportement par défaut de l'événement
  modal.style.display = "none";// Cache la modal en définissant le style display à "none"
  modal.setAttribute("aria-hidden", "true");  // Ajoute l'attribut aria-hidden pour rendre la modal inaccessible
  modal.removeAttribute("aria-modal"); // Supprime l'attribut aria-modal
  modal.removeEventListener("click", closeModal); // Supprime l'écouteur d'événement pour fermer la modal lorsqu'on clique en dehors
  document.querySelector('.js-modal-close').removeEventListener('click', closeModal); // Supprime l'écouteur d'événement pour fermer la modal lorsqu'on clique sur le bouton de fermeture
  document.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);  // Supprime l'écouteur d'événement pour empêcher la propagation de l'événement de clic
  modal = null;// Réinitialise la variable modal à null
}

const stopPropagation = function(e){
  e.stopPropagation();
}

const focusInModal = function(e){
  e.preventDefault();
  let index = focusables.findIndex(f=> f === modal.querySelector(":Focus"));
  if(e.shiftkey === true){
    index--;
  }else{
    index++;
  }
  if (index >=focusables.length){
    index=0;
  }
  if(index < 0){
    index = focusables.length -1;
  }
  focusables[index].focus()
}

window.addEventListener('keydown',function (e){
  if(e.key ==="Escape" || e.key === "esc"){
    closeModal(e);
  }
  if(e.key ==="Tab" && modal !==null){
    focusInModal(e);

  }
})

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});


//  //delete function

async function deleteWork(event) {
  console.log(event.srcElement.id);
  const id = event.srcElement.id;
  const deleteApi = "http://localhost:5678/api/works/";
  const token = sessionStorage.authToken;

  const response = await fetch(deleteApi +id, {
    method: "DELETE",
    headers:{
      Authorization: "Bearer " + token,
    },
  });

  if (response.status == 401 || response.status == 500) {
    const errorBox = document.createElement("div");
    errorBox.className = "error-login";
    errorBox.innerHTML = "Il y a eu une erreur";
    document.querySelector(".modal-button-container").prepend(errorBox);
  } else {
    // const result = await response.json();
    // console.log(result);
    getWorks()
  }
}
























