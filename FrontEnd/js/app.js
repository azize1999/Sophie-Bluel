
async function getWorks(filter) {
    document.querySelector(".gallery").innerHTML = "";
    const url = "http://localhost:5678/api/works";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      if (filter) {
        const filtered = json.filter((data) => data.categoryId == filter);
        console.log(filtered);
        for (let i = 0; i < filtered.length; i++) {
          setFigure(filtered[i]);
        }
      }else {
        for (let i = 0; i < json.length; i++) {
            setFigure(json[i]);
        }
      }
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
    // demander au mentor si j'ai autre choix que de mettre l'id comme un nom de class
    div.innerHTML = `${data.name}`;
    document.querySelector(".div-container").append(div);
}
   document.querySelector(".tous").addEventListener("click", () => getWorks()); //<--
//demander le mentor pourquoi le bouton tous ne fonctionne pas !!

function displayAdminMode(){
  if (sessionStorage.authtoken){
    console.log("ok");
const editBanner = document.createElement("div");
editBanner.className = "edit";
editBanner.innerHTML = '<div class="edit"><p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p></div>';
    document.body.prepend(editBanner);
  }
}
displayAdminMode();