const searchForm: HTMLFormElement = document.querySelector(
  "form"
) as HTMLFormElement;

const BASE_URL: string = "https://nbaserver-q21u.onrender.com/api/filter";

enum Status {
  PG = "PG",
  SG = "SG",
  SF = "SF",
  PF = "PF",
  C = "C",
}
interface Player {
  playerName?: String;
  position: Status;
  twoPercent: number;
  threePercent: number;
  points: number;
}

async function GETPlayers(searchDetails: Player): Promise<Player[]> {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchDetails),
    });

    if (!response.ok) {
      throw new Error("network error");
    }
    const Players: Player[] = await response.json();
    console.log(Players);
    return Players;
  } catch (error: any) {
    console.log(error);
    return [];
  }
}

async function refreshTable(event: Event): Promise<void> {
  const tableBody: HTMLTableElement = document.querySelector(
    "table > tbody"
  ) as HTMLTableElement;
  tableBody.innerHTML = "";

  const form: HTMLFormElement = event.target as HTMLFormElement;
  const searchDetails: Player = {
    position: form["position"].value,
    twoPercent: form["FG"].value,
    threePercent: form["3P"].value,
    points: form["points"].value,
  };
  console.log(searchDetails);

  const players: Player[] = await GETPlayers(searchDetails);
  players.forEach((player: Player) => {
    const newRow: HTMLTableRowElement = createPlayerElements(player);
    tableBody.append(newRow);
  });
}
function createPlayerElements(player: Player): HTMLTableRowElement {
  const newRow: HTMLTableRowElement = document.createElement("tr");

  const playerName: HTMLTableCellElement = document.createElement("td");
  const Position: HTMLTableCellElement = document.createElement("td");
  const Points: HTMLTableCellElement = document.createElement("td");
  const twoPercent: HTMLTableCellElement = document.createElement("td");
  const threePercent: HTMLTableCellElement = document.createElement("td");

  playerName.innerText = player.playerName as string;
  Position.innerText = player.position;
  Points.innerText = player.points.toString();
  twoPercent.innerText = player.twoPercent.toString();
  threePercent.innerText = player.threePercent.toString();

  const action: HTMLButtonElement = createAction(player);
  action.classList.add("action");

  newRow.append(playerName, Position, Points, twoPercent, threePercent, action);
  return newRow;
}
function createAction(player: Player): HTMLButtonElement {
  const addButton: HTMLButtonElement = document.createElement("button");

  const playerFirstName: string = (player.playerName as string).split(" ")[0];
  addButton.textContent = `add ${playerFirstName} to Current Team`;

  addButton.addEventListener("click", () => addDetailsToTeam(player));

  return addButton;
}

function createDetails(player: Player): HTMLDivElement[] {
  const playerName: HTMLDivElement = document.createElement("div");
  const Points: HTMLDivElement = document.createElement("div");
  const twoPercent: HTMLDivElement = document.createElement("div");
  const threePercent: HTMLDivElement = document.createElement("div");

  playerName.innerText = `${player.playerName}`;
  threePercent.innerText = `Three Percents : ${player.threePercent}%`;
  twoPercent.innerText = `Two Percents : ${player.twoPercent}%`;
  Points.innerText = `Points : ${player.points}`;

  return [playerName, Points, twoPercent, threePercent];
}
function addDetailsToTeam(player: Player): void {
  const details: HTMLDivElement[] = createDetails(player);
  const divElement: HTMLDivElement = document.querySelector(
    `#${player.position} > .details`
  ) as HTMLDivElement;
  divElement.innerHTML = "";
  details.forEach((detail) => {
    divElement.append(detail);
  });
}

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await refreshTable(event);
});
window.onload = () => {
  const sliders = document.getElementsByTagName(
    "input"
  ) as HTMLCollectionOf<HTMLInputElement>;

  for (let i = 0; i < 3; i++) {
    sliders[i].addEventListener("input", () => {
      const theBlackLabel: HTMLSpanElement = sliders[
        i
      ].parentElement?.querySelector(".slider-label") as HTMLSpanElement;
      theBlackLabel.textContent = sliders[i].value.toString();
      sliders[i].title = sliders[i].value.toString();
    });
  }
};
