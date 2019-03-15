'use strict';

$('document').ready(main());

async function main () {
    $('.product-detail-name').empty();

    $('.s-text17').empty();

    $('.m-text17').empty();

    $('.slick2').empty();

    // Set Descriptions
    $('.s-text8.p-t-10').empty();
    $('.dropdown-content').each(function () {
        $(this).find('p').empty();
    });

    // get product info from API
    const url = window.location.href;
    const id = url.match(/\?id=\w+/ig)[0]
        .match(/[^?id=]\w+/ig)[0];

    const api = API();
    const productData = await api.getSingle(id);

    
    // Set Product Name
    $('.product-detail-name').text(productData.name);
    $('.s-text17').text(productData.name);

    // Set Price
    $('.m-text17').text(`$${productData.price}`);

    // Set Descriptions
    $('.s-text8.p-t-10').text(productData.about);
    $('.dropdown-content').each(function () {
        $(this).find('p').text(productData.about);
    });

    $('.wrap-slick3').find('img').each(function () {
        $(this).attr('src', productData.image);
    });

    // create an object with fields containing the unique tags for a product.
    const getProductTags = (product) => {
        let tags = {};
        product.tags.forEach(tag => {
            if (!tags[tag]) tags[tag] = 1;
        });
        return tags;
    }

    const currentTags = getProductTags(productData);
    
    const productsData = await api.getMany();

    /** 
     * Filter out the current product from the data list, and 
     * return a list of all related products.
    */
    const related = productsData.filter(product => {
        // exclude the current product.
        if (product._id === id) return false;
        // Array.some() is used as the conditional check to find products with 
        // equivalent tags.
        return product.tags.some(tag => currentTags[tag] ? true : false);
    });
   
    /**
     * Build new product element for the DOM using the HTML template's 
     * classes.
     * 
     * Overall Structure of the element: 
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
     * 
     */
    const buildProductDiv = (data) => {
        // Build overall product container
        const container = $('<div></div>')
            .addClass('item-slick2 p-l-15 p-r-15')
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
            .attr('href', `product-detail.html?id=${data._id}`)
            .text(data.name);
        const priceSpan = $('<span></span>')
            .addClass('block2-price m-text6 p-r-5')
            .text('$'+data.price);

        namePrice_container.append(nameDetail).append(priceSpan);
        block2.append(imgOverlay_container).append(namePrice_container);
        container.append(block2);

        return container[0];
    }


    // insert related products
    const relatedDivs = related.map(product => {
        return buildProductDiv(product);
    });

    $('.slick2').html(relatedDivs);


    // Added slick config here, so that it properly gets initialized with the retrieved items.
    $('.slick2').slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 6000,
        arrows: true,
        appendArrows: $('.wrap-slick2'),
        prevArrow:'<button class="arrow-slick2 prev-slick2"><i class="fa  fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow:'<button class="arrow-slick2 next-slick2"><i class="fa  fa-angle-right" aria-hidden="true"></i></button>',  
        responsive: [
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4
              }
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            },
            {
              breakpoint: 576,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
        ]    
    });
}
