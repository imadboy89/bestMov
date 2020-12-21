import React from 'react';
import {  Linking  ,StyleSheet, View,Text,Button,Switch,BackHandler  } from 'react-native';
import API from "../Libs/API"
import {header_style, buttons_style} from '../Styles/styles';
import ShareBtn from "../Components/share";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create(
    {
      container: {
        flex:1,
        backgroundColor:"black"
      },
      WebViewStyle:{
        width:"100%",
        height:"50%",
      },
      hidderStyle:{
        flex:1,
        marginBottom:500,

      },
      WebViewStyle_hidden:{
        width:1,
        height:1,
      },
      text_status:{
        backgroundColor:"black",
        color:"white",
        lineHeight:30,
        fontSize:14
      },
      text_k: {
        //backgroundColor:"#34495e",
        fontSize: 16,
        fontWeight: 'bold',
        width:"40%",
        color:"white",
        textAlign: 'right'
      },
      text_v: {
        //backgroundColor:"#34495e",
        marginLeft:20,
        fontSize: 14,
        fontWeight: 'bold',
        width:"58%",
        color:"white",
        textAlign: 'left'
      },
      row_view : {
        flex: 1, 
        flexDirection: 'row' ,
        //alignItems: 'flex-start',
        alignItems: 'center',
        height : 30 ,
        marginRight:10,
        marginLeft:10,
        marginBottom:10,
        borderStyle : "solid",
        borderWidth : 1,
        textAlign: 'right',
        width:"95%",
        backgroundColor:"#34495e"
      },
    });

    class WebView_ads extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
            output:"walo",
            url:this.props.url
          };
        }
        _onNavigationStateChange(webview){
          //console.log("webviewADS ",webview.url);
        }
        render(){
          
          return (
            <WebView 
            style={styles.WebViewStyle}
            source={{ uri: this.state.url }}
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
            javaScriptEnabled={true}
            domStorageEnabled={true}            
            ref={c => {
            this.WebView = c;
            }}
            onLoad={
              e => {
                // Update the state so url changes could be detected by React and we could load the mainUrl.
                this.state.url = e.nativeEvent.url;
              }
            }
            //userAgent='Mozilla/5.0 (Linux; Android 9.0.0;) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.116 Mobile Safari/537.36'
            userAgent='Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
            />
  
          );
        }
      }
          
class WebViewScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.url = this.props.route.params.movie_link ;//.getParam("movie_link") ;
        this.movie_url = this.props.route.params.movie_url;
        this.movie_title = this.props.route.params.movie_title ;
        this.is_dl = this.props.route.params.is_dl ;
        this.quality = this.props.route.params.quality ;
        this.movie_img = this.props.route.params.movie_img ;
        //console.log("WBV ON constructor",  this.url)
        if(!this.url || this.url == undefined || this.url[0]=="/"){
          this.props.navigation.goBack();
        }
        this.state = {
          output:"walo",
          movie_link :this.url,
          movie_title:this.movie_title,
          wvVisible : true,
          links_manager :"",
          text_status:"Start",
          autoRetry :false,
          ads_url:"",
          webView_visible:true,
          movie_dl_link :"",
          movie_img :"",
        };
        this.useragent = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36";
        //this.fullScreenCmd = '$(".vjs-mute-control").click();alert($(".vjs-mute-control").text());'
        this.API_ =  new API() ;
        this.API_.getConfigs_local().then(values=>{
          this.state.webView_visible = values["webView_visible"];
          this.state.links_manager   = values["links_manager"];
        });
        this.egy_retries = 0;
        console.log(this.quality);
        this.injectedJS = `
        /*
        window.onbeforeunload = function(event) {
          if(document.location.href.includes("vidstream.to")){
            event.returnValue = "Can be Ads, don't leave!";
          }
        };
        */

         function log(data){
          try {
            window.postMessage(data);
          } catch (error) {
            alert(" win.po "+error);
          }
        }
        //alert("msg= adad");
        window_open_ori = window.open;
       window.open = function(url){
         let openInfo = {};
         openInfo["url"] = url;
         openInfo["host"] = document.location.host;
         openInfo["href"] = document.location.href;
        log(JSON.stringify(openInfo) ); 
        return {"closed":false,close:function(){return true}};
       }
      let autoRetry = 1;
        document.addEventListener("message", function(data) {
          const data_ = data.data.split("=");
          if(data_[0]=="autoRetry"){
            autoRetry=parseInt(data_[1]);
            log(data.data);
            if($("a h1.error").length && autoRetry==1
            ){
              $("a h1.error").click();
            }
          }
        });
        let quality = "`+this.quality+`".trim();
        

        function GoToVids(){
          log("msg= GoToVids");
          if($(".dls_table td.tar a.g ").length && $($(".dls_table td.tar a.g ")[0]).attr("data-url")){
            $(".dls_table td.tar a.g ").each(function(k,v){
              log("msg= "+ $($(v).parent().parent().find("td")[1]).text().trim() + "," + $($(v).parent().parent().find("td")[1]).text().trim() == quality);
              if( $($(v).parent().parent().find("td")[1]).text().trim() == quality){
                let link = $(v).attr("data-url");//.replace("&auth","");
                if(link.indexOf("&auth=")>-1){
                  log("msg= auth");
                  setTimeout(function() { 
                    document.location = link;
                  }, 3000);
                  return false;
                }
                document.location = link;
                return;
              }
           });
          }
        }
        
        function getlink(){
          if($("a.bigbutton._reload").length){
            log("trload btn");
            $("a.bigbutton._reload").click();
          }else if($("a.bigbutton").length){
            let dl_link = $("a.bigbutton").attr("href") ;
            log("_dl_="+dl_link);
            document.open();
            document.write("saving .. pls wait !");
            document.close();
            
          }
        }
        $(function(){
          setTimeout(function() { 
            if($("a h1.error").length){
              if(autoRetry==1){
                $("a h1.error").click();
              }
              log("__status__=Blocked By -vidStream-");
            }
          }, 2000);

          
          setTimeout(function() { 
            GoToVids(); 
            getlink(); 
          
          }, 1000);
          
        });
      `;
        this.originWhitelist = [
          "*.egy.*",
          "vidstream.to",
          "*.egybest.*",
        ] ;
        this.originWhitelist = ["*"];
        this.updt_count = 2;
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
  //####################### BACK HANDLER ###################################
  componentWillMount() {BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);}
  componentWillUnmount() {BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);}
  handleBackButtonClick() {
    //this.props.navigation.goBack(null);
    const history = this.props.route.params.history;
    this.props.navigation.navigate('Movie',{
      "movie" : history[history.length-1],
      history : history});
    return true;
  }
  //##########################################################

  setDl = async ()=>{
    let downloaded  = await AsyncStorage.getItem("downloaded");
    if(downloaded){
      downloaded = JSON.parse(downloaded);
    }else{
      downloaded = [];
    }
    const dl_uri_ = this.movie_url.match(/(https?:\/\/[^\/]+)?\/([^\?]+)/i);
    
    if(dl_uri_ && dl_uri_.length>=3){
      downloaded.push(dl_uri_[2]) ;
      await AsyncStorage.setItem("downloaded",JSON.stringify(downloaded));
    }
    
    
  };


    componentDidMount(){
      let API_ =  new API() ;
      this.props.navigation.setParams({
        movie_link: this.state.movie_link,
        movie_title: this.state.movie_title,
        API : API_,
       })


       this.props.navigation.setOptions({
        headerTitle: a=>{
          return (<Text style={header_style.title}>{this.state.movie_title}</Text>)
          },
          headerRight: a=>{
          return (
            <View style={header_style.container}>
              <Icon 
                style={buttons_style.button}
                size ={20}
                color="#3498db"
                
                name="external-link" 
                onPress={o => {
                  Linking.openURL(this.state.movie_link);
                }}
                title="Open"
              />
              <Icon 
                style={[buttons_style.button,{marginRight:10}]}
                size ={20}
                color="#ecf0f1"
  
                name="save" 
                onPress={o => {
                  Linking.openURL(API_.links_manager +"?action=save&link="+ this.state.movie_link+"&name="+this.state.movie_title);
                }}
                title="Save"
              />
          </View>
          )
          },
       });
    }

    onMessage(data){
      const data_ = data.nativeEvent.data.split("=");
      if (data_[0] == "msg"){
        console.log(data_[1]);
        if(data_[1].trim()=="egy_retries_aug"){
          this.egy_retries+=1;
        }
      }
      else if (data_[0] == "_dl_"){
        let link = data.nativeEvent.data.slice(5);
          this.setState({ads_url : ""});
          if(this.state.links_manager=="Not Active"){
                this.setState({
                  text_status: 'Movei Link gotted !',
                  wvVisible: false,
                  movie_dl_link: link,
                });
                return true;
          }
          
        this.API_.saveLink(link, this.movie_img).then(data=>{
          this.setDl();
          if (data.trim()==""){
            this.API_.getConfigs_local("links_manager").then(config_link=>{
              this.setState({
                text_status   : "Movei Link saved !",
                wvVisible     : false,
                movie_dl_link : link
              });
            });
            
          }else if (data===false){
            this.setState({
              text_status   : "Movie link is ready !",
              wvVisible     : false,
              links_manager : "Not activated",
              movie_dl_link : link
            });
          }else{
            this.setState({
              text_status   : "Error on saving !",
              wvVisible     : true,
              movie_dl_link : link
            });
          }
        });
      }else  if (data_[0] == "__status__"){
        this.setState({
          text_status   : data.nativeEvent.data.replace("__status__=",""),
        });
      }
      else{
        try {
          let openInfo = JSON.parse(data.nativeEvent.data);
          if ("href" in openInfo){
            //if(openInfo["url"]!=this.WebView_url && openInfo["url"]=="/cv.php"){
              const ads_url = (openInfo["url"][0]=="/") ? "http://"+openInfo["host"]+openInfo["url"] : openInfo["url"];
              //console.log("set state ads",ads_url);
              this.setState({ads_url:ads_url});
              //this.setState({WebView_ads_url:url_ads})
              
              
            //}
            //
          }
        } catch (error) {
          
        }
      }
      //console.log(data.nativeEvent.data);
    }

    _onNavigationStateChange(webViewState){
      this.WebView.postMessage("autoRetry="+( (this.state.autoRetry)?1:0 ));
      this.WebView.postMessage("egy_retries="+ this.egy_retries );
      //console.log("wbv UPDATES",webViewState.url,);
      this.WebView_url  = webViewState.url;
      const current_dom = webViewState.url.split("/")[2] ;
      if(current_dom!=this.state.text_status && !this.state.text_status.includes("Blocked")){
        this.setState({text_status:webViewState.url.split("/")[2]});
      }
    }
    render_WebView(){

      let webv =  (!this.state.wvVisible) ? null :(
          <WebView 
          style={styles.WebViewStyle }
          source={{ uri: this.state.movie_link }}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          injectedJavaScript = {this.injectedJS}
          onMessage={this.onMessage.bind(this)}
          
          originWhitelist = {this.originWhitelist}
          onLoadEnd={a=>{              
            //this.WebView.injectJavaScript (this.injectedJS);
            //console.log("Loaded");
          }}
          ref={c => {
            this.WebView = c;
            //console.log(this.originWhitelist);
          }}
          //userAgent='Mozilla/5.0 (Linux; Android 9.0.0;) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.116 Mobile Safari/537.36'
          //userAgent='Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36'
          userAgent = {this.useragent}
          />
      );

      return this.API_.isWeb ? <iframe src={this.API_.proxy+this.state.movie_link} style={{flex:1,backgroundColor: "#000",borderWidth:0}} seamless/> :webv ;
    }
    watch(){

    }
    download(){
      Linking.openURL(this.state.movie_dl_link);
    }
    render_view(){

      return (
        <View style={{height:300,}}>
          <Text style={styles.text_status}>{this.state.text_status}</Text>
          <Text style={styles.text_status} >Saved list : {this.state.links_manager}</Text>
          <Button
            disabled={this.state.movie_dl_link==""}
            title="Download / watch"
            color="green"
            onPress={()=> Linking.openURL(this.state.movie_dl_link) }
            
          />
          <Button
            disabled={true}
            title="Download2Server"
            color="#16a085"
            onPress={()=> Linking.openURL(this.state.movie_dl_link) }
            
          />
          <ShareBtn title={this.movie_title} link={this.state.movie_dl_link} disabled={this.state.movie_dl_link==""} />
          <View style={styles.row_view}>
              <Text style={styles.text_k}> AutoTry  :</Text>
              <View style={styles.text_v}>
                  <Switch 
                      style={{width:60,height:30}}
                      value = {this.state.autoRetry}
                      onValueChange={ (newValue)=> {
                        if(this.WebView){
                          this.WebView.postMessage("autoRetry="+( (newValue)?1:0 ));
                          this.setState({autoRetry: newValue});
                        }
                      }}
                  />
              </View>
          </View>
          <View style={styles.row_view}>
              <Text style={styles.text_k}> show webView  :</Text>
              <View style={styles.text_v}>
                  <Switch 
                      style={{width:60,height:30}}
                      value = {this.state.webView_visible}
                      onValueChange={ (newValue)=> {
                          this.setState({webView_visible: newValue});
                      }}
                  />
              </View>
          </View>
          <View style={styles.row_view}>
              <Text style={{backgroundColor:"#2980b9bf",color:"#ecf0f1"}}> 
              Note :
              Please ignore any demand to open app in play store (or another), or alert message.
              </Text>
          </View>
        </View>      );
    }
    render() {
      
      let ads = (this.state.ads_url=="")?null : (
        <WebView_ads url={this.state.ads_url} />
      );
        if (this.state.webView_visible==false){
          const hidder = (
            <View style={styles.hidderStyle}></View>
          );
        }
        const webviews_size = (this.state.webView_visible)?{width:"99%",height:"50%"}:{width:"1%",height:"1%"};
        return (
        <View style={styles.container} >
          {this.render_view()}
          <View style={[webviews_size,{overflow:'hidden'}]}>
            {this.render_WebView()}
            {ads}
          </View>
        </View>
        );
    
    }
}
export default WebViewScreen;
