class API{
    constructor(){
        this.error = null;
        this.data = null;
        this.domain = "https://egy.best";
        this .cats = ["trending","movies","movies/latest-bluray-2017-2016","tv",
                        "latest","arab"];
        this.pagenation = "?page=[page_nbr]&output_format=json&output_mode=movies_list";

        this.configs = {};
        this.proxy = "https://api.codetabs.com/v1/proxy?quest=";
        this.usingproxy = false;
        this.config_url   =  "https://raw.githubusercontent.com/imadboy89/bestMov/master/Libs/configs.json"
        this.links_manager = "http://bestmov.byethost16.com/";
        this.links_manager = "http://demoo8.vipserv.org/.index.php";
        this.links_manager = "https://www.oxus.tj/sites/default/private/files/.index.php";
    }
    saveLink(link){
        link = this.links_manager+"?action=save&link="+link+"&name="+link.split("/")[link.split("/").length-1];
        console.log("_"+link+"_");
        return fetch(link,{
            method: "GET",
        })
        .then(res => {
            console.log("ress ",res);
            return res.text();
        })
        .catch(error => {
            console.log(error)
            this.error = error ;
        });
    }
    getConfigs(){

        let headers = {Accept: 'application/json','Content-Type': 'application/json',}
          
        return fetch(this.config_url,{
            method: "GET",
            headers: headers
        })
        .then((response) => response.json())
        .then((responseJson) => {
         this.configs["action_link"]= [];
         for (let i = 0; i < responseJson["action_link"].length; i++) {
            this.configs["action_link"].push( atob(responseJson["action_link"][i] ) );
             
         }
         console.log(this.configs);
       })
        .catch(error => {
            console.log("ERROR",error)
            this.error = error ;
        });

    }
    
    parse_args(args) {
        var args_str = "&";
        for (var k in args) {
          if (typeof args[k] == "number" || typeof args[k] == "string") {
            args_str += k + "=" + args[k] + "&";
          }
        }
        return args_str;
      }
    API_get(model, page_nbr=0){
        model = (page_nbr>0) ? model+this.pagenation.replace("[page_nbr]",page_nbr) : model ;
        model = (model[0]=="/") ? model.slice(1) : model;
        let isApi = false;
        let headers = {'Content-Type': 'application/json',}
        if (model.slice(0,3)=="api"){
            isApi = true;
            headers = {};
        }
        let link = (model.slice(0,4)=="http" ) ? model : this.domain+'/'+model ;
        if(this.usingproxy) {
            link = this.proxy+link
        }
        console.log("API_get",link);
        return fetch(link,{
            method: "GET",
            headers: headers
        })
        .then(res => {
            this.domain = res.url.split("/")[0] + "//" + res.url.split("/")[2] ;
            if(res.status==401){
                this.error = 'Please Sign in first !';
                return res ;
            }

            if(page_nbr>0){
                return res.json();
            }else{
                return res.text();
            }

            
        })
        .catch(error => {
            console.log(error)
            this.error = error ;
        })

    }
}

export default API;