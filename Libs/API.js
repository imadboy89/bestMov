import Base64 from "./Base64";
import {Platform,AsyncStorage} from 'react-native';
class API{
    constructor(){
        this.error = null;
        this.data = null;
        this.domain = "https://egy.best";
        this .cats = ["trending","movies","movies/latest-bluray-2017-2016","tv",
                        "latest","arab"];
        this.pagenation = "?page=[page_nbr]&output_format=json&output_mode=movies_list";

        this.configs = {};
        this.proxy = "https://www.oxus.tj/sites/default/private/files/.proxy.php?url=";
        this.usingproxy = Platform.OS=="web";
        this.config_url   =  "https://raw.githubusercontent.com/imadboy89/bestMov/master/Libs/configs.json"
        this.links_manager = "http://bestmov.byethost16.com/";
        this.links_manager = "http://demoo8.vipserv.org/.index.php";
        this.links_manager = "https://www.oxus.tj/sites/default/private/files/.index.php";
    }
    
    saveLink = async (link)=>{
        const links_manager = await this.getConfigs_local("links_manager");
        if(links_manager=="Not Active"){
            return (new Promise(function(resolve, reject) {
                return false;
              }));
        }
        link = links_manager+"?action=save&link="+link+"&name="+link.split("/")[link.split("/").length-1];
        return fetch(link,{
            method: "GET",
        })
        .then(res => {
            return res.text();
        })
        .catch(error => {
            console.log(error)
            this.error = error ;
        });
    };
    getConfigs(){
        let link = this.config_url;
        if(this.usingproxy) {
            link = this.proxy+link
        }

        let headers = {Accept: 'application/json','Content-Type': 'application/json',}
          
        return fetch(link,{
            method: "GET",
            headers: headers,
            mode:"cors"
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.configs= responseJson;
            for (let i = 0; i < this.configs["action_link"].length; i++) {
                if(this.configs["action_link"][i]==""){
                    this.configs["action_link"][i] =  "Not Active";
                }else{
                    this.configs["action_link"][i] =  Base64.atob(this.configs["action_link"][i] );
                }
            }
            this.configs["links_manager"] = ("action_using" in this.configs) ? this.configs["action_link"][this.configs["action_using"]]:this.configs["action_link"][0];
            this.setConfigs();
       })
        .catch(error => {
            console.log("ERROR",error)
            this.error = error ;
        });

    }
    setConfigs = async ()=>{
        let configs  = await AsyncStorage.getItem("configs");
        if(configs){
            configs = JSON.parse(configs);
            configs["action_link"]   = this.configs["action_link"];
            configs["action_using"]  = (configs["action_using"] < configs["action_link"].length) ? configs["action_using"] : this.configs["action_using"];

            configs["links_manager"] = configs["action_link"][configs["action_using"]];
        }else{
            configs = this.configs;
            configs["webView_visible"] = true;

        }
        await AsyncStorage.setItem("configs",JSON.stringify(configs));
    }; 
    setConfig    = async (key,value)=>{
        let configs  = await AsyncStorage.getItem("configs");
        if(configs){
            configs = JSON.parse(configs);
            configs[key] = value;
            await AsyncStorage.setItem("configs",JSON.stringify(configs));
        }
    };
    getConfigs_local = async (key)=>{
        let configs  = await AsyncStorage.getItem("configs");
        configs = JSON.parse(configs);
        if(key){
            return (key in configs)?configs[key] : -1;
        }else{
            return configs;
        }
    };
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
        return fetch(link,{
            method: "GET",
            headers: headers
        })
        .then(res => {
            if(this.usingproxy) {
                this.domain = this.domain
            }else{
                this.domain = res.url.split("/")[0] + "//" + res.url.split("/")[2] ;
            }
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