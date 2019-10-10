import React from 'react';
import {  Linking ,WebView ,StyleSheet, View,Text,Button  } from 'react-native';
import MoviesAPI from "../Libs/MoviesAPI"
import API from "../Libs/API"
const styles = StyleSheet.create(
    {
      container: {
        flex: 1,
      },
      WebViewStyle:{
        flex:1,
      }
    });

class WebViewScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.url = this.props["navigation"].getParam("movie_link") ;
        this.movie_title = this.props["navigation"].getParam("movie_title") ;
        this.is_dl = this.props["navigation"].getParam("is_dl") ;
        this.quality = this.props["navigation"].getParam("quality") ;
        //console.log("WBV ON constructor",  this.url)
        if(!this.url || this.url == undefined || this.url[0]=="/"){
          this.props.navigation.goBack();
        }
        this.state = {
          output:"walo",
          movie_link :this.url,
          movie_title:this.movie_title,
          wvVisible : true
        };
        console.log(this.movie_title,this.state.movie_title);
        //this.fullScreenCmd = '$(".vjs-mute-control").click();alert($(".vjs-mute-control").text());'
        this.API_ =  new API() ;
        let savelink = this.API_.links_manager +"?action=save&link=[movie_link]&name="+this.movie_title;
        this.injectedJS = `
        /*
        window.onbeforeunload = function(event) {
          if(document.location.href.includes("vidstream.to")){
            event.returnValue = "Can be Ads, don't leave!";
          }
        };
        */
        let quality = "`+this.quality+`".trim();
        
        function log(data){
          try {
            window.postMessage(data);
          } catch (error) {
            alert(" win.po "+error);
          }
        }
        function GoToVids(){
          if($(".dls_table td.tar a.g ").length && $($(".dls_table td.tar a.g ")[0]).attr("data-url")){
            $(".dls_table td.tar a.g ").each(function(k,v){
              
              if( $($(v).parent().parent().find("td")[1]).text().trim() == quality){
                document.location = $(v).attr("data-url");
                return;
              }
           });
          }
        }
        function getlink(){
          if($("a.bigbutton._reload").length){
            $("a.bigbutton._reload").click();
            //document.location = "`+savelink+`".replace("[movie_link]","test");
          }else if($("a.bigbutton").length){
            let dl_link = $("a.bigbutton").attr("href") ;
            log("_dl_="+dl_link);
            /*
            document.open();
            document.write("saving .. pls wait !");
            document.close();
            */
          }
        }
        $(function(){

          //log("open Dev hhh");
          
          setTimeout(function() { 
            GoToVids(); 
            getlink(); 
          
          }, 100);
          
        });
      `;
        this.originWhitelist = [
          "*.egy.*",
          "vidstream.to",
          "*.egybest.*",
        ] ;
        
        this.updt_count = 2;
    }

    componentDidMount(){
      API_ =  new API() ;
      this.props.navigation.setParams({
        movie_link: this.state.movie_link,
        movie_title: this.state.movie_title,
        API : API_,
       })
    }
    static navigationOptions =  ({ navigation  }) => ({
      headerTitle: a=>{
          const {state} = navigation;
          return (<Text>{state.params.movie_title}</Text>)},
      headerRight: a=>{
        const {state} = navigation;
        return (
          <View style={{flex:1,flexDirection:"row"}}>
        <Button style={{backgroundColor:"#141514"}}
          color="black"
          onPress={o => {
            Linking.openURL(state.params.movie_link);
          }}
          title="Open"
        />
        <Button style={{backgroundColor:"black"}}
          onPress={o => {
            Linking.openURL(state.params.API.links_manager +"?action=save&link="+ state.params.movie_link+"&name="+state.params.movie_title);
          }}
          title="Save"
        />
        </View>
        )
        },
    });
    onMessage(data){
      
      if (data.nativeEvent.data.slice(0,4) == "_dl_"){
        let link = data.nativeEvent.data.slice(5);
        this.API_.saveLink(link).then(data=>{
          if (data.trim()==""){
            console.log("saved saccessfully");
          }else{
            console.log(data)
          }
        });
      }
      console.log(data.nativeEvent.data);
    }
    _onNavigationStateChange(webViewState){
      console.log("wbv UPDATES",webViewState.url,);
      /*
      if( this.updt_count>0  && webViewState.url.split("/")[2]!=" vidstream.to"){
        //this.WebView.injectJavaScript (this.injectedJS);
        //this.WebView.injectedJavaScript = this.injectedJS
        this.updt_count = this.updt_count-1;
      }else{
       // this.WebView.injectJavaScript (this.injectedJS_vidstr);
      }
      if(this.url.split("/")[2]!=webViewState.url.split("/")[2]){
        if(webViewState.url.split("/")[2]==" vidstream.to"){

        }else{
        //this.WebView.stopLoading();
        //Linking.openURL(webViewState.url);
        //this.props.navigation.goBack();
        //this.WebView.goBack();
        }
      }
      */

    }
    render() {
        
        return (
        <View style={styles.container} >
            <WebView 
            visible={this.state.wvVisible}
            style={styles.WebViewStyle}
            source={{ uri: this.state.movie_link }}
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            injectedJavaScript = {this.injectedJS}
            onMessage={this.onMessage}
//            thirdPartyCookiesEnabled={false}
            
            //originWhitelist = {this.originWhitelist}
            onLoadEnd={a=>{
              
              //this.WebView.injectJavaScript (this.injectedJS);
              //console.log("Loaded");
            } }
            
            ref={c => {
              this.WebView = c;
              //console.log(this.originWhitelist);
            }}


            userAgent='Mozilla/5.0 (Linux; Android 9.0.0;) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.116 Mobile Safari/537.36'
                      

            />
        </View>
        );
    
    }
}
export default WebViewScreen;