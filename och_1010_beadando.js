const _URL = 'https://reqres.in/api/users';
let users = [];    

const id_input = document.getElementById('up_form_id');
const ln_input = document.getElementById('up_form_lastN');
const fn_input = document.getElementById('up_form_firstN');
const email_input = document.getElementById('up_form_email');
const img_input = document.getElementById('up_form_img');

async function loadData(page = 1, per_page = 6){
    document.getElementById('table_body').innerHTML = "";
    const loadUrl = _URL + '?page=' + page + '&per_page=' + per_page;
    try{
        const result = await fetch(loadUrl, {method: 'GET'});
        if(result.status !== 200) throw new Error('A kérés rossz kóddal jött vissza: ' + result.status);
        try{
            let elemets = await result.json();
            console.log(elemets);
            users = elemets.data;
            tableLoading(users);
            pagination(elemets.page, elemets.per_page, elemets.total, elemets.total_pages);
            return users;
        }
        catch(err2){
            console.log(err2);
        } 
    }
    catch(err){
        console.log(err);
    }   
}
loadData();

async function getUser(userId){    
    try{
        const result = await fetch(_URL + '/' + userId, {method: 'GET'});
        if(result.status !== 200) throw new Error('A kérés rossz kóddal jött vissza: ' + result.status);
        try{
            let user = await result.json();
            console.log(user);
            id_input.value = user.data.id;
            ln_input.value = user.data.last_name;
            fn_input.value = user.data.first_name;
            email_input.value = user.data.email;
            img_input.value = user.data.avatar;
            document.getElementById('user_avatar').src = user.data.avatar;
        }
        catch(err2){
            console.log(err2);
        } 
    }
    catch(err){
        console.log(err);
    }
}

async function sendData(lastName, firstName, email, img){
    let params = {
        last_name: lastName, 
        first_name: firstName,
        email: email,
        avatar: img}; 
    let response = await fetch(_URL,
        {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        }
    );
    if(response.status === 201){ 
        console.log('ok');
        try{
            let data = await response.json(); 
            console.log(data, data.id); 
            alert('Új felhasználó hozzázáadása sikeresen megtörtén! Lérehozás időpontja: ' 
            + new Date().toLocaleString() + ' Az új felsználó id-ja: ' + data.id);
        }
        catch(error){
            console.log(error); 
        }
    }
    else throw new Error ('Nem megfelelő státuszkód érkezett vissza' + response.status);
}

const sendForm = document.getElementById('send_form')
sendForm.onsubmit = function(){
    const send_lastname = document.getElementById('send_lastN_form').value;
    const send_firstname = document.getElementById('send_firstN_form').value;
    const send_email = document.getElementById('send_email_form').value;
    const send_img = document.getElementById('send_img_form').value;

    try{
        sendData(send_lastname, send_firstname, send_email, send_img);
        loadData()
    }
    catch(error) {console.log(error)};
return false;
}

async function deleteData(userId){
    console.log(userId);
    fetch(_URL + '/' + userId, {method: 'DELETE'})
        .then((response) => { 
            if (response.status === 204) {
                alert('Sikeres törlés');
                nevjegy_close();
                loadData();
            } 
            else throw new Error ('Nem megfelelő státuszkód érkezett vissza' + response.status)
        })
        .catch((error) => console.error(error));   
}

