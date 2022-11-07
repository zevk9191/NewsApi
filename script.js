const options = {
    method: "GET",
    headers: {
        "Accept": "application/json"
    },
};

async function loadApi(section) {
    let response = await fetch(`https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=mXG2yTTr2lwpAgGeDbuyqauFKz44AFEL`, options);
    return response
}

loadApi("arts")
    .then(response => response.json())
    .then(response => console.log(response));


//
// fetch("https://api.nytimes.com/svc/topstories/v2/arts.json?api-key=mXG2yTTr2lwpAgGeDbuyqauFKz44AFEL", options)
//     .then(response => response.json())
//     .then(response => console.log(response));