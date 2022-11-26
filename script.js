const main = document.querySelector('#main');
const navigation = document.querySelector('#navigation');
let selectedSection;

const options = {
    method: "GET",
    headers: {
        "Accept": "application/json"
    },
};

navigation.addEventListener("click", (event) => {
    main.innerHTML = '';
    if (event.target.dataset.section) {
        addActiveToNav(event.target);
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

function addActiveToNav (target) {
    if (selectedSection) selectedSection.classList.remove('active')
    selectedSection = target;
    selectedSection.classList.add('active')
}

function createNews() {
    const article = document.createElement('article');
    const h3 = document.createElement('h3');
    const spanTitle = document.createElement('span');
    const input = document.createElement('input');
    const div = document.createElement('div');
    const spanNews = document.createElement('span');
    const timeClock = document.createElement('time');
    const timeDay = document.createElement('time');
    const p = document.createElement('p');
    article.classList.add("container");
    h3.classList.add("news__title");
    spanTitle.classList.add("title__text");
    input.classList.add("link__button");
    input.type = "submit";
    input.value = "View     >";
    div.classList.add("news__information");
    spanNews.classList.add("section__name");
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

function checkBgImg(currentNews) {
    let backgroundImg = "none";
    if (currentNews.multimedia) {
        for (let i = 0; i < currentNews.multimedia.length; i++) {
            if (currentNews.multimedia[i].url) {
                backgroundImg = currentNews.multimedia[i].url;
                break;
            }
        }
    }
    return "url(" + backgroundImg + ") 100% / 100% no-repeat border-box border-box";
}

function cutAbstract(newsAbstract) {
    return (newsAbstract.length > 135) ? newsAbstract.slice(0, 135 - 1) + '…' : newsAbstract;
}

function addInformToNews(array) {
    let news = array.results;
    console.log(news);
    for (let currentNews of news) {
        let createdNews = createNews();
        createdNews.h3.addEventListener("click", () => {
            window.location.href = currentNews.url;
        });
        createdNews.spanTitle.textContent = currentNews.title;

        // API не всі новини присилає коректно, тому потрібна перевірка на правильність

        if (currentNews.section === "admin") continue;
        createdNews.spanNews.textContent = currentNews.section.split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ');
        createdNews.timeDay = currentNews.published_date;
        createdNews.p.textContent = cutAbstract(currentNews.abstract);
        createdNews.h3.style.background = checkBgImg(currentNews);
        main.append(createdNews.article);
    }
}