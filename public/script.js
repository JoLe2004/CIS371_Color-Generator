const navbar = document.getElementById('navbar');
const container = document.getElementById("main-container");
const model = document.getElementById('template-container') ? "ui" : "default";

lockedColors = [false, false, false, false, false]
colorList = ["#363636", "#5E5E5E", "#808080", "#878787", "#D3D3D3"];

function toggleSidebar() {
    navbar.classList.toggle("show");
}

async function generate() {
    try {
        const input = lockedColors.map((locked, i) => locked ? [parseInt(colorList[i].slice(1, 3), 16), parseInt(colorList[i].slice(3, 5), 16), parseInt(colorList[i].slice(5, 7), 16)] : "N");
        const response = await fetch("/api/colormind", {
            method: "POST", 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({model: model, input: input})
        });
        
        let result = await response.json()
        result = result["result"]
        colorList = []
        result.forEach(color => { 
            const hex = "#" + color.map(c => c.toString(16).padStart(2, "0")).join(""); 
            colorList.push(hex.toUpperCase());
        })
        replaceColors();
        
    } catch (error) {
        console.log(error.message)
    }
}

function placeColors() {
    for (let i = 0; i < 5; i++) {
        let colorContainer = document.createElement("div");
        colorContainer.classList.add("color-container");
        let color = document.createElement("div");
        color.classList.add("color")
        color.style.backgroundColor = colorList[i];
        let colorText = document.createElement("div");
        colorText.classList.add("color-text");
        colorText.textContent = colorList[i];
        color.appendChild(colorText);

        let row = document.createElement("div");
        row.classList.add("row");

        let hexcode = document.createElement("span");
        hexcode.classList.add("hexcode")
        hexcode.textContent = colorList[i]

        let swapLeft = document.createElement("div");
        swapLeft.classList.add("tool")
        swapLeft.innerHTML = "<i class='bx bxs-chevron-left'></i>";
        swapLeft.setAttribute("onclick", "swapLeft(this)")

        let swapRight = document.createElement("div");
        swapRight.classList.add("tool")
        swapRight.innerHTML = "<i class='bx bxs-chevron-right'></i>";
        swapRight.setAttribute("onclick", "swapRight(this)")

        let colorAdjustIcon = document.createElement("div");
        colorAdjustIcon.classList.add("tool");
        colorAdjustIcon.innerHTML = "<i class='bx bx-slider'></i>";
        colorAdjustIcon.setAttribute("onclick", "displayJoe(this)");

        let lock = document.createElement("div");
        lock.classList.add("tool");
        lock.innerHTML = "<i class='bx bxs-lock-open'></i>";
        lock.setAttribute("onclick", "toggleLock(this)");

        row.appendChild(hexcode);
        row.append(lock);
        row.appendChild(colorAdjustIcon)
        row.appendChild(swapLeft)
        row.appendChild(swapRight)
        colorContainer.appendChild(color);
        colorContainer.appendChild(row);
        container.appendChild(colorContainer);
    }
}

function replaceColors() {
    const template = document.getElementById("template-container");
    let containers = document.getElementsByClassName("color");
    let hexcodes = document.getElementsByClassName("hexcode");
    let colorTexts = document.getElementsByClassName("color-text");

    for (let i = 0; i < 5; i++) {
        let overlay = document.createElement("div");
        overlay.classList.add("color-overlay");
        overlay.style.backgroundColor = colorList[i];

        containers[i].appendChild(overlay);

        setTimeout(() => {
            overlay.style.transform = "translateX(100%)";
        }, 50);

        setTimeout(() => {
            containers[i].style.backgroundColor = colorList[i];
            hexcodes[i].textContent = colorList[i];
            colorTexts[i].textContent = colorList[i]
            overlay.remove();
        }, 600);
    }
    if (template) {
        updateTemplate();
    }
}

function toggleLock(button) {
    let index = Array.from(button.parentElement.parentElement.parentElement.children).indexOf(button.parentElement.parentElement);
    lockedColors[index] = !lockedColors[index];

    let icon = button.querySelector("i");
    if (lockedColors[index]) {
        icon.classList.replace("bxs-lock-open", "bxs-lock");
        button.classList.add("locked")
    } else {
        icon.classList.replace("bxs-lock", "bxs-lock-open");
        button.classList.remove("locked")
    }
}

function displayJoe(button){
    const template = document.getElementById("template-container");
    let existingPicker = document.getElementById("picker");
    if (existingPicker) {
        existingPicker.remove();
    }        
    let pickerDiv = document.createElement("div");
    pickerDiv.id = "picker";

    button.parentNode.insertBefore(pickerDiv, button.nextSibling);
        
    const joe = colorjoe.rgb(pickerDiv, button.parentNode.previousElementSibling.style.backgroundColor);
    joe.on("change", color => {
        button.parentNode.previousElementSibling.style.backgroundColor = color.hex()
        button.parentNode.previousElementSibling.firstElementChild.textContent = color.hex().toUpperCase()
        button.parentNode.firstElementChild.textContent = color.hex().toUpperCase()
    });
    joe.on("done", color => {
        let index = Array.from(button.parentElement.parentElement.parentElement.children).indexOf(button.parentElement.parentElement);
        colorList[index] = color.hex()
        if (template) {
            updateTemplate();
        }
    });

    function closePicker(event) {
        if (!pickerDiv.contains(event.target) && !button.contains(event.target)) {
            pickerDiv.remove();
            document.removeEventListener('click', closePicker);
        }
    }
    document.addEventListener('click', closePicker);
}

function swapLeft(button) {
    const template = document.getElementById("template-container");
    let containers = document.getElementsByClassName("color-container");
    let container = button.parentNode.parentNode;
    let prev = container.previousElementSibling;
    if (prev) {
        container.parentNode.insertBefore(container, prev);
        i = Array.from(containers).indexOf(container)
        j = Array.from(containers).indexOf(prev)
        let temp = lockedColors[i]
        lockedColors[i] = lockedColors[j]
        lockedColors[j] = temp;
        temp = colorList[i]
        colorList[i] = colorList[j]
        colorList[j] = temp
    }
    if (template) {
        updateTemplate();
    }
}

function swapRight(button) {
    const template = document.getElementById("template-container");
    let containers = document.getElementsByClassName("color-container");
    let container = button.parentNode.parentNode;
    let next = container.nextElementSibling;
    if (next) {
        container.parentNode.insertBefore(next, container);
        i = Array.from(containers).indexOf(container)
        j = Array.from(containers).indexOf(next)
        let temp = lockedColors[i]
        lockedColors[i] = lockedColors[j]
        lockedColors[j] = temp;
        temp = colorList[i]
        colorList[i] = colorList[j]
        colorList[j] = temp
    }
    if (template) {
        updateTemplate();
    }
}

function updateTemplate() {
    const classNames = ["one", "two", "three", "four", "five"];

    classNames.forEach((className, index) => {
        const elements = document.getElementsByClassName(className);
        for (const element of elements) {
            if (element.classList.contains("text")) {
                element.style.color = colorList[index];
            } else {
                element.style.backgroundColor = colorList[index];
                if (element.tagName.toLowerCase() === "button") {
                    element.addEventListener("mouseenter", () => {
                        element.style.backgroundColor = "#aaa";
                    });
                    element.addEventListener("mouseleave", () => {
                        element.style.backgroundColor = colorList[index];
                    });
                }
            }
        }
    });
}


placeColors();
generate();
document.getElementById("save-palette-form").addEventListener("submit", function(event) {
    document.getElementById("palette-colors").value = JSON.stringify(colorList);
});