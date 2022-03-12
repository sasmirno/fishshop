let itemBox = document.querySelectorAll('.item_box'); // блок каждого товара
let cartCont = document.getElementById('cart_content'); // блок вывода данных корзины

function addEvent(elem, type, handler){
	if(elem.addEventListener){
		elem.addEventListener(type, handler, false);
	} else {
		elem.attachEvent('on'+type, function(){ handler.call( elem ); });
	}
	//return false;
}
// Получаем данные из LocalStorage
function getCartData(){
	return JSON.parse(localStorage.getItem('cart'));
}
// Записываем данные в LocalStorage
function setCartData(o){
	localStorage.setItem('cart', JSON.stringify(o));
	//return false;
}
// Добавляем товар в корзину
function addToCart(){
	let cartData = getCartData() || {}; // получаем данные корзины или создаём новый объект, если данных еще нет
	let parentBox = this.parentNode; // родительский элемент кнопки "Добавить в корзину"
	let itemId = this.getAttribute('id'); // ID товара
	let itemTitle = parentBox.querySelector('.item_title').innerHTML; // название товара
	let itemImage = parentBox.querySelector('.item_image').innerHTML; // картинку товара
	let itemDescription = parentBox.querySelector('.item_desc').innerHTML; // описание товара

	cartData[itemId] = [itemTitle, itemImage, itemDescription, 1];
	setCartData(cartData);
}
// Устанавливаем обработчик события на каждую кнопку "Добавить в корзину"
for(var i = 0; i < itemBox.length; i++){
	addEvent(itemBox[i].querySelector('.add_item'), 'click', addToCart);
}
// Открываем корзину со списком добавленных товаров
function openCart(){
	var cartData = getCartData(), // вытаскиваем все данные корзины
		totalItems = '';
	// если что-то в корзине уже есть, начинаем формировать данные для вывода
	if(cartData !== null){
		for(var items in cartData){
			totalItems += '<div class="shopping_list">';
			totalItems += '<div class="shopping_title">' + cartData[items][0] + '</div>';
			totalItems += '<div class="shopping_image">' + cartData[items][1] + '</div>';
			totalItems += '<div class="shopping_desc">' + cartData[items][2] + '</div>';
			/*for(var i = 0; i < cartData[items].length; i++){
				totalItems += '<div>' + cartData[items][i] + '</div>';
			}*/
			totalItems += '<div class="shopping_count">';
			totalItems += '<button class="shopping_button minus" data-id="' + items + '">-</button>';
			totalItems += '<div class="shopping_amount">' + cartData[items][3] + '</div>';
			totalItems += '<button class="shopping_button plus" data-id="' + items + '">+</button>';
			totalItems += '</div>';
			totalItems += '<button class="shopping_button del" data-id="' + items + '">Не кросивое</button>';
			totalItems += '</div>';
		}
	} else {
		// если в корзине пусто, то сигнализируем об этом
		totalItems = '<p>В корзине пусто!</p>';
	}
	return totalItems;
}
// Работа кнопок плюс минус удалить
document.onclick = event => {
	if(event.target.classList.contains('plus')) {
		plusFunction(event.target.dataset.id);
	}
	if(event.target.classList.contains('minus')) {
		minusFunction(event.target.dataset.id);
	}
	if(event.target.classList.contains('del')) {
		deleteFunction(event.target.dataset.id);
	}
}
const plusFunction = id => {
	let count = getCartData();
	count[id][3]++;
	setCartData(count);
	document.getElementById('cart_content').innerHTML = openCart();
}
const minusFunction = id => {
	let count = getCartData();
	if(count[id][3] == 1) {
		deleteFunction(id);
		return true;
	}
	count[id][3]--;
	setCartData(count);
	document.getElementById('cart_content').innerHTML = openCart();
}
const deleteFunction = id => {
	let count = getCartData();
	count[id] = undefined;
	setCartData(count);
	document.getElementById('cart_content').innerHTML = openCart();
}

if (document.getElementById('cart_content') != null){
	// Показать корзину
	const popupLinks = document.querySelectorAll('.popup-link');
	document.getElementById('cart_content').innerHTML = openCart();
	// Очистить корзину
	addEvent(document.getElementById('clear_cart'), 'click', function(e){
		localStorage.removeItem('cart');
		cartCont.innerHTML = '<p>Корзина очищена.</p>';
	});
}