
function addNewUser(name, avatar = {image: "Dark_Destiny", rarity: "MYTHIC"}, loginStatus = false) {
    var cont = document.createElement("DIV");
    cont.className = "savedUserLine";
    cont.innerHTML = `
        <div class="fullRowFlex">
        <img src="img/pfp/${avatar.image}.png" class="avatar ${avatar.rarity}">
        <div class="savedUserText">
            <div class="username">${name}</div>
            <div class="loginStatus">${loginStatus ? "Logged in" : "<span class='red'>Not logged in</span>"}</div>
        </div>
    `;
    document.getElementById("userList").appendChild(cont);
}

addNewUser("CMD_God");
addNewUser("Angy-Ralsei", {image: "Delete_This_Ralsei", rarity: "TOKEN"}, true);
addNewUser("Stick Rick", {image: "He_Never_Gave_Up", rarity: "EPIC"}, false);