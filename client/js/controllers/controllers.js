'use strict';

$('document').ready(main());

/**
 * 
 *  API returns an object with methods to call the different APIs.
 * 
 */
    
function API () {
    const host = 'http://localhost:8080';

    const getMany = async () => {
        let url = `${host}/getMany`;
        return await tryFetch(url);
    }

    const getSingle = async (id) => {
        let url = `${host}/getSingle/${id}`;
        return await tryFetch(url);
    }

    const tryFetch = async (url) => {
        try {
            let res = await fetch(url);
            return await res.json();
        } catch (err) {
            alert(err);
        }
    }

    return {
        getMany: getMany,
        getSingle: getSingle
    }
}

async function main () {

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
            .attr('src', data.image)
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

        return container[0];
    }

    // add id to the div where the products are located on the DOM
    $('.block2').closest('.row').attr('id', 'products-container');
    // remove any templates
    $('#products-container').empty();

    const api = API();

    let initialProductsData = await api.getMany();

    let initialProducts = initialProductsData.map(product => {
        return {el: buildProductDiv(product), visible: true, filtered: true};
    });

    // Show the selected products in the DOM and hide the others.
    const showSelectedProducts = (products) => {
        products.forEach(product => {
            if (product.filtered && product.visible) {
                $(product.el).show();
            } else {
                $(product.el).hide();
            }
        });
    }

    // Insert default products into the DOM.
    const showInitial = () => {
        let paginated = paginateProducts(initialProducts,1);
        paginated.forEach(product => {
            $('#products-container').append(product.el);
        });
        showSelectedProducts(paginated);
        //$('#products-container').html(paginateProducts(initialProducts, 1));
    }

    const paginateProducts = (products, page) => {
        let numProductsPerPage = 12;
        let shownProducts = [...products];

        if (shownProducts.length > numProductsPerPage) {
            let startingIndex = (page - 1) * (shownProducts.length);
            let endingIndex = (page * numProductsPerPage);
            console.log(startingIndex, endingIndex);

            for (let i = startingIndex; i < shownProducts.length; i++){
                if (i >= startingIndex && i < endingIndex) {
                    shownProducts[i].visible = true;
                } else {
                    shownProducts[i].visible = false;
                }
            }
        }

        updateNumResults(shownProducts.length);
        return shownProducts;
    }

    // Update how many results are showing of the total for the search or filter.
    const updateNumResults = (numResults) => {
        let results = $('.s-text8.p-t-5.p-b-5');
        if (numResults < 12) {
            let text = `Showing 1–${numResults} of ${numResults} results`;
            results.text(text);
        } else {
            let text = `Showing 1–12 of ${numResults} results`;
            results.text(text);
        }
    }

    showInitial();

    // State of products
    let search = false;
    let sorted = [...initialProducts];
    let defaultSort = [...initialProducts];
    ///let filtered = [...initialProducts];
    let currentProducts = [...initialProducts];

    

    // sorting and filter selection handlers
    $('select').change(function() {
        let products = currentProducts;
        switch(this.value) {
            case 'Default Sorting':
                sortByDefault();
                break;
            case 'Popularity':
                sortByDefault();
                break;
            case 'Price: low to high':
                sortByPrice('lo-hi');
                break;
            case 'Price: high to low':
                sortByPrice('hi-lo');
                break;
            case 'Price':
                filterProducts(0.00, Number.MAX_SAFE_INTEGER, products);
                break;
            case '$0.00 - $50.00':
                filterProducts(0.00, 50.00, products);
                break;
            case '$50.00 - $100.00':
                filterProducts(50.00, 100.00, products);
                break;
            case '$100.00 - $150.00':
                filterProducts(100.00, 150.00, products);
                break;
            case '$150.00 - $200.00':
                filterProducts(150.00, 200.00, products);
                break;
            case '$200.00+':
                filterProducts(200.00, Number.MAX_SAFE_INTEGER, products);
                break;
            default:
                alert(`Error: ${this.value} is not a valid sort`);
        }
    });

    const sortByDefault = () => {
        $('#products-container').html(paginateProducts(defaultSort, 1));
    }

    // Sort by price Low - High, or High - Low.
    const sortByPrice = (method) => {
        sorted.sort(function(a, b) {
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

        console.log(sorted.length);

        // place the sorted list into it's proper location on the DOM.
        $('#products-container').html(paginateProducts(sorted, 1));
    }

    const compare = (a, b) => {
        if (a > b) return 1;
        if (b < a) return -1;
        return 0;
    }

    const price = (currency) => {
        const re = /[0-9]+.[0-9]{1,2}/ig;
        return parseFloat(currency.match(re)[0]);
    }

    // filter handlers
    // Set event handler for the filter price slider.
    $('button').each(function () {
        if ($(this).text().trim() === 'Filter') {
            $(this).click(function () {
                let lo = $('#value-lower').text().trim();
                let hi = $('#value-upper').text().trim();
                filterProducts(lo, hi);
            });
        }
    });

    // filter by price
    const filterProducts = (min, max, products) => {
        let filtered = [];

        $(products).each(function () {
            let USD = $(this).find('.block2-price').text().trim();
            
            if (USD === '') {
                USD = $(this).find('.block2-newprice').text().trim();
            }

            let value = price(USD);
            
            if (value >= min && value <= max) {
                filtered.push(this);
            }
        });

        showSelectedProducts(filtered);
        $('#products-container').html(paginateProducts(filtered,1));
    }

    // Search handlers
    // basic search that does a regex test using the input to the names of the products.
    $('[name="search-product"]').on('input', function () {
        let input = $(this).val();
        searchProducts(input);
    });

    $('button').find('.fa-search').click(function () {
        console.log('FILTER CLICKED');
        let input = $('[name="search-product"]').val();
        searchProducts(input);
    });

    const searchProducts = (input) => {
        if (input === '') {
            showInitial();
            return;
        }

        let filtered = [];
        $(initialProducts).each(function () {
            let name = $(this).find('.block2-name').text().trim();
            let re = new RegExp(input);
            if (re.test(name)) filtered.push(this);
        });
        
        currentProducts = $(filtered);
        let paginated = paginateProducts(filtered, 1);

        console.log(filtered);
        console.log(paginated);
        
        showSelectedProducts($(paginated));
        updateNumResults(filtered.length);
    }
}