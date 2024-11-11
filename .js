document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const playButton = document.getElementById('play-button');
    const resetButton = document.getElementById('reset-button');
    const modeButton = document.getElementById('mode-button');
    const alertMessage = document.getElementById('alert-message');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const modalButton = document.getElementById('modal-button');
    const playerTurn = document.getElementById('player-turn');
    const clickSound = document.getElementById('click-sound');
    let currentPlayer = 'X';
    let isGameActive = false;
    let isSinglePlayer = true;
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    modeButton.addEventListener('touchstart', () => {
        clickSound.play();
        if (!isGameActive) {
            isSinglePlayer = !isSinglePlayer;
            modeButton.textContent = isSinglePlayer ? 'Mode Solo' : 'Mode 2 Joueurs';
        }
    });

    playButton.addEventListener('touchstart', () => {
        clickSound.play();
        isGameActive = true;
        playButton.style.display = 'none';
        updatePlayerTurn();
    });

    cells.forEach(cell => {
        cell.addEventListener('touchstart', (event) => {
            if (isGameActive && cell.textContent === '' && (currentPlayer === 'X' || (!isSinglePlayer && currentPlayer === 'O'))) {
                cell.textContent = currentPlayer;
                cell.classList.add(currentPlayer.toLowerCase());
                clickSound.play();
                cell.style.transition = 'border-radius 0ms ease-in-out'; 
                cell.style.borderRadius = '50%'; 
                if (checkWin(currentPlayer)) {
                    setTimeout(() => {
                        showModal(`${currentPlayer} gagne!`, currentPlayer);
                        highlightWinningCells(currentPlayer);
                        resetButton.style.display = 'block';
                        alertMessage.textContent = `${currentPlayer} a gagné!`;
                        alertMessage.className = currentPlayer.toLowerCase();
                        alertMessage.style.display = 'block';
                        playerTurn.style.display = 'none';
                    }, 100);
                } else if (isDraw()) {
                    setTimeout(() => {
                        showModal('Égalité!', 'draw');
                        resetButton.style.display = 'block';
                        alertMessage.textContent = 'Match nul!';
                        alertMessage.className = 'draw';
                        alertMessage.style.display = 'block';
                        playerTurn.style.display = 'none';
                    }, 100);
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    updatePlayerTurn();
                    if (isSinglePlayer && currentPlayer === 'O') {
                        setTimeout(botMove, 919);
                        function disablePlayerXClicks() {
                            if (currentPlayer === 'O') {
                                cells.forEach(cell => {
                                    cell.style.pointerEvent = 'auto';
                                });
                            }
                        }
                        function enablePlayerXClicks() {
                            if (currentPlayer === 'X') {
                                cells.forEach(cell => {
                                    cell.style.pointerEvents = 'auto';
                                })
                            }
                        }
                    }
                }
            }
        });
        cell.addEventListener('touchend', (event) => {
            if (cell.classList.contains(currentPlayer.toLowerCase())) {
                cell.style.transition = 'border-radius 0.3s ease-in-out';
                cell.style.borderRadius = '0'; 
            }
        });
    });

    resetButton.addEventListener('touchstart', () => {
        clickSound.play();
        resetGame();
    });

    modalButton.addEventListener('touchstart', () => {
        clickSound.play();
        resetGame();
        hideModal();
    });

    function botMove() {
        const emptyCells = [...cells].filter(cell => cell.textContent === '');

        for (let cell of emptyCells) {
            cell.textContent = 'O';
            if (checkWin('O')) {
                finalizeMove(cell, 'O');
                return;
            }
            cell.textContent = '';
        }

        for (let cell of emptyCells) {
            cell.textContent = 'X';
            if (checkWin('X')) {
                cell.textContent = 'O';
                finalizeMove(cell, 'O');
                return;
            }
            cell.textContent = '';
        }

        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        finalizeMove(randomCell, 'O');
    }

    function finalizeMove(cell, player) {
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        clickSound.play();
        if (checkWin(player)) {
            setTimeout(() => {
                showModal(`${player} gagne!`, player);
                highlightWinningCells(player);
                resetButton.style.display = 'block';
                alertMessage.textContent = `${player} a gagné!`;
                alertMessage.className = player.toLowerCase();
                alertMessage.style.display = 'block';
                playerTurn.style.display = 'none';
            }, 100);
        } else if (isDraw()) {
            setTimeout(() => {
                showModal('Égalité!', 'draw');
                resetButton.style.display = 'block';
                alertMessage.textContent = 'Match nul!';
                alertMessage.className = 'draw';
                alertMessage.style.display = 'block';
                playerTurn.style.display = 'none';
            }, 100);
        } else {
            currentPlayer = 'X';
            updatePlayerTurn();
        }
    }

    function checkWin(player) {
        return winningCombinations.some(combination => {
            return combination.every(index => cells[index].textContent === player);
        });
    }

    function isDraw() {
        return [...cells].every(cell => cell.textContent !== '');
    }

    function resetGame() {
        isGameActive = false;
        setTimeout(() => {
            cells.forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('x', 'o', 'winning-cell');
                cell.style.borderRadius = '0';
            });
            currentPlayer = 'X';
            playButton.style.display = 'block';
            resetButton.style.display = 'none';
            alertMessage.style.display = 'none';
            playerTurn.style.display = 'block';
            playerTurn.textContent = '';
        }, 100);
    }

    function showModal(message, type) {
        modalMessage.textContent = message;
        modalMessage.style.fontSize = '3em';
        playerTurn.style.display = 'none';
        if (type === 'X') {
            modalMessage.style.color = 'rgb(255, 64, 0)';
        } else if (type === 'O') {
            modalMessage.style.color = 'rgb(2, 210, 72)';
        } else if (type === 'draw') {
            modalMessage.style.background = 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)';
            modalMessage.style.BackgroundClip = 'text';
            modalMessage.style.color = 'transparent';
        }
        modal.classList.add('show');
    }

    function hideModal() {
        modal.classList.remove('show');
    }

    function updatePlayerTurn() {
        playerTurn.textContent = `tour du joueur ${currentPlayer}`;
        if (currentPlayer === 'X') {
            playerTurn.style.color = 'rgb(255, 64, 0)';
        } else {
            playerTurn.style.color = 'rgb(2, 210, 72)';
        }
    }

    function highlightWinningCells(player) {
        winningCombinations.forEach(combination => {
            if (combination.every(index => cells[index].textContent === player)) {
                combination.forEach(index => {
                    cells[index].classList.add('winning-cell', player.toLowerCase());
                });
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.flame-emoji').forEach(particle => {
        let directionX = Math.random() < 0.5 ? 1 : -1;
        let directionY = Math.random() < 0.5 ? 1 : -1;
        let speedX = (Math.random() * 2) + 1;
        let speedY = (Math.random() * 2) + 1;
        let x = Math.random() * (window.innerWidth - 60);
        let y = Math.random() * (window.innerHeight - 60);

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        let isDragging = false;
        let offsetX, offsetY;

        particle.addEventListener('touchstart', (e) => {
            isDragging = true;
            const touch = e.touches[0];
            offsetX = touch.clientX - particle.getBoundingClientRect().left;
            offsetY = touch.clientY - particle.getBoundingClientRect().top;
            particle.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const touch = e.touches[0];
                x = touch.clientX - offsetX;
                y = touch.clientY - offsetY;
                x = Math.max(0, Math.min(window.innerWidth - 60, x));
                y = Math.max(0, Math.min(window.innerHeight - 60, y));
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
            }
            e.preventDfault();
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
            particle.style.cursor = 'grab';
        });

        document.addEventListener('touchcancel', () => {
            isDragging = false;
            particle.style.cursor = 'grab';
        });

        function moveParticle() {
            if (!isDragging) {
                if (x + 60 > window.innerWidth) {
                    directionX *= -1;
                    x = window.innerWidth - 60;
                } else if (x < 0) {
                    directionX *= -1;
                    x = 0;
                }

                if (y + 60 > window.innerHeight) {
                    directionY *= -1;
                    y = window.innerHeight - 60;
                } else if (y < 0) {
                    directionY *= -1;
                    y = 0;
                }

                x += directionX * speedX;
                y += directionY * speedY;

                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
            }

            requestAnimationFrame(moveParticle);
        }

        moveParticle();
    });
});