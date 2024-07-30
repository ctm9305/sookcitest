// script.js
let selectedDrink = null;
const drinkInfo = {
    soju: { volume: 50, strength: 20 },
    beer: { volume: 500, strength: 5 },
    whiskey: { volume: 25, strength: 40 },
    makgeolli: { volume: 300, strength: 6 }
};

function selectDrink(drink) {
    selectedDrink = drink;
    
    // 모든 버튼의 선택 상태를 초기화
    const buttons = document.querySelectorAll('#drink-buttons button');
    buttons.forEach(button => button.classList.remove('selected'));

    // 선택된 버튼에 선택 상태 추가
    const selectedButton = document.querySelector(`#drink-buttons button[data-drink="${drink}"]`);
    if (selectedButton) {
        selectedButton.classList.add('selected');
    }

    // 선택된 주종 표시
    document.getElementById('selected-drink').innerText = `선택된 주종: ${capitalizeFirstLetter(drink)}`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function calculate() {
    if (!selectedDrink) {
        alert("주종을 선택해 주세요.");
        return;
    }

    const quantity = parseInt(document.getElementById('quantity').value);
    const insultCount = parseInt(document.getElementById('insult-count').value);
    const voice = parseInt(document.getElementById('voice').value);
    const blush = parseInt(document.getElementById('blush').value);
    const taemin = parseInt(document.getElementById('taemin').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const gender = document.getElementById('gender').value;

    const R = gender === 'male' ? 0.86 : 0.64;
    const beta = 0.015; // 시간당 혈중알코올농도 감소량 (%/h)
    const alcoholDensity = 0.7894; // 알코올의 비중 (g/ml)
    
    let drink = { ...drinkInfo[selectedDrink] }; // Drink info를 복사하여 사용
    
    // 음주량과 도수 변동
    const strengthAdjustment = {
        1: -2,
        2: -1,
        3: 0,
        4: 1,
        5: 2
    };

    const strengthModifier = strengthAdjustment[insultCount] + strengthAdjustment[voice] + strengthAdjustment[blush] + strengthAdjustment[taemin];
    drink.strength += strengthModifier;

    // 음주량 총 계산
    const totalVolume = drink.volume * quantity;
    const A = totalVolume * (drink.strength / 100) * alcoholDensity;

    // 최고 혈중 알코올 농도 계산
    const BAC_max = A / (10 * weight * R);

    // 0.000% BAC에 도달하는 시간 계산
    const hoursToSober = BAC_max / beta;

    // 결과를 덮어쓰는 방식으로 출력
    document.getElementById('result').innerText = `혈중 알코올 농도가 0.000%가 되려면 약 ${hoursToSober.toFixed(2)} 시간이 필요합니다.`;
}

// 슬라이더 값 업데이트
function updateSliderLabel(sliderId, labelId) {
    const slider = document.getElementById(sliderId);
    const label = document.getElementById(labelId);
    slider.addEventListener('input', () => {
        label.innerText = slider.value;
        // 슬라이더 값이 변경될 때마다 계산 결과 초기화
        document.getElementById('result').innerText = '';
    });
}

updateSliderLabel('quantity', 'quantity-label');
updateSliderLabel('insult-count', 'insult-count-label');
updateSliderLabel('voice', 'voice-label');
updateSliderLabel('blush', 'blush-label');
updateSliderLabel('taemin', 'taemin-label');

// 버튼에 data-drink 속성 추가
document.querySelectorAll('#drink-buttons button').forEach(button => {
    button.addEventListener('click', () => {
        selectDrink(button.getAttribute('data-drink'));
    });
});

