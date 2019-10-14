import API from "./API"
import DomSelector from 'react-native-dom-parser';
class MoviesAPI{
    constructor(){
        this.error = null;
        this.movies = null;
        this.API = new API();
        }
    
    htmlentities(str){
        try {
            let str_ =  String(str).replace(/&amp;/g, '&').replace(/lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
            str_ = str_.replace(/&bull;/g,'').replace(/•/g,'').replace(/&nbsp;/g," ");

            return str_;
        } catch (error) {
            return str;
        }
        
    }
    saveLink(link){
        return this.API.saveLink(link);
    }
    getText(element,returnhtml=false){
        if (element instanceof Object && "firstChild" in element){
            if ( !(element.firstChild instanceof Object) || !("text" in element.firstChild) ){
                return this.getText(element.firstChild);
            }
            let text = element.firstChild.text;
            if (text.includes("<") && returnhtml==false){
                return this.getText(element.firstChild)
            }else{
                return this.htmlentities(text);
            }
        }else{
            return undefined;
        }
    }
    getTextAll(element,thrds=false){
        if (element instanceof Object && "firstChild" in element){
            if ( !(element.firstChild instanceof Object) || !("text" in element.firstChild) ){
                return this.getText(element.firstChild,true);
            }
            let textAll = "";
            for (let i = 0; i < element.children.length; i++) {
                const child = element.children[i];
                let text = child.text;
                if (text.includes("<") ){
                    if (thrds){
                        return this.getText(child)
                    }else{
                        try {
                            textAll += " "+this.getText(child).trim();
                        } catch (error) {
                            
                        }
                        
                    }
                }else{
                    if (thrds){
                        return text;
                    }else{
                        textAll += " "+this.htmlentities(text).trim();
                    }
                }
            }
            return textAll;
        }else{
            return "";
        }
    }
    getDlLink(link){
        return this.API.API_get(link,-1).then(
            data=>{
                let movies = [];
                
            
            }
        );
    }
    getStory(rootNode){
        try {
            const bdbs = rootNode.getElementsByClassName("bdb");
            for (let i = 0; i < bdbs.length; i++) {
                const element = bdbs[i];
                const strong_txt = this.getText(element.getElementsByTagName("strong")[0]).trim() ;
                if (strong_txt=="القصة"){
                    return this.getTextAll(element.parent.getElementsByTagName("div")[2]);
                }
                
            }
    
        } catch (error) {
            return "";
        }
    }
    getTrailer(rootNode){
        try {
            return rootNode.getElementById("yt_trailer").getElementsByClassName("play")[0].attributes.url;            
        } catch (error) {
            return "";
        }
    }   
    getMovie(link){
        return this.API.API_get(link,-1).then(
            data=>{
                let movie = {};
                const rootNode = DomSelector(data);
                if (rootNode ){

                    let movieTable = rootNode.getElementsByClassName("movieTable")[0];
                    movie["trailer"] = this.getTrailer(rootNode);
                    movie["link"] = link;
                    movie["title"] = this.getTextAll(movieTable.getElementsByClassName("movie_title")[0]);
                    //$(".movie_img img").attr("src")
                    movie["img"] = rootNode.getElementsByClassName("movie_img")[0].getElementsByTagName("img")[0].attributes.src;
                    let movie_tr = movieTable.getElementsByTagName("tr");
                    for (var i=0;i<movie_tr.length;i++){
                        movie_tr[i];
                        let td = movie_tr[i].getElementsByTagName("td");
                        if (td.length <= 1 ){
                            continue
                        }
                        movie[ this.getTextAll(td[0]) ] = this.getTextAll(td[1]);
                    }
                    //$($(".mbox .bdb strong")[1]).text()
                    movie["story"] = this.getStory(rootNode)
                    //return movie;
                    //$("#watch_dl iframe").attr("src")
                    movie["dl"] = [];
                    try {
                        movie["dl"][0] = {"quality" :"WATCH","dl_link": rootNode.getElementById("watch_dl").getElementsByTagName("iframe")[0].attributes.src };
                    } catch (error) {
                        //$(".contents.movies_small")
                        //rootNode.getElementsByClassName("contents").length
                        
                        let types =  rootNode.getElementsByClassName("movies_small");
                        for (let i = 0; i < types.length; i++) {
                            const element = types[i];
                            let mov_ep = element.getElementsByTagName("a");
                            let url_test = mov_ep[0].attributes.href;
                            let type= url_test.split("/")[3];
                            if( type=="season" ||type=="episode" ){
                                movie[type] = [];
                                for (let j = 0; j < mov_ep.length; j++) {
                                    const ep_se = mov_ep[j];
                                    let se_ep_attrs = {}
                                    se_ep_attrs["title"] = this.getText(ep_se.getElementsByClassName("title")[0]);
                                    se_ep_attrs["url"] =ep_se.attributes.href
                                    movie[type].push(se_ep_attrs)   
                                }
                            }
                            
                        }
                    }
                    if(movie["dl"].length>0){
                        let movie_dl_t = rootNode.getElementsByClassName("dls_table");//.getElementsByClassName("dls_table")[0];
                        if (movie_dl_t instanceof Object){
                            let movie_dl = movie_dl_t[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                            let movie_header_th = movie_dl_t[0].getElementsByTagName("thead")[0].getElementsByTagName("th");
                            let movie_h = [];
                            for (var i=0;i<movie_header_th.length;i++){
                                movie_h.push ( this.getText( movie_header_th[i] ) );
                            }
                            for (var i=0;i<movie_dl.length;i++){
                                let td = movie_dl[i].getElementsByTagName("td");
                                if( td.length >= 2){
                                    let dl_ = {};
                                    for (var j=0;j<movie_h.length;j++){
                                        a_link = td[j].getElementsByClassName("g") ;
                                        value = td[j] ;
                                        if (a_link && a_link.length> 0){
                                            value = a_link[0].attributes["data-url"];
                                            dl_["dl_link"] = value;
                                            continue;
                                        }
                                        dl_[movie_h[j]] = this.getText(value);
                                        
                                    }
                                    movie["dl"].push(dl_);
                                }

                            }
                        }
                    }
                }
                return movie;
            
            }
        );
    }

    getMovies(cat,page){
        return this.API.API_get(cat,page).then( 
            data=>{
                let movies = [];
                let rootNode;
                if (data instanceof Object && "html" in data ){
                    rootNode = DomSelector(data["html"]);
                }else{
                    rootNode = DomSelector(data);
                    rootNode = rootNode.getElementsByClassName("movies")[0];
                }

                let ahrefs = rootNode.getElementsByClassName("movie");
                //console.log(data);
                for (var i =0;i<ahrefs.length;i++){
                    let movie = {};
                    movie["link"]    = ahrefs[i].attributes.href;
                    movie["rating"]  = this .getText(ahrefs[0].getElementsByClassName("rating")[0]);
                    movie["img"]     = "https:"+ahrefs[i].getElementsByTagName("img")[0].attributes.src;
                    movie["quality"] = this .getText(ahrefs[i].getElementsByClassName("ribbon")[0]);
                    movie["title"]   = this .getText(ahrefs[i].getElementsByClassName("title")[0]);
                    movie["key"]     = movie["title"]
                    movies.push(movie);
                }
                
                return movies;
            
            }
        );
    }
}

export default MoviesAPI;