async function updateData(userId, lastName, firstName, email, img){
    let params = {
        last_name: lastName, 
        first_name: firstName,
        email: email,
        avatar: img}; 
    const result = await fetch(_URL + '/' + userId, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    if(result.status === 200){ 
        alert('Sikeres szerkesztés');
    }
    else throw new Error ('Nem megfelelő státuszkód érkezett vissza' + result.status);
}

const upDate_form = document.getElementById('update_form')
upDate_form.onsubmit = function(){
    try{
        updateData(id_input.value, ln_input.value, fn_input.value, email_input.value, img_input.value);
        nevjegy_close();
        loadData();
    }
    catch(error) {console.log(error)};
return false;
}

function newRow(new_user, row){
    const Id_cell = document.createElement('th');
    const Name_cell = document.createElement('td');
    const Email_cell = document.createElement('td');
    const Avatar_cell = document.createElement('td');
    const Button_cell = document.createElement('td');
    const name_button = document.createElement('button');
    const avatar_img = document.createElement('img');
    const button = document.createElement('button');

    row.appendChild(Id_cell);
    row.appendChild(Name_cell);
    row.appendChild(Email_cell);
    row.appendChild(Avatar_cell);
    row.appendChild(Button_cell);
    Name_cell.appendChild(name_button);
    Button_cell.appendChild(button);
    Avatar_cell.appendChild(avatar_img);

    Id_cell.innerText = new_user.id;
    name_button.innerText = new_user.last_name + ' ' + new_user.first_name;
    name_button.className = 'btn btn-link';
    name_button.setAttribute('data-bs-toggle', 'modal');
    name_button.setAttribute('data-bs-target', '#nevjegy');
    Email_cell.innerText = new_user.email;
    avatar_img.src = new_user.avatar;
    button.innerText = 'Törlés';
    button.className = 'btn btn-danger'
    button.addEventListener("click", function(){
        deleteData(new_user.id);
    });
    name_button.addEventListener("click", function(){
        getUser(new_user.id);
    });
}

function tableLoading(data){
    console.log(data)
    const table = document.getElementById('table_body');
    for(let i = 0; i < data.length; i++){
        const new_row = document.createElement('tr');
        table.appendChild(new_row);
        newRow(data[i], new_row); 
    }
}

function frissites_form(){
    document.getElementById('exampleModalLabel').innerText = 'Névjegy szerkesztése';
    ln_input.disabled = false;
    fn_input.disabled = false;
    email_input.disabled = false;
    img_input.disabled = false;
    document.getElementById("frissites_button").style.display = "none";
    const updateData_button = buttons.appendChild(document.createElement('button'));
    updateData_button.innerText = 'Frissítés mentése';
    updateData_button.type = 'submit';
    updateData_button.className = "btn btn-primary";
    updateData_button.id = 'mentes_button';
}

function nevjegy_close(){
    console.log('bezár')
    ln_input.disabled = true;
    fn_input.disabled = true;
    email_input.disabled = true;
    img_input.disabled = true;
    document.getElementById("frissites_button").style.display = "block";
    document.getElementById('mentes_button').remove();
    document.getElementById('exampleModalLabel').innerText = 'Felhasználó névjegye';
}

function pagination(page, per_page, total, total_pages){
    const pages = document.getElementById('page_selector');
    pages.innerHTML = '';
    for(let i = 1; i <= total_pages; i++){
        const new_page = document.createElement('li');
        new_page.className = 'page-item'
        pages.appendChild(new_page);
        const new_link = document.createElement('a');
        if(i == page){
            new_link.className = 'active page-link'
        }
        else {new_link.className = 'page-link';}
        new_link.innerText = i;
        new_link.value = i;
        new_link.addEventListener("click", function(){
            reloading_page(new_link.value);
        });
        new_page.appendChild(new_link);
    }
    const items = document.getElementById('per_page_selector'); 
    items.innerHTML = '';
        for(let i = 1; i <= total; i++){
            const new_pp_item = document.createElement('option');
            new_pp_item.value = i;
            new_pp_item.innerText = i;
            if(i == per_page) new_pp_item.selected = true;
            items.appendChild(new_pp_item);
        }
}

let actiual_page = 0;
function reloading_page(page){
    let per_page = document.getElementById('per_page_selector').value;
    loadData(page, per_page);
    pagination(page, per_page);
    return actiual_page = page;
}
console.log(actiual_page)

function reloading_pp(){
    let per_page = document.getElementById('per_page_selector').value;
    loadData(actiual_page, per_page);
    pagination(actiual_page, per_page);
}