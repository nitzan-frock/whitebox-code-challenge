'use strict';

$('document').ready(main());

async function main () {
    // get product info from API
    const url = window.location.href;
    const id = url.match(/\?id=\w+/gi)[0];
    console.log(id);
}
