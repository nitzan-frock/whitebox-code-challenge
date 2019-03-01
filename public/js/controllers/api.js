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