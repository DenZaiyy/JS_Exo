function shuffleChildren(parent) { //function générale utilisé pour mélanger les différentes box crée
    let children = parent.children
    let i = children.length, k, temp
    while (--i > 0) {
        k = Math.floor(Math.random() * (i + 1))
        temp = children[k]
        children[k] = board.children[i]
        parent.appendChild(temp)
    }
}

function showReaction(type, clickedBox) { //function qui permet d'ajouter une class a la box cliquer pour chaque évenement (success, error, notice)
    clickedBox.classList.add(type)
    if (type !== "success") { //si le type n'est pas success on crée un timeout pour enlever la classe ajouté
        setTimeout(function () {
            clickedBox.classList.remove(type)
        }, 800)
    }
}

function displayTimer() { //fuction qui crée le timer utilisé pour chronométrer le temps pour l'exercice
    milliseconds += 10;
    if (milliseconds == 1000) { //si la valeur de milliseconds est = à 1000 on incrémente la valeur de seconde
        milliseconds = 0;
        seconds++;
        if (seconds == 60) { //si la valeur de seconds est = à 60 on incrément la valeur de minutes
            seconds = 0;
            minutes++;
        }
    }
    let m = minutes < 10 ? "0" + minutes : minutes; //on définit l'unité des minutes
    let s = seconds < 10 ? "0" + seconds : seconds; //on définit l'unité des seconds
    let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds; //on définit l'unité des milliseconds

    timerRef.innerHTML = `${m}:${s}:${ms}`; //on structure notre timer
}

function startTimer() { //function qui permet de lancer le timer
    if (int !== null) {
        clearInterval(int);
    }
    int = setInterval(displayTimer, 10);
}

function resetTimer() { //function qui permet de réinitialiser le timer
    setTimeout(function () {
        shuffleChildren(board)
        if (int !== null) {
            clearInterval(int);
            [milliseconds, seconds, minutes] = [0, 0, 0];
            timerRef.innerHTML = '00 : 00 : 000';
        }
        int = setInterval(displayTimer, 10);
    }, 800);
}

function resetScore() { //function qui permet de supprimer les scores stocker dans le navigateur
    localStorage.clear()
}

function setMostRecentScore() {
    const highScores = JSON.parse(localStorage.getItem("highScores")) || []

    if (highScores !== null) {
        const highScoresList = document.getElementById('highScoresList')

        highScoresList.innerHTML = highScores.map(score => {
            return `<li class="high-score"> ${score.username} (${score.nmb_Box} boxs) - ${score.time}</li>`
        })
            .join("")
    }
}

let [milliseconds, seconds, minutes] = [0, 0, 0] //variable pour la disposition du timer
let timerRef = document.querySelector('.timer') //variable qui permet de sélectionner l'élement HTML qui contient la class "timer"
let int = null //varible indiquant la valeur par défaut de "int" en null

const box = document.createElement("div") //constance qui crée un élement div
box.classList.add("box") //on ajoute la class "box" a l'élement crée

const board = document.querySelector("#board") //constance qui sélectionne la div avec l'id #board

let nb = 1 //défini le nombre par défaut pour l'exercice (1)

let aNumber = Number(window.prompt("Veuillez choisir le nombre de boîte avant de commencez votre partie :", "")) //variable pour permettre à l'utilisateur de choisir le nombre de box à crée pour faire le mini-jeux !

var spanSuccess = document.createElement("span") //variable qui sélectionne l'élement span avec l'id #validate_exo

const btnSaveTimer = document.createElement("button") //constance pour crée un élément button

const inputText = document.createElement("input") //constance pour crée un élément input de type "text"

