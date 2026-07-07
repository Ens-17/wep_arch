const resultInfo = document.getElementById("resultInfo");
const resultList = document.getElementById("resultList");

const weaponName = document.getElementById("weaponName");

const typeList = document.getElementById("typeList");
const subList = document.getElementById("subList");
const spList = document.getElementById("spList");

const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");

const excludeType = document.getElementById("excludeType");
const excludeSub = document.getElementById("excludeSub");
const excludeSp = document.getElementById("excludeSp");

const typeButton = document.getElementById("typeButton");
const subButton = document.getElementById("subButton");
const spButton = document.getElementById("spButton");

const weapons = [];

for (const key in results2){

    const [type, sub, sp] = key.split("-");

    for(const name of results2[key]){

        weapons.push({
            name,
            type,
            sub,
            sp
        });

    }

}

weapons.sort((a, b) => {

    const typeDiff =
        typeOrder.indexOf(a.type) -
        typeOrder.indexOf(b.type);

    if(typeDiff !== 0)
        return typeDiff;

    return a.name.localeCompare(
        b.name,
        "ja"
    );

});

function createChecks(parent, list){

    for(const item of list){

        const label=document.createElement("label");

        label.innerHTML=`
            <input
                type="checkbox"
                value="${item}">
            ${item}
        `;

        parent.appendChild(label);

    }

}

createChecks(typeList,typeOrder);
createChecks(subList,subOrder);
createChecks(spList,spOrder);

function getCheckedValues(parent){

    return [...parent.querySelectorAll("input:checked")]
        .map(e=>e.value);

}

function matchWeaponName(name){

    const keyword = weaponName.value.trim();

    if(keyword==="") return true;

    const mode=document.querySelector(
        'input[name="searchMode"]:checked'
    ).value;

    switch(mode){

        case "exact":
            return name===keyword;

        case "continuous":
            return name.includes(keyword);

        case "all":

            return [...keyword].every(char=>name.includes(char));

    }

    return true;

}

function matchCategory(value, selected, exclude){

    if(selected.length===0)
        return true;

    const contains=selected.includes(value);

    return exclude ? !contains : contains;

}

function searchWeapons(){

    const types=getCheckedValues(typeList);
    const subs=getCheckedValues(subList);
    const sps=getCheckedValues(spList);

    const result=weapons.filter(weapon=>{

        return(

            matchWeaponName(weapon.name)

            &&

            matchCategory(
                weapon.type,
                types,
                excludeType.checked
            )

            &&

            matchCategory(
                weapon.sub,
                subs,
                excludeSub.checked
            )

            &&

            matchCategory(
                weapon.sp,
                sps,
                excludeSp.checked
            )

        );

    });

    showResults(result);

}

function showResults(result){

    resultInfo.textContent =
        `検索結果：${result.length}件`;

    resultList.innerHTML = "";

    if(result.length===0){

        resultList.innerHTML=`
            <div class="noResult">
                該当するブキはありませんでした。
            </div>
        `;

        return;

    }

    for(const weapon of result){

        const card=document.createElement("div");

        card.className="weaponCard";

        card.innerHTML=`
            <div class="weaponName">
                ${weapon.name}
            </div>

            <div class="weaponInfo">
                ${weapon.type}<br>
                ${weapon.sub}<br>
                ${weapon.sp}
            </div>
        `;

        resultList.appendChild(card);

    }

}

searchButton.addEventListener(
    "click",
    searchWeapons
);

weaponName.addEventListener(
    "keydown",
    e=>{

        if(e.key==="Enter")
            searchWeapons();

    }
);

function resetSearch(){

    // ブキ名
    weaponName.value = "";

    // 検索方法
    document.querySelector(
        'input[name="searchMode"][value="all"]'
    ).checked = true;

    // チェックボックス
    document.querySelectorAll(
        '#typeList input[type="checkbox"],\
         #subList input[type="checkbox"],\
         #spList input[type="checkbox"]'
    ).forEach(check => {

        check.checked = false;

    });

    // 除外
    excludeType.checked = false;
    excludeSub.checked = false;
    excludeSp.checked = false;

    // 検索結果初期化
    resultInfo.textContent = "検索結果：0件";
    resultList.innerHTML = "";

    refreshButton(typeButton, typeList, "ブキ種");
    refreshButton(subButton, subList, "サブ");
    refreshButton(spButton, spList, "スペシャル");

}

resetButton.addEventListener(
    "click",
    resetSearch
);

/* ===========================
   カスタムプルダウン
=========================== */

const customSelects = document.querySelectorAll(".customSelect");

function closeAllDropdowns(except = null){

    customSelects.forEach(select => {

        const button = select.querySelector(".selectButton");
        const dropdown = select.querySelector(".dropdown");

        if(dropdown !== except){

            dropdown.classList.remove("open");
            button.classList.remove("active");

        }

    });

}

customSelects.forEach(select=>{

    const button = select.querySelector(".selectButton");
    const dropdown = select.querySelector(".dropdown");

    button.addEventListener("click",e=>{

        e.stopPropagation();

        const opened = dropdown.classList.contains("open");

        closeAllDropdowns();

        if(!opened){

            dropdown.classList.add("open");
            button.classList.add("active");

        }

    });

});

document.addEventListener("click",()=>{

    closeAllDropdowns();

});


/* ===========================
   選択数表示
=========================== */

function updateButtonText(parentId, buttonId, title){

    const checked =
        document.querySelectorAll(
            `#${parentId} input[type="checkbox"]:checked`
        ).length;

    const total =
        document.querySelectorAll(
            `#${parentId} input[type="checkbox"]`
        ).length;

    const button =
        document.getElementById(buttonId);

    if(checked===0){

        button.textContent =
            `▼ ${title}（すべて）`;

    }

    else if(checked===total){

        button.textContent =
            `▼ ${title}（すべて）`;

    }

    else{

        button.textContent =
            `▼ ${title}（${checked}個選択）`;

    }

}


/* ===========================
   すべて・解除
=========================== */

customSelects.forEach(select=>{

    const list =
        select.querySelector(".checkGrid");

    const title =
        select.dataset.name;

    const button =
        select.querySelector(".selectButton");

    const allButton =
        select.querySelector(".selectAll");

    const clearButton =
        select.querySelector(".clearAll");

    allButton.addEventListener("click",()=>{

        list.querySelectorAll("input").forEach(check=>{

            check.checked=true;

        });

        refreshButton(button,list,title);

    });

    clearButton.addEventListener("click",()=>{

        list.querySelectorAll("input").forEach(check=>{

            check.checked=false;

        });

        refreshButton(button,list,title);

    });

    list.addEventListener("change",()=>{

        refreshButton(button,list,title);

    });

});


/* ===========================
   ボタン表示更新
=========================== */

function refreshButton(button,list,title){

    const checked =
        list.querySelectorAll("input:checked").length;

    const total =
        list.querySelectorAll("input").length;

    if(checked===0 || checked===total){

        button.textContent =
            `▼ ${title}（すべて）`;

    }

    else{

        button.textContent =
            `▼ ${title}（${checked}個選択）`;

    }

}


/* ===========================
   初期表示
=========================== */

refreshButton(
    document.getElementById("typeButton"),
    typeList,
    "ブキ種"
);

refreshButton(
    document.getElementById("subButton"),
    subList,
    "サブ"
);

refreshButton(
    document.getElementById("spButton"),
    spList,
    "スペシャル"
);
