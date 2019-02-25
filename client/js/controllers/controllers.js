'use strict';

$('document').ready(function () {
    // Current Products' block with parent div element 
    const getDefaultProducts = () => {
        return $('.block2').closest('.p-b-50');
    };

    let defaultProducts = getDefaultProducts();
    let currentProducts = getDefaultProducts();

    const showSelectedProducts = (products) => {
        console.log(products);
        defaultProducts.each(function () {
            //console.log(products);
            if (products.has(this) >= 1) {
                //console.log(this);
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    // sorting and filter selection handlers
    $('select').change(function() {
        switch(this.value) {
            case 'Default Sorting':
                showSelectedProducts(defaultProducts);
                break;
            case 'Popularity':
                showSelectedProducts(defaultProducts);
                break;
            case 'Price: low to high':
                sortProducts('lo-hi', defaultProducts);
                break;
            case 'Price: high to low':
                sortProducts('hi-lo', defaultProducts);
                break;
            case '$0.00 - $50.00':
                filterProducts(0.00, 50.00, defaultProducts);
                break;
            case '$50.00 - $100.00':
                filterProducts(50.00, 100.00, defaultProducts);
                break;
            case '$100.00 - $150.00':
                filterProducts(100.00, 150.00, defaultProducts);
                break;
            case '$150.00 - $200.00':
                filterProducts(150.00, 200.00, defaultProducts);
                break;
            case '$200.00+':
                filterProducts(200.00, Number.MAX_SAFE_INTEGER, defaultProducts);
                break;
            default:
                alert(`Error: ${this.value} is not a valid sort`);
        }
    });

    // Sort by price Low - High, or High - Low.
    const sortProducts = (method, products) => {
        let list = products.sort(function(a, b) {
            // parse the price from the element
            let aStr = $(a).find('.block2-price').text().trim();
            let bStr = $(b).find('.block2-price').text().trim();
            
            // check to make sure there is not a sale price
            if (aStr === '') {
                aStr = $(a).find('.block2-newprice').text().trim();
            }
            if (bStr === '') {
                bStr = $(b).find('.block2-newprice').text().trim();
            }

            // regex matches the number value and drops the "$"
            let aVal = price(aStr);
            let bVal = price(bStr);

            // makes the comparison based on the method input.
            if (method === 'lo-hi') {
                return compare(aVal, bVal);
            } else if (method === 'hi-lo') {
                return compare(bVal, aVal);
            }
        });

        // place the sorted list into it's proper location on the DOM.
        $('.block2').closest('.row').html(list);
    }

    const compare = (a, b) => {
        if (a > b) return 1;
        if (b < a) return -1;
        return 0;
    }

    const price = (currency) => {
        const re = /[0-9]+.[0-9]{2}/ig;
        return parseFloat(currency.match(re)[0]);
    }



    // filter handlers
    const filterProducts = (min, max, products) => {
        let filtered = {};
        let index = 0;
        products.each(function () {
            let USD = $(this).find('.block2-price').text().trim();
            
            if (USD === '') {
                USD = $(this).find('.block2-newprice').text().trim();
            }

            let value = price(USD);
            
            if (value >= min && value <= max) {
                filtered.index = this;
                index++;
            }
        });
        showSelectedProducts(filtered);
    }
});