for (let i = 1; i <= aNumber; i++) { //boucle qui permet de clone le nombre de box choisir par l'utilisateur à l'aide de la varibable "aNumber"
    let newbox = box.cloneNode() //variable qui indique que newbox créera le clone de la première box
    newbox.innerText = i //indique le chiffre sur la box crée
    board.appendChild(newbox) //indique l'emplacement des box dans le html (sera placé dans la div avec l'id #board)

    newbox.addEventListener("click", function () { //ajoute un évenement au clique d'une des box
        if (i == nb) { //vérifie si la box correspond à la suite des chiffres
            newbox.classList.add("box-valid") //si c'est le cas, on ajoute la class box-valid à la box cliqué

            if (nb == board.children.length) { //on vérifie si le nombre de box crée ont toutes été cliqués
                board.querySelectorAll(".box").forEach(function (box) { //si oui, on sélectionne toute les box crée auparavant
                    showReaction("success", box) //puis on lui ajoute la réaction success pour lui changer son style et réussir à le différencier
                    clearInterval(int); //dès que la dernière box a été cliquer et que c'est juste, le timer s'arrêtera automatiquement afin de garder le temp exact
                })

                if (timerRef !== null) {
                    btnSaveTimer.id = "saveTimer" //indique l'id saveTimer au button SaveTimer
                    btnSaveTimer.innerText = "Save current timer" //indique le texte sur le button
                    document.getElementById("btn").appendChild(btnSaveTimer) //choisit l'emplacement du button, pour ce cas on le placera dans la div avec l'id #btn après le button existant
                    btnSaveTimer.style = "display: block;"

                    inputText.setAttribute("type", "text")
                    inputText.id = "username" //indique l'id username a l'input crée auparavant
                    inputText.placeholder = "Username" //indique le placeholder
                    document.getElementById("inputs").appendChild(inputText) //indique l'emplacement de l'input, donc dans la div avec l'id #inputs
                    inputText.style = "display: block;"

                    document.getElementById('saveTimer').addEventListener('click', () => { //Crée un évenement au clique du button avec l'id #saveTimer

                        const highScores = JSON.parse(localStorage.getItem("highScores")) || []

                        var nbBox = aNumber
                        var userName = document.querySelector("#username").value
                        var mostRecentTimer = timerRef.innerText

                        var lastScore = {
                            username: userName,
                            nmb_Box: nbBox,
                            time: mostRecentTimer
                        }

                        highScores.push(lastScore)
                        highScores.sort((a, b) => b.lastScore - a.lastScore)
                        highScores.splice(10)

                        localStorage.setItem('highScores', JSON.stringify(highScores))
                        setMostRecentScore()
                    })
                }

                spanSuccess.classList.add("span_success") //on ajoute la class "span_success"
                spanSuccess.id = "validate_exo"
                spanSuccess.innerText = "Bravo, vous avez réussi l'exercice !" //Indique le message quand la personne aura réussi l'exercice
                document.getElementById("contain-box").appendChild(spanSuccess)
            }
            shuffleChildren(board) //on rappelle la function shuffleChildren pour re-mélanger les box a chaque clique de box afin de perturbé la mémoire visuelle
            nb++ //incrémente le chiffre de la variable "nb" a chaque clique sur une box (juste)
        }
        else if (i > nb) { //on vérifie si le chiffre de la box est supérieur a la variable "nb" qui contient un nombre
            showReaction("error", newbox) //si la box cliquer est au dessus du nombre attendu, on lui met une réaction 'error' pour mettre la box en rouge (pour faire comprendre à l'utilisateur qu'il as fait une erreur)
            nb = 1
            board.querySelectorAll(".box-valid").forEach(function (validBox) { //on sélectionne toute les box contenant la class ".box-valid" pour pouvoir la retirer et pouvoir recommencer l'exercice
                validBox.classList.remove("box-valid")
            })

            resetTimer() //appelle de la fonction resetTimer
        }
        else { //si ce n'est pas un success ou une erreur, on indique à la personne si la box a déjà été cliquer en lui mettant un style différent au clique (notice)
            showReaction("notice", newbox)
        }
    })
}

shuffleChildren(board)

document.addEventListener('DOMContentLoaded', function () { //Ajout d'un événement au chargement de la page
    startTimer()
    setMostRecentScore()
})

document.getElementById('resetGame').addEventListener('click', () => { //Ajout d'un évenement au clique du button avec l'id "resetTimer"
    location.reload()
})

document.querySelector('#resetScore').addEventListener('click', () => { //Ajout d'un événement au clique du button avec l'id "resetScore"
    alert('Score has been successfully reset!')
    resetScore()
})