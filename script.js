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
const API_KEY="pub_19438e432335ef1317ed1c8b1db3abe4e3d3a"
const HEADLINES_NEWS="https://newsdata.io/api/1/news?language=en&country=in&apikey="
const GENERAL_NEWS="https://newsdata.io/api/1/news?language=en&country=in&category=health&apikey="
const SPORTS_NEWS="https://newsdata.io/api/1/news?language=en&country=in&category=sports&apikey="
const TECHNOLOGY_NEWS="https://newsdata.io/api/1/news?language=en&country=in&category=technology&apikey="
const ENTERTAINMENT_NEWS="https://newsdata.io/api/1/news?language=en&country=in&category=entertainment&apikey="
const SEARCH_NEWS="https://newsdata.io/api/1/news?language=en&country=in&q="


window.onload=function(){

    fetchHeadlines();
};

general.addEventListener('click',function(){

    fetchGeneralNews();    
});
sports.addEventListener('click',function(){

    fetchSportsNews();    
});
entertainment.addEventListener('click',function(){

    fetchEntertainmentNews();    
});
technology.addEventListener('click',function(){

fetchTechnologyNews();
});
search.addEventListener('click',function(){

fetchQueryNews();
});



const fetchHeadlines = async() =>{
    const response  =await  fetch(HEADLINES_NEWS+API_KEY);
    newsDataArr=[];
    // if(response.status >=200 && response.status<300){
const myjson= await response.json();
console.log(myjson);
newsDataArr=myjson.results;
// }
// else{
    // handle errors
    // console.log(response.status,response.statusText);
// }

displayNews();
}

const fetchGeneralNews = async() =>{
    const response  =await  fetch(GENERAL_NEWS+API_KEY);
    newsDataArr=[];
    // if(response.status >=200 && response.status<300){
const myjson= await response.json();
console.log(myjson);
newsDataArr=myjson.results;
// }
// else{
//     // handle errors
//     console.log(response.status,response.statusText);
// }

displayNews();
}

const fetchSportsNews= async() =>{
    const response  = await fetch(SPORTS_NEWS+API_KEY);
    newsDataArr=[];
    // if(response.status >=200 && response.status<300){
        const myjson= await response.json();
        console.log(myjson);
        newsDataArr=myjson.results;
    // }
    // else{
    //     // handle errors
    //     console.log(response.status,response.statusText);
    // }
    
    displayNews();
}    

const fetchEntertainmentNews= async() =>{
    const response  = await fetch(ENTERTAINMENT_NEWS+API_KEY);
    newsDataArr=[];
    // if(response.status >=200 && response.status<300){
        const myjson= await response.json();
        console.log(myjson);
        newsDataArr=myjson.results;
    // }
    // else{
    //     // handle errors
    //     console.log(response.status,response.statusText);
    // }
    
    displayNews();
}    

const fetchTechnologyNews= async() =>{
    const response  = await fetch(TECHNOLOGY_NEWS+API_KEY);
    newsDataArr=[];
    // if(response.status >=200 && response.status<300){
        const myjson= await response.json();
        console.log(myjson);
        newsDataArr=myjson.results;
    // }
    // else{
    //     // handle errors
    //     console.log(response.status,response.statusText);
    // } 
    
    displayNews();
}    

const fetchQueryNews= async() =>{
    if(newsquery.value == null)
        return;

    const response  = await fetch(SEARCH_NEWS+encodeURIComponent(newsquery.value)+"&apiKey="+API_KEY);
    newsDataArr=[];
    // if(response.status >=200 && response.status<300){
        const myjson= await response.json();
        newsDataArr=myjson.results;
        console.log(myjson);
    // }
    // else{
    //     // handle errors
    //     console.log(response.status,response.statusText);
    // }
    
    displayNews();
}    

function displayNews(){
newsdetails.innerHTML="";
    if(newsDataArr.length==0){
        newsdetails.innerHTML="<h5>No Data Found..</h5>"
        return;
    }

    newsDataArr.forEach(news=>{

        var date=news.pubDate.split(' ');

        var col=document.createElement('div');
        col.className="col-sm-12 col-md-4 col-lg-3 card mb-2 rounded-2 bg-dark-subtle";

        var card=document.createElement('div');
        card.className="p-2";

        var image=document.createElement('img');
        image.setAttribute("height","matchparent");
        image.setAttribute("width","100%");
        image.src=news.image_url;

        var cardbody=document.createElement('div');

        var newsheading=document.createElement('h5');
        newsheading.className="card-title";
        newsheading.innerHTML=news.title;

        var dateheading=document.createElement('h6');
        dateheading.className='text-primary';
        dateheading.innerHTML=date[0];

        var description=document.createElement('p');
        description.className='text-muted';
       
        description.innerHTML=news.description.substring(0,250)+".......";

        var link=document.createElement('a');
        link.className="btn btn-dark";
        link.setAttribute("target","_blank");
        link.href=news.link;
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
