const d = document,
    $formList = d.getElementById("form-task"),
    $list = d.getElementById("list"),
    $template = d.getElementById("template-task").content,
    $titleForm = d.getElementById("title-form"),
    $frag = d.createDocumentFragment();

async function getAlltask(){
    try{
        let res = await fetch("http://localhost:3000/tasks"),
            json = await res.json();
        
        if(!res.ok) throw {statusText: res.statusText, status: res.status}

        json.forEach(element => {
            $template.querySelector("h3").textContent = element.title;
            $template.querySelector("p").textContent = element.message;
            $template.querySelector("#edit").dataset.id = element.id;
            $template.querySelector("#edit").dataset.title = element.title;
            $template.querySelector("#edit").dataset.message = element.message;
            $template.querySelector("#delete").dataset.id = element.id;
            let $clone = d.importNode($template, true);
            $frag.appendChild($clone);
        });

        $list.appendChild($frag);
        console.log(json);
    }
    catch(err){
        console.log(err);
        let message = err.statusText || "Ocurrió un error inesperado";
        $list.innerHTML = `<h3 class="error">Error ${err.status}: ${message}</h3>`;
    }
}

//Events

d.addEventListener("DOMContentLoaded", getAlltask);

d.addEventListener("submit", async(e)=>{
    if(e.target === $formList){
        e.preventDefault();
        if(!e.target.id.value){
            try{
                let options = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        title: e.target.title.value,
                        message: e.target.message.value
                    })
                };
                let res = await fetch("http://localhost:3000/tasks", options);

                if(!res.ok) throw {statusText: res.statusText, status: res.status}
                location.reload();
            }
            catch(err){
                console.log(err);
                let message = err.statusText || "Ocurrió un error inesperado";
                $list.innerHTML = `<h3 class="error">Error ${err.status}: ${message}</h3>`;
            }
        }else{
            try{
                let options = {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify({
                        title: e.target.title.value,
                        message: e.target.message.value
                    })
                };
                let res = await fetch(`http://localhost:3000/tasks/${e.target.id.value}`, options);

                if(!res.ok) throw {statusText: res.statusText, status: res.status}
                location.reload();
            }
            catch(err){
                console.log(err);
                let message = err.statusText || "Ocurrió un error inesperado";
                $list.innerHTML = `<h3 class="error">Error ${err.status}: ${message}</h3>`;
            }
        }
    }
});

d.addEventListener("click", async(e)=>{
    if(e.target.matches("#edit")){
        $titleForm.textContent = "Upload task";
        $formList.title.value = e.target.dataset.title;
        $formList.message.value = e.target.dataset.message;
        $formList.id.value = e.target.dataset.id;
    }
    if(e.target.matches("#delete")){
        let isDelete = confirm("Do you want to delete this task?");
        if(isDelete){
            try{
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    }
                };
                let res = await fetch(`http://localhost:3000/tasks/${e.target.dataset.id}`, options);

                if(!res.ok) throw {statusText: res.statusText, status: res.status}
                location.reload();
            }
            catch(err){
                console.log(err);
                let message = err.statusText || "Ocurrió un error inesperado";
                $list.innerHTML = `<h3 class="error">Error ${err.status}: ${message}</h3>`;
            }
        }
    }
});