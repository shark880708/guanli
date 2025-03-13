// 保存卡片数据到 localStorage
function saveCards(cards) {
    localStorage.setItem('dashboardCards', JSON.stringify(cards));
}

// 从 localStorage 加载卡片数据
function loadCards() {
    const cards = localStorage.getItem('dashboardCards');
    return cards ? JSON.parse(cards) : [];
}

// 清除所有卡片数据
function clearAllCards() {
    localStorage.removeItem('dashboardCards');
    localStorage.removeItem('deletedDefaultCards');
}

// 初始化加载卡片
function initializeCards() {
    const customCards = loadCards();
    const dashboard = document.querySelector('.dashboard');
    
    // 清空现有卡片
    dashboard.innerHTML = '';

    // 添加自定义卡片
    customCards.forEach(card => {
        const cardElement = createCardElement(card);
        dashboard.appendChild(cardElement);
    });

    // 添加"添加新卡片"按钮
    const addCardButton = document.createElement('div');
    addCardButton.className = 'card add-card';
    addCardButton.onclick = showAddCardForm;
    addCardButton.innerHTML = `
        <div class="card-body">
            <div class="add-icon">+</div>
            <p>添加新卡片</p>
        </div>
    `;
    dashboard.appendChild(addCardButton);
}

// 页面加载时初始化卡片
document.addEventListener('DOMContentLoaded', initializeCards);

// 删除卡片
function deleteCard(cardId) {
    if (cardId.startsWith('default-')) {
        // 如果是默认卡片，将其添加到已删除列表
        saveDeletedDefaultCards(cardId);
    } else {
        // 如果是自定义卡片，从 localStorage 中移除
        const cards = loadCards();
        const updatedCards = cards.filter(card => card.id !== cardId);
        saveCards(updatedCards);
    }
    
    // 从页面中移除卡片元素
    const cardElement = document.querySelector(`[data-id="${cardId}"]`);
    if (cardElement) {
        cardElement.remove();
    }
}

// 创建卡片元素
function createCardElement(cardData) {
    const newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.dataset.id = cardData.id;
    newCard.innerHTML = `
        <div class="card-header">
            <h3>${cardData.title}</h3>
            <button class="delete-btn" onclick="confirmDelete('${cardData.id}')">×</button>
        </div>
        <a href="${cardData.link}" style="text-decoration: none; color: inherit;">
            <div class="card-body">
                <h2>${cardData.value}</h2>
                <p>${cardData.description}</p>
            </div>
        </a>
    `;
    return newCard;
}

// 确认删除
function confirmDelete(cardId) {
    if (confirm('确定要删除这个卡片吗？')) {
        deleteCard(cardId);
    }
}

function showAddCardForm() {
    document.getElementById('addCardModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addCardModal').style.display = 'none';
}

function addNewCard(event) {
    event.preventDefault();
    
    const cardData = {
        id: Date.now().toString(), // 生成唯一ID
        title: document.getElementById('cardTitle').value,
        value: document.getElementById('cardValue').value,
        description: document.getElementById('cardDescription').value,
        link: document.getElementById('cardLink').value
    };

    // 保存到 localStorage
    const cards = loadCards();
    cards.push(cardData);
    saveCards(cards);

    // 创建并添加新卡片到页面
    const newCard = createCardElement(cardData);
    const dashboard = document.querySelector('.dashboard');
    const addCard = document.querySelector('.add-card');
    dashboard.insertBefore(newCard, addCard);

    // 重置表单并关闭模态框
    document.getElementById('addCardForm').reset();
    closeModal();
}

// 页面加载时初始化卡片
document.addEventListener('DOMContentLoaded', initializeCards);

// 点击模态框外部关闭模态框
window.onclick = function(event) {
    const modal = document.getElementById('addCardModal');
    if (event.target == modal) {
        closeModal();
    }
}