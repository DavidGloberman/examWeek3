"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const searchForm = document.querySelector("form");
const BASE_URL = "https://nbaserver-q21u.onrender.com/api/filter";
var Status;
(function (Status) {
    Status["PG"] = "PG";
    Status["SG"] = "SG";
    Status["SF"] = "SF";
    Status["PF"] = "PF";
    Status["C"] = "C";
})(Status || (Status = {}));
function GETPlayers(searchDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(searchDetails),
            });
            if (!response.ok) {
                throw new Error("network error");
            }
            const Players = yield response.json();
            console.log(Players);
            return Players;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    });
}
function refreshTable(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const tableBody = document.querySelector("table > tbody");
        tableBody.innerHTML = "";
        const form = event.target;
        const searchDetails = {
            position: form["position"].value,
            twoPercent: form["FG"].value,
            threePercent: form["3P"].value,
            points: form["points"].value,
        };
        console.log(searchDetails);
        const players = yield GETPlayers(searchDetails);
        players.forEach((player) => {
            const newRow = createPlayerElements(player);
            tableBody.append(newRow);
        });
    });
}
function createPlayerElements(player) {
    const newRow = document.createElement("tr");
    const playerName = document.createElement("td");
    const Position = document.createElement("td");
    const Points = document.createElement("td");
    const twoPercent = document.createElement("td");
    const threePercent = document.createElement("td");
    playerName.innerText = player.playerName;
    Position.innerText = player.position;
    Points.innerText = player.points.toString();
    twoPercent.innerText = player.twoPercent.toString();
    threePercent.innerText = player.threePercent.toString();
    const action = createAction(player);
    action.classList.add("action");
    newRow.append(playerName, Position, Points, twoPercent, threePercent, action);
    return newRow;
}
function createAction(player) {
    const addButton = document.createElement("button");
    const playerFirstName = player.playerName.split(" ")[0];
    addButton.textContent = `add ${playerFirstName} to Current Team`;
    addButton.addEventListener("click", () => addDetailsToTeam(player));
    return addButton;
}
function createDetails(player) {
    const playerName = document.createElement("div");
    const Points = document.createElement("div");
    const twoPercent = document.createElement("div");
    const threePercent = document.createElement("div");
    playerName.innerText = `${player.playerName}`;
    threePercent.innerText = `Three Percents : ${player.threePercent}%`;
    twoPercent.innerText = `Two Percents : ${player.twoPercent}%`;
    Points.innerText = `Points : ${player.points}`;
    return [playerName, Points, twoPercent, threePercent];
}
function addDetailsToTeam(player) {
    const details = createDetails(player);
    const divElement = document.querySelector(`#${player.position} > .details`);
    divElement.innerHTML = "";
    details.forEach((detail) => {
        divElement.append(detail);
    });
}
searchForm.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    yield refreshTable(event);
}));
window.onload = () => {
    const sliders = document.getElementsByTagName("input");
    for (let i = 0; i < 3; i++) {
        sliders[i].addEventListener("input", () => {
            var _a;
            const theBlackLabel = (_a = sliders[i].parentElement) === null || _a === void 0 ? void 0 : _a.querySelector(".slider-label");
            theBlackLabel.textContent = sliders[i].value.toString();
            sliders[i].title = sliders[i].value.toString();
        });
    }
};
