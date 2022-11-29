const mainEl = document.querySelector('#main');
const navigation = document.querySelector('#navigation');
const floor = document.querySelector('#floor');
let selectedSection;

const options = {
    method: "GET",
    headers: {
        "Accept": "application/json"
    },
};

navigation.addEventListener("click", (event) => {
    floor.innerHTML = '';
    if (event.target.dataset.section) {
        addActiveToNav(event.target);
        loadApi(event.target.dataset.section)
            .then(response => response.json())
            .then(createCurrentNewsSection)
            .catch(err => console.log(err));
    }
});

async function loadApi(chapter) {
    return await fetch(`https://api.nytimes.com/svc/topstories/v2/${chapter}.json?api-key=mXG2yTTr2lwpAgGeDbuyqauFKz44AFEL`, options);
}

function createCurrentNewsSection(array) {
    const arrayNews = [];
    let currentPage = 1;
    let newsInPage = 8;

    for (let currentNews of array.results) {

        // API не всі новини присилає коректно, тому потрібна перевірка на правильність

        if (currentNews.section === "admin" || currentNews.section === "") continue;
        arrayNews.push(currentNews);
    }

    function createNews(newsArr, currentPg, newsInPg) {
        mainEl.innerHTML = '';
        currentPg--;
        let start = currentPg * newsInPg;
        let end = start + newsInPg;
        let news = newsArr.slice(start, end);

        for (let currentNews of news) {

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
            h3.addEventListener("click", () => {
                window.open(currentNews.url, '_blank');
            });
            spanTitle.textContent = currentNews.title;
            spanNews.textContent = currentNews.section.split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ');
            timeDay.textContent = cutDayTime(currentNews.published_date);
            timeDay.setAttribute("datetime", cutDayTime(currentNews.published_date));
            timeClock.textContent = cutTime(currentNews.published_date);
            timeClock.setAttribute("datetime", cutTime(currentNews.published_date));
            p.textContent = cutAbstract(currentNews.abstract);
            h3.style.background = checkBgImg(currentNews);
            mainEl.append(article);
        }
    }

    function addPagination(arrayNews, newsInPg) {
        const pagesCount = Math.ceil(arrayNews.length / newsInPg);
        const ul = document.createElement("ul");
        ul.classList.add('ulPagination__style');

        for (let i = 0; i < pagesCount; i++) {
            const li = createLiElem(i + 1);
            ul.append(li);
        }
        floor.append(ul);
    }

    function createLiElem(page) {
        const li = document.createElement("li");
        li.classList.add('liPagination__style');
        li.textContent = page;

        if (currentPage === page) li.classList.add('activeLi');

        li.addEventListener("click", () => {
            currentPage = page;
            createNews(arrayNews, currentPage, newsInPage);

            let currentLi = document.querySelector('.activeLi');
            currentLi.classList.remove('activeLi');

            li.classList.add('activeLi');
        })
        return li;
    }

    createNews(arrayNews, currentPage, newsInPage);
    addPagination(arrayNews, newsInPage);
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

function cutDayTime(time) {
    return (time.length > 11) ? time.slice(0, 11 - 1) : time;
}

function cutTime(time) {
    return (time.length > 5) ? time.slice(11, 16) : time;
}

function addActiveToNav(target) {
    if (selectedSection) selectedSection.classList.remove('active')
    selectedSection = target;
    selectedSection.classList.add('active')
}