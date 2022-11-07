const section = document.querySelector('#section');
const navigation = document.querySelector('#navigation');

const options = {
    method: "GET",
    headers: {
        "Accept": "application/json"
    },
};

navigation.addEventListener("click", (event) => {
    if (event.target.dataset.section != undefined) {
        loadApi(event.target.dataset.section)
            .then(response => response.json())
            .then(response => createNews(response))
            .catch(err => console.log(err));
    }
})

async function loadApi(section) {
    let response = await fetch(`https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=mXG2yTTr2lwpAgGeDbuyqauFKz44AFEL`, options);
    return response
}

function createNews(array) {
//my code;
}
