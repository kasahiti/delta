// Greatings in console on page load
let css = "font-size: 25px";
const smiley = String.fromCodePoint('0x1f607');
console.log("%cHello! Have a nice day! " +smiley, css);

// Editor's settings
let quill;
let toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean']
];

// Function to disable the editor when viewing a Delta
function disableQuill(delta){
    quill = new Quill('#edit', {
        readOnly: true,
        theme: 'bubble'
    })

    if(delta.encrypted === false.toString()){
        console.log("Delta is not encrypted !");
        quill.setContents(JSON.parse(delta.delta));
        quill.disable();
    } else {
        console.log("Delta is encrypted !");
        $('#passwordPromptModal').modal({backdrop: 'static'});
        $('#passwordPromptModal').modal('toggle');
        btnDecrypt.addEventListener('click', _=>{
            if(passwordDecrypt.value.length > 0){
                try{
                    let password = passwordDecrypt.value;
                    let bytes = CryptoJS.AES.decrypt(delta.delta, password);
                    let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                    quill.setContents(decryptedData);
                    quill.theme
                    quill.disable();
                    $('#passwordPromptModal').modal('hide');
                } catch (error){
                    alert("Wrong password!");
                }
            } else {
                alert('Please enter password!');
            }
        });
        passwordDecrypt.addEventListener('keyup', evt=> {
            if (evt.keyCode === 13) {
                evt.preventDefault();
                document.getElementById('btnDecrypt').click();
            }
        });
    }
}

// Function to load the editor
function loadEditor(){
    quill = new Quill('#edit', {
        modules: {
            toolbar: toolbarOptions,
            syntax: true,
        },
        theme: 'snow'
    })
}

// Function to display a delta on the page (with it's UUID in the URL)
function loadUuid(){
    let url = window.location.href;
    let UUID = url.split('?')[0].split('/')[4];
    if(UUID){
        save.remove();
        settings.remove();
        console.log(`UUID : ${UUID}`);
        fetch('/api/delta/'+UUID)
            .then(res=>res.json())
            .then(res=>{
                disableQuill(res);
            })
            .catch(err=>{
                console.log(err)
                edit.innerHTML = "Delta not found."
            });
    } else {
        loadEditor();
    }
}

window.addEventListener('DOMContentLoaded', loadUuid);

// Check settings and show error messages if needed
function verifySettings(){
    let checked = $('#passwordProtect').is(":checked");
    if (checked){
        let password = $('#typePassword').val();
        if (password){
            return true;
        } else {
            alert('Please enter password!');
            return false;
        }
    } else {
        return true;
    }
}

// Events listener
passwordProtect.addEventListener('click', _=> {
    $('#pwdInput').toggleClass('hidden');
})

settings.addEventListener('click', _=>{
    $('#mainModal').modal('toggle');
})

closeSettings.addEventListener('click', _=>{
    if(verifySettings()){
        $('#mainModal').modal('hide');
    }
})

closeSettingsb.addEventListener('click', _=>{
    if(verifySettings()){
        $('#mainModal').modal('hide');
    }
})

saveSettings.addEventListener('click', _=>{
    if(verifySettings()){
        $('#mainModal').modal('hide');
    }
})

// Show or hide password when clicking on the icon
function togglePassword(inputSelector, selector) {
    let prompt = document.querySelector(inputSelector);
    const type = prompt.getAttribute('type') === 'password' ? 'text' : 'password';
    typePassword.setAttribute('type', type);
    passwordDecrypt.setAttribute('type', type);
    $(selector).toggleClass('fa-eye-slash');
    $(selector).toggleClass('fa-eye');
}

iconPassword.addEventListener('click', _=>togglePassword('#typePassword','#iconPassword'));

iconPasswordDecrypt.addEventListener('click', _=>togglePassword('#passwordDecrypt', '#iconPasswordDecrypt'));

// Save delta when user click on button "save"
save.addEventListener('click', _=>{
    let checked = $('#passwordProtect').is(":checked");
    let autodelete = $('#selftDestroy').is(":checked");
    let delta = quill.getContents();
    let form = new FormData();

    if(checked){
        let pass = typePassword.value;
        let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(delta), pass).toString();
        form.append('delta', ciphertext);
        form.append('encrypted', 'true');
    } else {
        form.append('delta', JSON.stringify(delta))
        form.append('encrypted', 'false');
    }

    form.append('autodelete', `${autodelete}`);

    fetch('/api/delta/',
        {
            method: 'POST',
            body: form
        })
        .then(res=>{
            if (!res.ok) {
                throw Error(res.statusText);
            } else {
                res.text().then(r => showUUID(r) );
            }
        })
        .catch(err=>{
            console.log(err);
            $('#errorMsgBox').modal('toggle');
        })
})

// Show UUID url when the delta is saved in the DB
function showUUID(uuid){
    const url = "/uuid/" + uuid;
    editorwrap.remove();
    save.remove();
    settings.remove();
    results.classList.remove("hidden");

    let link = document.createElement('A');
    link.href = url;
    link.text = uuid;

    result.appendChild(link);
}

// Add effect on header when scrolling
document.addEventListener('scoll', _=>{
    let nav = $('.fixed-top');
    nav.toggleClass('scrolled', $(this).scrollTop() > nav.height());
})