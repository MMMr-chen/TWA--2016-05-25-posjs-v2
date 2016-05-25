//TODO: Please write code in this file.
function parseBarcode(inputs){
    var barcodes=[];
    inputs.forEach(function(e){
        var barcodeString = [];
        barcodeString = e.split('-');
        barcodes.push({
            barcode : barcodeString[0],
            count : parseInt(barcodeString[1]) || 1
        });
    });
    return barcodes;

}

function mergeBarcode(barcodes){
    var barcodeList = [];
    barcodes.forEach(function(e){
        var existBarcode = barcodeList.find(function(item){
            return item.barcode === e.barcode;
        });
        if(!existBarcode){
            barcodeList.push(Object.assign(e));
        }else{
            existBarcode.count++;
        }
    });
    return barcodeList;
}

function buildItemList(barcodeList){
     var allItem = loadAllItems();
     var itemList = [];
     barcodeList.forEach(function(element){
         var item = allItem.find(function(e){
             return e.barcode === element.barcode;
         });
         itemList.push(Object.assign({count:element.count},item));
     });
     return itemList;
}

function buildPromotionList(itemList){
    var allPromotion = loadPromotions();
    var promotionList = [];
    var allPromotionBarcode = allPromotion[0].barcodes;
    allPromotionBarcode.forEach(function(element){
        var existItem = itemList.find(function(e){
            return e.barcode === element;
        });
        if(!existItem){
        }else{
            promotionList.push({
                barcode:existItem.barcode,
                name:existItem.name,
                unit:existItem.unit,
                price:existItem.price,
                type:'BUY_TWO_GET_ONE_FREE',
                count:Math.floor(existItem.count/3)
            });
        }
    });
    return promotionList;
}

function caculateSubtotalPrice(itemList){
    var subtotalItem=[];
    subtotalItem = itemList.map(function(item) {
        return Object.assign({
          subTotal: item.count * item.price,
        }, item);
    });
    return subtotalItem;
}

function applyPromotion(subtotalItem,promotionList){
    var cartItem = [];
    subtotalItem.forEach(function(item){
        var existPromotion = promotionList.find(function(promotion){
            return promotion.barcode === item.barcode;
        });
        if(!existPromotion){
            cartItem.push(Object.assign({promotionSubtotal:item.subTotal},item));
        }else{
            cartItem.push(Object.assign({
            promotionSubtotal:item.subTotal - existPromotion.count * existPromotion.price
            },item));
        }
    });
    return cartItem;
}

function caculateTotalPrice(cartItem){
    return cartItem.reduce(function(a,b){
        return {promotionSubtotal:a.promotionSubtotal + b.promotionSubtotal};
    }).promotionSubtotal;
}

function caculateDiscountPrice(cartItem,totalItemPrice){
    return cartItem.reduce(function(a,b){
        return {subTotal:a.subTotal + b.subTotal};
    }).subTotal - totalItemPrice;
}

function print(cartItem,promotionList,totalItemPrice,discountPrice){
     var dateDigitToString = function (num) {
         return num < 10 ? '0' + num : num;
     };
     var currentDate = new Date(),
                year = dateDigitToString(currentDate.getFullYear()),
                month = dateDigitToString(currentDate.getMonth() + 1),
                date = dateDigitToString(currentDate.getDate()),
                hour = dateDigitToString(currentDate.getHours()),
                minute = dateDigitToString(currentDate.getMinutes()),
                second = dateDigitToString(currentDate.getSeconds()),
                formattedDateString = year + '年' + month + '月' + date + '日 ' + hour + ':' + minute + ':' + second;
     var outString = '***<没钱赚商店>购物清单***\n' +
                 '打印时间：' + formattedDateString + '\n' +
                 '----------------------\n' ;
     cartItem.forEach(function(e){
         outString +=
         `名称：${e.name}，数量：${e.count}${e.unit}，单价：${e.price.toFixed(2)}(元)，小计：${e.promotionSubtotal.toFixed(2)}(元)\n`
     });
     outString += '----------------------\n' +
                  '挥泪赠送商品：\n';
     promotionList.forEach(function(e){
         outString += `名称：${e.name}，数量：${e.count}${e.unit}\n`;
     });
     outString += '----------------------\n' +
                 `总计：${totalItemPrice.toFixed(2)}(元)\n` +
                 `节省：${discountPrice.toFixed(2)}(元)\n` +
                 '**********************';
     console.log(outString);
}

function printInventory(inputs){
    var barcodes = parseBarcode(inputs);
    var barcodeList = mergeBarcode(barcodes);
    var itemList = buildItemList(barcodeList);
    var promotionList = buildPromotionList(itemList);
    var subtotalItem = caculateSubtotalPrice(itemList);
    var cartItem = applyPromotion(subtotalItem,promotionList);
    var totalItemPrice = caculateTotalPrice(cartItem);
    var discountPrice = caculateDiscountPrice(cartItem,totalItemPrice);
    print(cartItem,promotionList,totalItemPrice,discountPrice);

}