document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game');
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

    cells.forEach(cell => {
        cell.style.display = 'none';
        if (cell.style.display === 'none') {
            cell.zIndex = 0;
        };
    });

    modeButton.addEventListener('click', () => {
        clickSound.play();
        if (!isGameActive) {
            isSinglePlayer = !isSinglePlayer;
            modeButton.textContent = isSinglePlayer ? 'Mode Solo' : 'Mode 2 Joueurs';
        }
    });

    playButton.addEventListener('click', () => {
        clickSound.play();
        isGameActive = true;
        playButton.style.display = 'none';
        modeButton.style.display = 'none';
        cells.forEach(cell => {
            cell.style.display = 'flex';
            if (cell.style.display === 'flex') {
                cell.zIndex = 2;
            };
        });
        updatePlayerTurn();
    });

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (isGameActive && cell.textContent === '' && (currentPlayer === 'X' || (!isSinglePlayer && currentPlayer === 'O'))) {
                cell.textContent = currentPlayer;
                cell.classList.add(currentPlayer.toLowerCase());
                clickSound.play();
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
                        cells.forEach(cell => {
                            cell.style.opacity = '0.73';
                        });
                    }, 100);
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    updatePlayerTurn();
                    if (isSinglePlayer && currentPlayer === 'O') {
                        setTimeout(botMove, 919);
                    }
                }
            }
        });
    });

    resetButton.addEventListener('click', () => {
        clickSound.play();
        resetGame();
    });

    modalButton.addEventListener('click', () => {
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
                cells.forEach(cell => {
                    cell.style.opacity = '0.73';
                });
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
                cell.style.opacity = '0.96';
                cell.style.display = 'none';
                if (cell.style.display === 'none') {
                    cell.zIndex = 0;
                };
            });
            currentPlayer = 'X';
            playButton.style.display = 'block';
            modeButton.style.display = 'block';
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
            alertMessage.className = 'x';
        } else if (type === 'O') {
            alertMessage.className = 'o';
        } else if (type === 'draw') {
            alertMessage.className = 'draw';
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

document.querySelectorAll('.flame-emoji').forEach(particle => {
    let directionX = Math.random() < 0.5 ? 1 : -1;
    let directionY = Math.random() < 0.5 ? 1 : -1;
    let initialSpeedX = (Math.random() * 2) + 1;
    let initialSpeedY = (Math.random() * 2) + 1;
    let speedX = initialSpeedX;
    let speedY = initialSpeedY;
    let x = Math.random() * (window.innerWidth - 60);
    let y = Math.random() * (window.innerHeight - 60);
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    let isDragging = false;
    let offsetX, offsetY;
    let initialX, initialY, finalX, finalY;

    const handleStart = (e) => {
        isDragging = true;
        let touch = e.touches ? e.touches[0] : e;
        offsetX = touch.clientX - particle.getBoundingClientRect().left;
        offsetY = touch.clientY - particle.getBoundingClientRect().top;
        initialX = touch.clientX;
        initialY = touch.clientY;
        particle.style.cursor = 'grabbing';
    };

    const handleMove = (e) => {
        if (isDragging) {
            let touch = e.touches ? e.touches[0] : e;
            x = touch.clientX - offsetX;
            y = touch.clientY - offsetY;
            x = Math.max(0, Math.min(window.innerWidth - 60, x));
            y = Math.max(0, Math.min(window.innerHeight - 60, y));
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
        }
    };

    const handleEnd = (e) => {
        if (isDragging) {
            isDragging = false;
            let touch = e.changedTouches ? e.changedTouches[0] : e;
            finalX = touch.clientX;
            finalY = touch.clientY;
            directionX = finalX - initialX > 0 ? 1 : -1;
            directionY = finalY - initialY > 0 ? 1 : -1;
            speedX = Math.abs(finalX - initialX) / 10;
            speedY = Math.abs(finalY - initialY) / 10;
            particle.style.cursor = 'grab';
            x = initialX;
            y = initialY;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            setTimeout(() => {
                let intervalId = setInterval(() => {
                    if (speedX > initialSpeedX) {
                        speedX -= 0.05;
                    } else {
                        speedX = initialSpeedX;
                    }

                    if (speedY > initialSpeedY) {
                        speedY -= 0.05;
                    } else {
                        speedY = initialSpeedY;
                    }

                    if (speedX === initialSpeedX && speedY === initialSpeedY) {
                        clearInterval(intervalId);
                    }
                }, 50);
            }, 1453); 
        }
    };

    particle.addEventListener('mousedown', handleStart);
    particle.addEventListener('touchstart', handleStart);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove);

    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

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
