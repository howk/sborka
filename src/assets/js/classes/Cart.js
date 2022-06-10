class Cart {
	constructor(cartElem, summaryElements, summary) {
		this.cartElem = cartElem;
		this.summaryElements = summaryElements;
		this.summaryParent = summary;
		this.handleItemsEvents();
	}

	getItemPrice(elem) {
		const itemPriceElem = elem.querySelector('span[data-class="priceValue"]');
		return this.formatPriceToNum(itemPriceElem.dataset.initial);
	}

	getItemResultPrice(elem) {
		const itemPriceElem = elem.querySelector('span[data-class="priceValue"]');
		return this.formatPriceToNum(itemPriceElem.innerText);
	}

	getItemQuantity(elem) {
		const itemQuantityElem = elem.querySelector('.input-quantity__field');
		return itemQuantityElem.value * 1;
	}

	getTaxValue() {
		return this.formatPriceToNum(this.summaryElements.tax.innerText);
	}

	getShippingValue() {
		return this.formatPriceToNum(this.summaryElements.shipping.innerText);
	}

	formatPriceToNum(priceString) {
		return priceString.replace(' ', '') * 1;
	}

	formatPriceToStr(priceNum) {
		return priceNum.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
	}

	calculateItemPrice(elem) {
		return this.getItemQuantity(elem) * this.getItemPrice(elem);
	}

	setItemPrice(elem, price) {
		const priceElem = elem.querySelector('span[data-class="priceValue"]');
		priceElem.innerText = this.formatPriceToStr(price);
	}

	getItemsCount() {
		const itemElems = this.cartElem.querySelectorAll('.cart-sidebar__item');
		return itemElems.length;
	}

	handleItemsEvents() {
		const itemElems = this.cartElem.querySelectorAll('.cart-sidebar__item');
		const items = Array.from(itemElems);
		items.forEach(item => {
			const buttonClose = item.querySelector('.button-close');
			const btnIncrease = item.querySelector('.input-quantity__button[data-action=increase]');
			const btnDecrease = item.querySelector('.input-quantity__button[data-action=decrease]');
			const inputField = item.querySelector('.input-quantity__field');
			buttonClose.addEventListener('click', () => {
				item.remove();
				this.setSummary();
				if (!this.getItemsCount()) {
					this.cartElem.querySelector('.cart-sidebar__empty').style.display = 'block';
					this.summaryParent.style.display = 'none';
				}
			});
			btnIncrease.addEventListener('click', () => {
				const newPrice = this.calculateItemPrice(item);
				this.setItemPrice(item, newPrice);
				this.setSummary();
			});
			btnDecrease.addEventListener('click', () => {
				const newPrice = this.calculateItemPrice(item);
				this.setItemPrice(item, newPrice);
				this.setSummary();
			});
			inputField.addEventListener('input', () => {
				const newPrice = this.calculateItemPrice(item);
				this.setItemPrice(item, newPrice);
				this.setSummary();
			});
		});
	}

	calculateItems() {
		const itemElems = this.cartElem.querySelectorAll('.cart-sidebar__item');
		const items = Array.from(itemElems);
		let result = 0;
		items.forEach(item => {
			result += this.getItemResultPrice(item);
		});
		return result;
	}

	calculateSummaryTotal() {
		return this.getTaxValue() + this.getShippingValue() + this.calculateItems();
	}

	setSummary() {
		this.summaryElements.subtotal.innerText = this.formatPriceToStr(this.calculateItems());
		this.summaryElements.total.innerText = this.formatPriceToStr(this.calculateSummaryTotal());
	}
}

export default Cart;
