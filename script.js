const colors = {
    black:{digit:0,multiplier:1,tolerance:null,temp:250,color:"#000000"},
    brown:{digit:1,multiplier:10,tolerance:1,temp:100,color:"#8B4513"},
    red:{digit:2,multiplier:100,tolerance:2,temp:50,color:"#ff0000"},
    orange:{digit:3,multiplier:1000,tolerance:null,temp:15,color:"#ff8800"},
    yellow:{digit:4,multiplier:10000,tolerance:null,temp:25,color:"#ffee00"},
    green:{digit:5,multiplier:100000,tolerance:0.5,temp:null,color:"#00aa00"},
    blue:{digit:6,multiplier:1000000,tolerance:0.25,temp:10,color:"#0066ff"},
    violet:{digit:7,multiplier:10000000,tolerance:0.1,temp:5,color:"#8a2be2"},
    grey:{digit:8,multiplier:100000000,tolerance:0.05,temp:null,color:"#808080"},
    white:{digit:9,multiplier:1000000000,tolerance:null,temp:null,color:"#ffffff"},
    gold:{digit:null,multiplier:0.1,tolerance:5,temp:null,color:"#d4af37"},
    silver:{digit:null,multiplier:0.01,tolerance:10,temp:null,color:"#c0c0c0"}
};

const resistorType = document.getElementById("resistorType");

const result = document.getElementById("result");
const ohms = document.getElementById("ohms");
const kilo = document.getElementById("kilo");
const mega = document.getElementById("mega");
const tolerance = document.getElementById("tolerance");
const tempCoeff = document.getElementById("tempCoeff");
const steps = document.getElementById("steps");

const bandSelectors = document.getElementById("bandSelectors");

let bandValues = [
    "red",
    "yellow",
    "brown",
    "gold",
    "brown",
    "red"
];

createSelectors();
createTable();
calculate();

/* ==================================== */
/* CREATE SELECTORS */
/* ==================================== */

function createSelectors(){

    bandSelectors.innerHTML = "";

    let totalBands = parseInt(resistorType.value);

    for(let i=0;i<totalBands;i++){

        const box = document.createElement("div");

        box.classList.add("band-box");

        const label = document.createElement("label");

        label.innerText = getBandName(i,totalBands);

        const select = document.createElement("select");

        for(let key in colors){

            const option = document.createElement("option");

            option.value = key;

            option.innerText =
            key.charAt(0).toUpperCase() + key.slice(1);

            if(bandValues[i] === key){
                option.selected = true;
            }

            select.appendChild(option);

        }

        const preview = document.createElement("div");

        preview.classList.add("color-preview");

        preview.style.background =
        colors[bandValues[i]].color;

        select.addEventListener("change",(e)=>{

            bandValues[i] = e.target.value;

            preview.style.background =
            colors[e.target.value].color;

            calculate();

        });

        box.appendChild(label);
        box.appendChild(select);
        box.appendChild(preview);

        bandSelectors.appendChild(box);

    }

}

/* ==================================== */
/* BAND NAMES */
/* ==================================== */

function getBandName(index,type){

    if(type === 4){

        const names = [
            "1st Digit",
            "2nd Digit",
            "Multiplier",
            "Tolerance"
        ];

        return names[index];

    }

    if(type === 5){

        const names = [
            "1st Digit",
            "2nd Digit",
            "3rd Digit",
            "Multiplier",
            "Tolerance"
        ];

        return names[index];

    }

    if(type === 6){

        const names = [
            "1st Digit",
            "2nd Digit",
            "3rd Digit",
            "Multiplier",
            "Tolerance",
            "Temp Coefficient"
        ];

        return names[index];

    }

}

/* ==================================== */
/* TYPE CHANGE */
/* ==================================== */

resistorType.addEventListener("change",()=>{

    createSelectors();

    calculate();

});

/* ==================================== */
/* CALCULATION */
/* ==================================== */

