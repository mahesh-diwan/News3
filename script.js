// variables
const general=document.getElementById('general');
const sports=document.getElementById('sports');
const entertainment=document.getElementById('entertainment');
const technology=document.getElementById('technology');
const search=document.getElementById('search');
const newsquery=document.getElementById('newsquery');
const newstype=document.getElementById('newstype');
const newsdetails=document.getElementById('newsdetails');

// Array
var newsDataArr=[];

// apis
const API_KEY="913136a0ee5f47c2bd895b828e24d537"
const HEADLINES_NEWS="https://newsapi.org/v2/top-headlines?sources=the-times-of-india&apiKey="
const GENERAL_NEWS=" https://newsapi.org/v2/top-headlines?country=in&category=general&apiKey="
const SPORTS_NEWS="https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey="
const TECHNOLOGY_NEWS="https://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey="
const ENTERTAINMENT_NEWS="https://newsapi.org/v2/top-headlines?country=in&category=entertainment&apiKey="
const INTERNATIONAL_NEWS="https://newsapi.org/v2/top-headlines?country=us&apiKey="
const SEARCH_NEWS="https://newsapi.org/v2/everything?q="


window.onload=function(){
    newstype.innerHTML="<h4>Headlines</h4>";
    fetchHeadlines();
};

general.addEventListener('click',function(){
    newstype.innerHTML="<h4>General</h4>";
    fetchGeneralNews();    
});
sports.addEventListener('click',function(){
    newstype.innerHTML="<h4>Sports</h4>";
    fetchSportsNews();    
});
entertainment.addEventListener('click',function(){
    newstype.innerHTML="<h4>Entertainment</h4>";
    fetchEntertainmentNews();    
});
technology.addEventListener('click',function(){
    newstype.innerHTML="<h4>Technology</h4>";
fetchTechnologyNews();
});
search.addEventListener('click',function(){
    newstype.innerHTML="<h4>Search : "+newsquery.value+"</h4>";
fetchQueryNews();
});



const fetchHeadlines = async() =>{
    const response  =await  fetch(HEADLINES_NEWS+API_KEY);
    newsDataArr=[];
    if(response.status >=200 && response.status<300){
const myjson= await response.json();
console.log(myjson);
newsDataArr=myjson.articles;
}
else{
    // handle errors
    console.log(response.status,response.statusText);
}

displayNews();
}

const fetchGeneralNews = async() =>{
    const response  =await  fetch(GENERAL_NEWS+API_KEY);
    newsDataArr=[];
    if(response.status >=200 && response.status<300){
const myjson= await response.json();
console.log(myjson);
newsDataArr=myjson.articles;
}
else{
    // handle errors
    console.log(response.status,response.statusText);
}

displayNews();
}

const fetchSportsNews= async() =>{
    const response  = await fetch(SPORTS_NEWS+API_KEY);
    newsDataArr=[];
    if(response.status >=200 && response.status<300){
        const myjson= await response.json();
        console.log(myjson);
        newsDataArr=myjson.articles;
    }
    else{
        // handle errors
        console.log(response.status,response.statusText);
    }
    
    displayNews();
}    

const fetchEntertainmentNews= async() =>{
    const response  = await fetch(ENTERTAINMENT_NEWS+API_KEY);
    newsDataArr=[];
    if(response.status >=200 && response.status<300){
        const myjson= await response.json();
        console.log(myjson);
        newsDataArr=myjson.articles;
    }
    else{
        // handle errors
        console.log(response.status,response.statusText);
    }
    
    displayNews();
}    

const fetchTechnologyNews= async() =>{
    const response  = await fetch(TECHNOLOGY_NEWS+API_KEY);
    newsDataArr=[];
    if(response.status >=200 && response.status<300){
        const myjson= await response.json();
        console.log(myjson);
        newsDataArr=myjson.articles;
    }
    else{
        // handle errors
        console.log(response.status,response.statusText);
    } 
    
    displayNews();
}    

const fetchQueryNews= async() =>{
    if(newsquery.value == null)
        return;

    const response  = await fetch(SEARCH_NEWS+encodeURIComponent(newsquery.value)+"&apiKey="+API_KEY);
    newsDataArr=[];
    if(response.status >=200 && response.status<300){
        const myjson= await response.json();
        newsDataArr=myjson.articles;
        console.log(myjson);
    }
    else{
        // handle errors
        console.log(response.status,response.statusText);
    }
    
    displayNews();
}    

function displayNews(){
newsdetails.innerHTML="";
    if(newsDataArr.length==0){
        newsdetails.innerHTML="<h5>No Data Found..</h5>"
        return;
    }

    newsDataArr.forEach(news=>{

        var date=news.publishedAt.split('T');

        var col=document.createElement('div');
        col.className="col-sm-12 col-md-4 col-lg-3 card rounded-2";

        var card=document.createElement('div');
        card.className="p-2 ";

        var image=document.createElement('img');
        image.setAttribute("height","matchparent");
        image.setAttribute("width","100%");
        image.src=news.urlToImage;

        var cardbody=document.createElement('div');

        var newsheading=document.createElement('h5');
        newsheading.className="card-title";
        newsheading.innerHTML=news.title;

        var dateheading=document.createElement('h6');
        dateheading.className='text-primary';
        dateheading.innerHTML=date[0];

        var description=document.createElement('p');
        description.className='text-muted';
        description.innerHTML=news.description;

        var link=document.createElement('a');
        link.className="btn btn-dark";
        link.setAttribute("target","_blank");
        link.href=news.url;
        link.innerHTML="Read More";
        
        cardbody.appendChild(newsheading);
        cardbody.appendChild(dateheading);
        cardbody.appendChild(description);
        cardbody.appendChild(link);

        card.appendChild(image);
        card.appendChild(cardbody);

        col.appendChild(card);

        newsdetails.appendChild(col);



    });

}