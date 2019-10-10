class API{
    constructor(){
        this.error = null;
        this.data = null;
        this.domain = "https://egy.best";
        this .cats = ["trending","movies","movies/latest-bluray-2017-2016","tv",
                        "latest","arab"];
        this.pagenation = "?page=[page_nbr]&output_format=json&output_mode=movies_list";


        this.proxy = "https://api.codetabs.com/v1/proxy?quest="
        this.usingproxy = false;
        this.pastbin = 
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
        let data = {};
        data["api_option"]    = "show_paste";
        data["api_dev_key"]   = 'aec7393433da976ee057826eb220d005';
        data["api_user_key"]  = '3b0b9910bca9880167c935c06842fc6f';
        data["api_paste_key"] = "2hgTjwrQ";
        let url 			  = 'https://pastebin.com/api/api_raw.php';
        console.log(data);
        let headers = {Accept: 'application/json','Content-Type': 'application/json',}
          
        return fetch(url,{
            method: "POST",
            body: JSON.stringify(data),
            headers: headers
        })
        .then((response) => response.text())
        .then((responseJson) => {
         console.log("success api call",responseJson);
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