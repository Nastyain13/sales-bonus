/**
 * Функция для расчета прибыли
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет прибыли от операции
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
    // @TODO: Расчет бонуса от позиции в рейтинге
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
    // @TODO: Проверка входных данных

    // @TODO: Проверка наличия опций

    // @TODO: Подготовка промежуточных данных для сбора статистики

    // @TODO: Индексация продавцов и товаров для быстрого доступа

    // @TODO: Расчет выручки и прибыли для каждого продавца

    // @TODO: Сортировка продавцов по прибыли

    // @TODO: Назначение премий на основе ранжирования

    // @TODO: Подготовка итоговой коллекции с нужными полями
}


function calculateSimpleRevenue(purchase, _product) {       
    const { discount, sale_price, quantity } = purchase;              // discount-скидка от продавца
    const coefficient= 1 - (discount / 100);           //  1-(скидка от продавца/100) - это коэффициент для цены со скидкой
   const  revenue=sale_price *quantity * coefficient;  // Вычисляем прибыль  со скидкой продавца
     return revenue;
}

  
function calculateBonusByProfit(index, total, seller) {

   if (index===0) {
    return seller.profit*0.15 }
    else if(index===1 || index===2) {
        return seller.profit*0.10
    }
    else if(index===total-1) {
        return 0
    }
    else {
        return seller.profit*0.05
    }
   }



function analyzeSalesData(data, options = {}) {  
     if (typeof options !== 'object' || options === null) {
    throw new Error('Должны быть объектами');
  }

    if (!data
      || !Array.isArray(data.sellers) 
      || data.sellers.length===0
      || !Array.isArray(data.products)
      || data.products.length===0
      || !Array.isArray(data.purchase_records)
      || data.purchase_records.length===0
    ) {
        throw new Error('Некорректные входные данные');
    }

    
    const { 
        calculateRevenue = calculateSimpleRevenue,
        calculateBonus = calculateBonusByProfit
    } = options;

     if (typeof calculateRevenue !== 'function' || typeof calculateBonus !== 'function') {
    throw new Error('Должны быть функциями');
    }
    // Подготовка статистики  (перебираем продавцов из data.sellers c  помощью map(). преобразовывает  элемент старового массива в новый элемент)
    const sellerStats = data.sellers.map(seller => ({
        seller_id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0, // итоговая выручка (сумма всех чеков продавца)
        profit: 0, // итоговая прибыль
        sales_count: 0, // Количество продаж
        products_sold: {} // все товары
    }));

    console.log(sellerStats);


  const sellerIndex=Object.fromEntries(sellerStats.map(seller=> [seller.seller_id, seller]));
  console.log(sellerIndex);

  const productIndex=Object.fromEntries(data.products.map(product =>[product.sku, product]));
  console.log(productIndex);

  data.purchase_records.forEach(record => { 
        const seller = sellerIndex[record.seller_id];
             
         seller.sales_count += 1;
         

    
    record.items.forEach(item => {                  //   перебирает каждый товар в чеке  по артиклу sku 
            const product = productIndex[item.sku];
    

            const cost = product.purchase_price * item.quantity; // себестоимость= за сколько магазин покупает товар*количество
            const revenue = calculateRevenue(item, product); 
            seller.revenue += revenue;
            const profit = revenue - cost; // итоговая прибыль
            
            
            seller.profit += profit;  
            
           
            if (!seller.products_sold[item.sku]) {
                seller.products_sold[item.sku] = 0;
            }
            seller.products_sold[item.sku] += item.quantity;
        });
    });

    console.log(sellerIndex)

sellerStats.sort(function(a,b) {  // сортирую продовцов по profit, большее к меньшему
    return b.profit-a.profit;
});
console.log(sellerStats);

sellerStats.forEach((seller, index) => {                                               
      seller.bonus = calculateBonus(index, sellerStats.length, seller);
        seller.top_products = Object.entries(seller.products_sold)     // топ 10 продуктов по количеству продаж
        .map(([sku, quantity]) => ({ 
        sku: sku,
        quantity: quantity
    }))
    .sort((a, b) => 
        b.quantity-a.quantity   
    )
    .slice(0, 10); 
}); 
return sellerStats.map(seller => ({
        seller_id: seller.seller_id,
        name: seller.name,
        revenue: seller.revenue.toFixed(2),
        profit: seller.profit.toFixed(2),
        sales_count:  seller.sales_count,
        top_products: seller.top_products,
        bonus: seller.bonus.toFixed(2)
    
})); 

}
