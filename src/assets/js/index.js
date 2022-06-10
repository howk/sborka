const { default: Cart } = require('./classes/Cart');

class ProjectApp {
	constructor() {
		this.env = require('./utils/env').default;
		this.utils = require('./utils/utils').default;
		this.classes = {
			Signal: require('./classes/Signal').default,
			Cart: require('./classes/Cart').default,
			InputQuantity: require('./classes/InputQuantity').default,
		};
		this.components = {};
		this.helpers = {};
		this.modules = {};
		document.addEventListener('DOMContentLoaded', () => {
			document.documentElement.classList.remove('_loading');

			const inputQualityElems = document.querySelectorAll('.input-quantity');
			if (inputQualityElems.length) {
				const inputQualityArr = Array.from(inputQualityElems);
				inputQualityArr.forEach(input => {
					console.log(input);
					const btnIncrease = input.querySelector('.input-quantity__button[data-action=increase]');
					const btnDecrease = input.querySelector('.input-quantity__button[data-action=decrease]');
					const inputField = input.querySelector('.input-quantity__field');
					const inputMaxValue = input.dataset.max * 1 ?? 0;
					inputField.addEventListener('input', e => {
						const newValue = e.target.value * 1;
						if (newValue <= 1) {
							inputField.value = 1;
							btnDecrease.disabled = true;
							btnIncrease.disabled = false;
						} else if (newValue >= inputMaxValue) {
							inputField.value = inputMaxValue;
							btnDecrease.disabled = false;
							btnIncrease.disabled = true;
						} else {
							btnDecrease.disabled = false;
							btnIncrease.disabled = false;
						}
					});
					btnIncrease.addEventListener('click', () => {
						const initialValue = inputField.value * 1;
						const newValue = initialValue + 1;
						if (inputMaxValue && newValue < inputMaxValue) {
							inputField.value = newValue;
						} else if (inputMaxValue && newValue === inputMaxValue) {
							inputField.value = newValue;
							btnIncrease.disabled = true;
						}
						if (newValue > 1) {
							btnDecrease.disabled = false;
						}
					});
					btnDecrease.addEventListener('click', () => {
						const initialValue = inputField.value * 1;
						const newValue = initialValue - 1;
						if (newValue > 1) {
							inputField.value = newValue;
						} else {
							inputField.value = newValue;
							btnDecrease.disabled = true;
						}
						if (inputMaxValue && newValue < inputMaxValue) {
							btnIncrease.disabled = false;
						}
					});
				});
			}

			const cartElement = document.querySelector('.cart-sidebar');
			const summaryParent = document.querySelector('.order-summary-table');
			const cartHeaderElement = document.querySelector('.header .button-cart__value');
			const summaryElements = {
				subtotal: document.getElementById('summarySubtotal'),
				tax: document.getElementById('summaryTax'),
				shipping: document.getElementById('summaryShipping'),
				total: document.getElementById('summaryTotal'),
			};
			const cart = new Cart(cartElement, summaryElements, summaryParent, cartHeaderElement);
		});
	}
}

global.ProjectApp = new ProjectApp();

if (module.hot) {
	module.hot.accept();
}