function calculate(){

    let type = parseInt(resistorType.value);

    let value = 0;
    let tol = 0;
    let temp = "-";

    if(type === 4){

        let d1 = colors[bandValues[0]].digit;
        let d2 = colors[bandValues[1]].digit;
        let mul = colors[bandValues[2]].multiplier;

        value = ((d1*10)+d2)*mul;

        tol = colors[bandValues[3]].tolerance;

        steps.innerHTML = `
            <div class="step-line">
                <strong>Band 1 (${bandValues[0]}):</strong>
                Digit = ${d1}
            </div>

            <div class="step-line">
                <strong>Band 2 (${bandValues[1]}):</strong>
                Digit = ${d2}
            </div>

            <div class="step-line">
                <strong>Band 3 (${bandValues[2]}):</strong>
                Multiplier = × ${mul}
            </div>

            <div class="step-line">
                <strong>Band 4 (${bandValues[3]}):</strong>
                Tolerance = ±${tol}%
            </div>

            <hr>

            <div class="step-line">
                Combine Digits:
                <strong>${d1}${d2}</strong>
            </div>

            <div class="step-line">
                Apply Multiplier:
                <strong>${d1}${d2} × ${mul}</strong>
            </div>

            <div class="step-line final-step">
                Final Resistance:
                <strong>${value} Ω</strong>
            </div>

            <div class="step-line final-step">
                Human Readable:
                <strong>${formatValue(value)} ±${tol}%</strong>
            </div>
        `;
    }

    if(type === 5 || type === 6){

        let d1 = colors[bandValues[0]].digit;
        let d2 = colors[bandValues[1]].digit;
        let d3 = colors[bandValues[2]].digit;

        let mul = colors[bandValues[3]].multiplier;

        value =
        ((d1*100)+(d2*10)+d3) * mul;

        tol = colors[bandValues[4]].tolerance;

        if(type === 6){

            temp =
            colors[bandValues[5]].temp + " ppm/K";

        }

        steps.innerHTML = `
            <div class="step-line">
                <strong>Band 1 (${bandValues[0]}):</strong>
                Digit = ${d1}
            </div>

            <div class="step-line">
                <strong>Band 2 (${bandValues[1]}):</strong>
                Digit = ${d2}
            </div>

            <div class="step-line">
                <strong>Band 3 (${bandValues[2]}):</strong>
                Digit = ${d3}
            </div>

            <div class="step-line">
                <strong>Band 4 (${bandValues[3]}):</strong>
                Multiplier = × ${mul}
            </div>

            <div class="step-line">
                <strong>Band 5 (${bandValues[4]}):</strong>
                Tolerance = ±${tol}%
            </div>

            ${type === 6 ? `
            <div class="step-line">
                <strong>Band 6 (${bandValues[5]}):</strong>
                Temp Coefficient = ${temp}
            </div>
            ` : ""}

            <hr>

            <div class="step-line">
                Combine Digits:
                <strong>${d1}${d2}${d3}</strong>
            </div>

            <div class="step-line">
                Apply Multiplier:
                <strong>${d1}${d2}${d3} × ${mul}</strong>
            </div>

            <div class="step-line final-step">
                Final Resistance:
                <strong>${value} Ω</strong>
            </div>

            <div class="step-line final-step">
                Human Readable:
                <strong>${formatValue(value)} ±${tol}%</strong>
            </div>
        `;
    }

    result.innerHTML =
    formatValue(value) + " ±" + tol + "%";

    ohms.innerHTML = value + " Ω";

    kilo.innerHTML =
    (value/1000).toFixed(2) + " kΩ";

    mega.innerHTML =
    (value/1000000).toFixed(2) + " MΩ";

    tolerance.innerHTML =
    "±" + tol + "%";

    tempCoeff.innerHTML = temp;

}

/* ==================================== */
/* VALUE FORMAT */
/* ==================================== */

function formatValue(value){

    if(value >= 1000000){
        return (value/1000000).toFixed(2) + " MΩ";
    }

    if(value >= 1000){
        return (value/1000).toFixed(2) + " kΩ";
    }

    return value + " Ω";

}

/* ==================================== */
/* RANDOM */
/* ==================================== */

document.getElementById("randomBtn")
.addEventListener("click",()=>{

    let keys = Object.keys(colors);

    for(let i=0;i<6;i++){

        bandValues[i] =
        keys[Math.floor(Math.random()*keys.length)];

    }

    createSelectors();

    calculate();

});

/* ==================================== */
/* RESET */
/* ==================================== */

document.getElementById("resetBtn")
.addEventListener("click",()=>{

    bandValues = [
        "red",
        "yellow",
        "brown",
        "gold",
        "brown",
        "red"
    ];

    createSelectors();

    calculate();

});

/* ==================================== */
/* COPY */
/* ==================================== */

document.getElementById("copyBtn")
.addEventListener("click",()=>{

    navigator.clipboard.writeText(
        result.innerText
    );

    alert("Copied!");

});

/* ==================================== */
/* THEME */
/* ==================================== */

document.getElementById("themeBtn")
.addEventListener("click",()=>{

    document.body.classList.toggle("light");

});

/* ==================================== */
/* TABLE */
/* ==================================== */

function createTable(){

    const table =
    document.getElementById("colorTable");

    table.innerHTML = "";

    for(let key in colors){

        table.innerHTML += `
        <tr>

            <td
            style="
            background:${colors[key].color};
            color:${key === "white" ? "black" : "white"}
            ">
                ${key}
            </td>

            <td>
                ${colors[key].digit ?? "-"}
            </td>

            <td>
                ${colors[key].multiplier}
            </td>

            <td>
                ${colors[key].tolerance ?? "-"}
            </td>

        </tr>
        `;
    }

}