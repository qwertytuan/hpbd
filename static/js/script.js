document.addEventListener("DOMContentLoaded", function () {
    const cakesContainer = document.getElementById("cakes-container");

    function createCake() {
        const cake = document.createElement("img");
        cake.classList.add("cake-icon");
        cake.src = "/static/images/cake.svg";

        const randomX = Math.random() * (window.innerWidth - 80); // 80 is the width of the cake icon
        cake.style.position = "absolute";
        cake.style.left = `${randomX}px`;
        cake.style.top = "100vh"; // Start from the bottom of the viewport
        cakesContainer.appendChild(cake);
        setTimeout(() => {
            removeCake(cake);
        }, 100);

    }

    function removeCake(cake) {
        cake.style.animation = "transform 5s ease-in-out";
        // cake.style.transform = "translateY(-100vh)";
        cake.addEventListener("animationend", () => {
            cakesContainer.removeChild(cake);
        });
    }

    // Create a new cake every 100 milliseconds
    setInterval(createCake, 300);
    createCake(); // Create the initial cake

});

function openBox(boxId) {
    const boxList = document.getElementById('box-list');
    const box = document.getElementById('box' + boxId);
    if (box && box.parentElement) {
        boxList.removeChild(box.parentElement); // Remove the parent <li> element
        openedBoxes++; // Increment the click count
        showModal(openedBoxes); // Pass click count instead of boxId
        createConfetti();

        // Check if all boxes are opened
        if (openedBoxes === totalBoxes) {
            allBoxesOpened = true;
        }
    }
}

function createModal(type, boxId = null) {
    // Remove any existing modal
    removeModal();

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';

    if (type === 'special') {
        modal.id = 'specialBoxModal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2 class="modal-title">🎁 GIẢI ĐẶC BIỆT 🎁</h2>
                <div class="special-content">
                    <h3 style="color: #ffdd44; margin: 20px 0;">Bạn đã nhận được phần quà đặc biệt!</h3>
                    <p class="modal-message">Một phần quà bí mật đang đợi chờ bạn khám phá! 🌟</p>
                    <div class="special-message">
                        <p style="font-style: italic; color: #3914dfff; font-size: 1.1em;">
                            "Món quà sẽ sớm được gửi đến bạn!" 💖
                        </p>
                        <img src="/static/images/how-yus-s2-feels-like-v0-kmss0znhzkdf1.webp" width="400px" height="200px">
                    </div>
                </div>
                <button class="close-btn special-btn" onclick="closeModal()">Ố dề!</button>
            </div>
        `;
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });

    } else if (type === 'regular1') {
        modal.id = 'boxModal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2 class="modal-title">Ôi không!</h2>
                <img class="modal-cake" src="/static/images/cake.svg" alt="Cake">
                <p class="modal-message">Hộp quà này không chưa phần quà nào cả.</p>
                <p class="modal-message">Chúc bạn may mắn lần sau! </p>
                <button class="close-btn" onclick="closeModal()">Đóng</button>
            </div>
        `;
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });}

    else if (type === 'regular2') {
        modal.id = 'boxModal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2 class="modal-title">🎉 XIN CHÚC MỪNG! 🎉</h2>
                <img class="modal-cake" src="/static/images/cake.svg" alt="Cake">
                <p class="modal-message">Bạn đã mở được phần quà</p>
                <p class="modal-message">Một thẻ điện thoại mệnh giá 5 tỏi!</p>
                <div style="margin-top: 20px;">
                    <input type="email" id="emailInput" placeholder="Nhập email để nhận quà" style="padding: 10px; border-radius: 5px; border: 1px solid #ddd; margin-right: 10px; width: 250px;">
                    <button onclick="sendEmailNotification()" id="sendEmailBtn" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Gửi</button>
                </div>
                <button title="Click de dong(sau khi gui email)" class="close-btn" id="regular2CloseBtn" onclick="closeModal()" disabled style="opacity: 0.5; cursor: not-allowed;">Ố dề!</button>
            </div>
        `;
    } else if (type === 'allBoxes') {
        modal.id = 'allBoxesModal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2 class="modal-title">🎊 Amazing good job! 🎊</h2>
                <img class="modal-cake" src="/static/images/cake.svg" alt="Cake">
                <p class="modal-message">Phần quà sẽ sớm được gửi về địa chỉ của bạn</p>
                <p class="modal-message">Mừng ngày chị già thêm 1 tuổi!!! </p>
                <p class="modal-message">Sinh nhật zui zẻ! 🎂🎈</p>
            </div>
        `;
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Add click outside to close functionality


    document.body.appendChild(modal);
    return modal;
}

