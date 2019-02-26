'use strict';

$('document').ready(function () {

    /**
     * Build new product element for the DOM using the HTML template's 
     * classes.
     * 
     * Overall Structure of the element: 
     * <productContainer>
     *     <block2>
     *         <imgAndOverlay>
     *             <img>
     *             <overlayContainer>
     *                 <a>
     *                     <heartIcons></heartIcons>
     *                 </a>
     *             </overlayContainer>
     *         </imgAndOverlay>
     *         <namePrice>
     *             <nameDetail></nameDetail>
     *             <price></price>
     *         </namePrice>
     *     </block2>
     * </productContainer>
     * 
     */
    const buildProductDiv = (data) => {
        console.log();
        // Build overall product container
        const container = $('<div></div>')
            .addClass('col-sm-12 col-md-6 col-lg-4 p-b-50')
            .attr('id', data._id);
        const block2 = $('<div></div>')
            .addClass('block2');

        // Build image and overlay container
        const imgOverlay_container = $('<div></div>')
            .addClass('block2-img wrap-pic-w of-hidden pos-relative');
        const img = $('<img>')
            .attr('src', 'images/item-01.jpg')
            .attr('alt', 'IMG-PRODUCT');

        // Build overlay container
        const overlay_container = $('<div></div>')
            .addClass('block2-overlay trans-0-4');
        const wishlistAnchor = $('<a></a>')
            .addClass('block2-btn-addwishlist hov-pointer trans-0-4')
            .attr('href', "#");
        const iconHeartAlt = $('<i></i>')   
            .addClass('icon-wishlist icon_heart_alt')
            .attr('aria-hidden', 'true');
        const iconHeartNone = $('<i></i>')   
            .addClass('icon-wishlist icon_heart dis-none')
            .attr('aria-hidden', 'true');
        
        wishlistAnchor.append(iconHeartAlt).append(iconHeartNone);

        // Build add to cart container
        const addToCart_container = $('<div></div>')
            .addClass('block2-btn-addcart w-size1 trans-0-4');
        const addToCartBtn = $('<button></button>')
            .addClass('flex-c-m size1 bg4 bo-rad-23 hov1 s-text1 trans-0-4')
            .text('Add to Cart');

        addToCart_container.append(addToCartBtn);
        overlay_container.append(wishlistAnchor).append(addToCart_container);
        imgOverlay_container.append(img).append(overlay_container);

        // Build name and price container
        const namePrice_container = $('<div></div>')
            .addClass('block2-txt p-t-20');
        const nameDetail = $('<a></a>')
            .addClass('block2-name dis-block s-text3 p-b-5')
            .attr('href', 'product-detail.html')
            .text(data.name);
        const priceSpan = $('<span></span>')
            .addClass('block2-price m-text6 p-r-5')
            .text('$'+data.price);

        namePrice_container.append(nameDetail).append(priceSpan);
        block2.append(imgOverlay_container).append(namePrice_container);
        container.append(block2);

        return container;
    }

    // API
    
    const API = (function () {
        const host = 'localhost:8080';

        const getMany = async () => {
            let data;
            let url = `${host}/getMany`;
            try {
                let res = await fetch(url);
                data = await res.json();
            } catch (err) {
                alert(err);
            }
            return data;
        }

        const getSingle = async (id) => {
            let data;
            let url = `${host}/getSingle/${id}`;
            try {
                let res = await fetch(url);
                data = await res.json();
            } catch (err) {
                alert(err);
            }
            return data;
        }

        return {
            getMany: getMany,
            getSingle: getSingle
        }
    })();

    console.log();

    // Current Products' block with parent div element 
    const getDefaultProducts = () => {
        return $('.block2').closest('.p-b-50');
    };

    let defaultProducts = getDefaultProducts();
    let sortedProducts = getDefaultProducts();

    const showSelectedProducts = (products) => {
        defaultProducts.each(function () {
            if ($.inArray(this, products) !== -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $('.block2').closest('.row').append(buildProductDiv({
        _id: 'test',
        name: 'dummyProduct',
        price: '40.00',
        image: ''
    }));

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
                sortProducts('lo-hi');
                break;
            case 'Price: high to low':
                sortProducts('hi-lo');
                break;
            case 'Price':
                showSelectedProducts(defaultProducts);
                break;
            case '$0.00 - $50.00':
                filterProducts(0.00, 50.00);
                break;
            case '$50.00 - $100.00':
                filterProducts(50.00, 100.00);
                break;
            case '$100.00 - $150.00':
                filterProducts(100.00, 150.00);
                break;
            case '$150.00 - $200.00':
                filterProducts(150.00, 200.00);
                break;
            case '$200.00+':
                filterProducts(200.00, Number.MAX_SAFE_INTEGER);
                break;
            default:
                alert(`Error: ${this.value} is not a valid sort`);
        }
    });

    // Sort by price Low - High, or High - Low.
    const sortProducts = (method) => {
        let list = sortedProducts.sort(function(a, b) {
            // parse the price from the element
            let aUSD = $(a).find('.block2-price').text().trim();
            let bUSD = $(b).find('.block2-price').text().trim();
            
            // check to make sure there is not a sale price
            if (aUSD === '') {
                aUSD = $(a).find('.block2-newprice').text().trim();
            }
            if (bUSD === '') {
                bUSD = $(b).find('.block2-newprice').text().trim();
            }

            // regex matches the number value and drops the "$"
            let aVal = price(aUSD);
            let bVal = price(bUSD);

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
    // when lower value of slider changes
    let config = {
        attributes: true, 
        childList: true, 
        subtree: true
    };

    const observerCallback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                let mutated = mutation.target.innerText;

                if (mutation.target.id === 'value-lower') {
                    let hi = $('#value-upper').text().trim();
                    filterProducts(mutated, hi);
                } else if (mutation.target.id === 'value-upper') {
                    let lo = $('#value-lower').text().trim();
                    filterProducts(lo, mutated);
                }
            }
        }
    };

    const lowerValue = document.getElementById('value-lower');
    const upperValue = document.getElementById('value-upper');
    console.log(lowerValue);

    const observer = new MutationObserver(observerCallback);
    observer.observe(lowerValue, config);
    observer.observe(upperValue, config);

    // filter by price
    const filterProducts = (min, max) => {
        let filtered = [];

        defaultProducts.each(function () {
            let USD = $(this).find('.block2-price').text().trim();
            
            if (USD === '') {
                USD = $(this).find('.block2-newprice').text().trim();
            }

            let value = price(USD);
            
            if (value >= min && value <= max) {
                filtered.push(this);
            }
        });

        showSelectedProducts($(filtered));
    }
});