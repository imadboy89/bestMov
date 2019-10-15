import React from 'react';
import {  Linking ,WebView ,StyleSheet, View,Text,Dimensions ,StatusBar,BackHandler  } from 'react-native';

const screenWidth  = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const trans =  [
            { rotate: "90deg" }, 
            { translateX: screenWidth/1.9}, 
            { translateY: screenHeight /3.9}];

const styles = StyleSheet.create(
    {
        container: {
            backgroundColor:"black",
            flex:1
        },
      wbv_container: {
        width : screenHeight,
        height : screenWidth,
        backgroundColor:"black",
        transform:trans ,
      },
      WebViewStyle:{
        //flex:1,
        overflow:'hidden',
        width: "100%",
        height: "100%",

      }, 
    });
 
class Watch_WVScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.url = this.props["navigation"].getParam("movie_link") ;
        this.movie_title = this.props["navigation"].getParam("movie_title") ;
        //console.log("WBV ON constructor",  this.url)
        if(!this.url || this.url == undefined || this.url[0]=="/"){
          this.props.navigation.goBack();
        }
        this.state = {
          output:"walo",
          movie_link :this.url,
          movie_title:this.movie_title,
        };
        
        this.injectedJS = `
        window.onbeforeunload = function(event) {
          if(document.location.href.includes("vidstream.to")){
            event.returnValue = "Can be Ads, don't leave!";
          }
        };
      `;

        this.originWhitelist = ["*"];
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
  //####################### BACK HANDLER ###################################
  componentWillMount() {BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);}
  componentWillUnmount() {BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);}
  handleBackButtonClick() {
    //this.props.navigation.goBack(null);
    const history = this.props["navigation"].getParam("history");
    this.props.navigation.navigate('Movie',{
      "movie" : history[history.length-1],
      history : history});
    return true;
  }
  static navigationOptions =  ({ navigation  }) => ({
    header: null,
   });
  //##########################################################

    watch(){

    }
    download(){
      Linking.openURL(this.state.movie_dl_link);
    }
    render() {
        return (
            <View style={styles.container}>
            <View style={styles.wbv_container} >
                <StatusBar hidden />
            <WebView 
            style={styles.WebViewStyle }
            source={{ uri: this.state.movie_link }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            injectedJavaScript = {this.injectedJS}
            
            originWhitelist = {this.originWhitelist}
            onLoadEnd={a=>{              
                //this.WebView.injectJavaScript (this.injectedJS);
                //console.log("Loaded");
            }}
            ref={c => {
                this.WebView = c;
                //console.log(this.originWhitelist);
            }}
            userAgent='Mozilla/5.0 (Linux; Android 9.0.0;) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.116 Mobile Safari/537.36'
            />

            </View>
            </View>
        );
    
    }
}
export default Watch_WVScreen;