function sendEmailNotification() {
    const emailInput = document.getElementById('emailInput');
    document.getElementById('sendEmailBtn').disabled = true;
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Vui lòng nhập địa chỉ email!');
        document.getElementById('sendEmailBtn').disabled = false;
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Vui lòng nhập địa chỉ email hợp lệ!');
        document.getElementById('sendEmailBtn').disabled = false;
        return;
    }
    
    // Send email via Flask backend
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            subject: 'Chúc mừng sinh nhật! 🎉'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Email đã được gửi thành công! Kiểm tra hộp thư của bạn.');
            emailInput.value = '';
            document.getElementById('regular2CloseBtn').disabled = false;
            document.getElementById('regular2CloseBtn').style.opacity = 1;
            document.getElementById('regular2CloseBtn').style.cursor = 'pointer';
            document.getElementById('sendEmailBtn').disabled = true
        } else {
            alert('Có lỗi xảy ra khi gửi email: ' + data.message);
            document.getElementById('sendEmailBtn').disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi gửi email.');
        document.getElementById('sendEmailBtn').disabled = false;
    });
}

function showModal(clickOrder) {
    if (clickOrder == totalBoxes) {
        // Show special modal for last click
        createModal('special');
        // Create extra special confetti for last click
        createSpecialConfetti();
    } else if (clickOrder == 1) {
        createModal('regular1', clickOrder);
    }
    else {
        // Show regular modal for other clicks
        createModal('regular2', clickOrder);
    }
}
function showAllBoxesModal() {
    createModal('allBoxes');
    createConfetti();
}

function removeModal() {
    const existingModals = document.querySelectorAll('.modal');
    existingModals.forEach(modal => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    });
}
function closeModal() {
    removeModal();
    clearConfetti();

    // Check if all boxes have been opened and show the final modal
    if (allBoxesOpened) {
        allBoxesOpened = false; // Reset flag so it only shows once
        setTimeout(() => {
            showAllBoxesModal();
        }, 500); // Small delay for better UX
    }
}
function createConfetti() {
    const colors = ['#ffdd44', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#f38ba8', '#a6e3a1'];
    const confettiContainer = document.body;

    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';

            // Random size
            const size = Math.random() * 6 + 4;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';

            confettiContainer.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 4000);
        }, i * 50);
    }
}

function createSpecialConfetti() {
    const goldColors = ['#ffdd44', '#ffd700', '#ffed4e', '#fff176', '#ffecb3'];
    const confettiContainer = document.body;

    // Create 100 golden confetti pieces for the special box
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = goldColors[Math.floor(Math.random() * goldColors.length)];
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.animationDelay = Math.random() * 0.3 + 's';

            // Larger size for special confetti
            const size = Math.random() * 8 + 6;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';

            // Add golden glow effect
            confetti.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
            confetti.style.borderRadius = '50%';

            confettiContainer.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }, i * 30);
    }
}

function getOrdinalNumber(num) {
    const ordinals = {
        1: '1st',
        2: '2nd',
        3: '3rd'
    };
    return ordinals[num] || `${num}th`;
}

function clearConfetti() {
    const confettiElements = document.querySelectorAll('.confetti');
    confettiElements.forEach(confetti => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    });
}


// Call this function after opening a box to check if all boxes are opened
let openedBoxes = 0;
let totalBoxes = 3;
let allBoxesOpened = false;

document.addEventListener("DOMContentLoaded", function () {
    // Create boxes first
    CreateBoxes();

    const boxItems = document.querySelectorAll('#box-list li');
    totalBoxes = boxItems.length;
});

function CreateBoxes() {
    // Create an array of box numbers and shuffle it
    const boxNumbers = [1, 2, 3];
    // for (let i = boxNumbers.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [boxNumbers[i], boxNumbers[j]] = [boxNumbers[j], boxNumbers[i]];
    // }

    // Create boxes in random order
    for (let i = 0; i < boxNumbers.length; i++) {
        const num = boxNumbers[i];
        const boxItem = document.createElement('li');
        boxItem.className = 'box-item';
        boxItem.innerHTML = `<a class="mouse-hover" id="box${num}" onclick="openBox(${num})"><img src="/static/images/box.webp" alt="" class="luck-box"></a>`;
        document.getElementById('box-list').appendChild(boxItem);
    }
}