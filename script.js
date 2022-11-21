const main = document.querySelector('#main');
const navigation = document.querySelector('#navigation');

const options = {
    method: "GET",
    headers: {
        "Accept": "application/json"
    },
};

navigation.addEventListener("click", (event) => {
    main.innerHTML = '';
    if (event.target.dataset.section != undefined) {
        loadApi(event.target.dataset.section)
            .then(response => response.json())
            .then(addInformToNews)
            .catch(err => console.log(err));
    }
});

async function loadApi(chapter) {
    let response = await fetch(`https://api.nytimes.com/svc/topstories/v2/${chapter}.json?api-key=mXG2yTTr2lwpAgGeDbuyqauFKz44AFEL`, options);
    return response;
}

function createNews() {
    let article = document.createElement('article');
    let h3 = document.createElement('h3');
    let spanTitle = document.createElement('span');
    let input = document.createElement('input');
    let div = document.createElement('div');
    let spanNews = document.createElement('span');
    let timeClock = document.createElement('time');
    let timeDay = document.createElement('time');
    let p = document.createElement('p');
    article.classList.add("container");
    h3.classList.add("news__title");
    spanTitle.classList.add("title__text");
    input.classList.add("link__button");
    input.type = "submit";
    input.value = "View     >";
    div.classList.add("news__information");
    spanNews.classList.add("section__news");
    timeClock.classList.add("publish__time");
    timeDay.classList.add("publish__day");
    p.classList.add("news__abstract");
    h3.append(spanTitle);
    h3.append(input);
    div.append(spanNews);
    div.append(timeClock);
    div.append(timeDay);
    div.append(p);
    article.append(h3);
    article.append(div);
    return {article, h3, spanTitle, input, div, spanNews, timeClock, timeDay, p}
}

function checkBgImg(news) {
    let backgroundImg;
    if (news.multimedia)
    for (let i = 0; i < news.multimedia.length; i++) {
        if (news.multimedia[i].url) {
            backgroundImg = news.multimedia[i].url;
            break;
        } else backgroundImg = "none";
    }
    return "url(" + backgroundImg + ") 100% / 100% no-repeat border-box border-box";
}

function addInformToNews(array) {
    let arr = array.results;
    console.log(arr);
    for (let item of arr) {
        let creat = createNews();
        creat.h3.addEventListener("click", () => {
            window.location.href = item.url;
        });
        creat.spanTitle.textContent = item.title;
        if (item.section === "admin") continue;
        creat.spanNews.textContent = item.section;
        creat.p.textContent = item.abstract;
        creat.h3.style.background = checkBgImg(item);
        main.append(creat.article);
    }
}