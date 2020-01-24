import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage,ScrollView,BackHandler ,Image,Linking,Modal,TouchableHighlight  } from 'react-native';
import MoviesAPI from "../Libs/MoviesAPI"
import loader from "../Components/Loader"
import {header_style,buttons_style} from "../Styles/styles";
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
      backgroundColor: 'black',
      flex:1,
      flexDirection: 'column',
      


  },
  row : {
    flex: 1, 
    flexDirection: 'row' ,
    //alignItems: 'flex-start',
    alignItems: 'center',
    height : 30 ,
    marginRight:20,
    marginLeft:20,
    borderStyle : "solid",
    borderWidth : 1,
    textAlign: 'right',
    width:"95%",
  },
  story : {
    marginRight:20,
    marginLeft:20,
    borderStyle : "solid",
    borderWidth : 1,
    textAlign: 'right',
    width:"95%",
    marginBottom:20,
    marginTop:10,
    lineHeight : 40,
  },
  btn_dl: {
    flex: 1, 
    flexDirection: 'row' ,
    //alignItems: 'flex-start',
    alignItems: 'center',
    height : 30 ,
    width : "98%",
    paddingBottom:5,
    textAlign: 'right',
  },
  row_q : {
    flex: 1, 
    flexDirection: 'column' ,
    //alignItems: 'flex-start',
    //alignItems: 'flex-end',
    height : 30 ,
    width : 100,
    borderStyle : "solid",
    borderWidth : 1,
    textAlign: 'right',
    
  },
  title: {
      
      fontSize: 18,
      color: '#000',
  },
  story_k: {
    backgroundColor:"#53634e",
    fontSize: 16,
    fontWeight: 'bold',
    width:"98%",
    color:"white",
    textAlign: 'right'
  },
  story_v: {
    backgroundColor:"#7f8c8d",
    fontSize: 14,
    fontWeight: 'bold',
    width:"98%",
    color:"white",
    textAlign: 'right',
    lineHeight : 25,
  },
  text_k: {
    backgroundColor:"#34495e",
    fontSize: 16,
    fontWeight: 'bold',
    width:"25%",
    color:"white",
    textAlign: 'right'
  },
  text_v: {
    backgroundColor:"#34495e",
    fontSize: 14,
    fontWeight: 'bold',
    width:"75%",
    color:"white",
    textAlign: 'right'
  },
  image: {
      flex:1,

  },
});


class MovieScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output:"walo",
      movie :false,
      isFav:false,
      modalVisible:false,
      downloaded:[],
    };
    this.MAPI = new MoviesAPI();
    this.link = this.getparam("link")
    this.getMovie(this.link);
    this.history = this.props["navigation"].getParam("history") ? this.props["navigation"].getParam("history") : [];
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.current_ind = -1;

    this.getingMovie = false;


    this.didBlurSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.getDl();
      }
    );
  }
  //####################### BACK HANDLER ###################################
  componentWillMount() {BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);console.log("willmount");}
  componentWillUnmount() {BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);console.log("willUNmount");}
  handleBackButtonClick() {
    if(this.history.length<=1 ){
      this.props.navigation.goBack(null);
    }else{
      this.history = this.history.slice(0,this.history.length-1);
      movie = this.history[this.history.length-1];
      this.setState({"movie":movie});
      this.props.navigation.setParams(movie);
      
    }
    return true;
  }
  //##########################################################
  componentDidMount(){
    this.props.navigation.setParams({
      movie_title: "Movie",
      deleteMovieCache : this.deleteMovieCache,
      setFav:this.setFav,
      isFav : this.state.isFav,

     });
  }
  static navigationOptions =  ({ navigation  }) => ({
    headerStyle: header_style.header,
    headerTitle: a=>{
        const {state} = navigation;
        return (<Text style={header_style.title}>{navigation.getParam("movie_title")}</Text>)},
    headerRight: a=>{
      const {params = {}} = navigation.state;
      return (
        <View style={{flex:1,flexDirection:"row"}} >
          { params.movie_title && params.movie_title!="Movie" && params.movie_title.trim()!="" &&
          <Icon
            name={(params.isFav)?"heart":"heart-o"}
            style={[buttons_style.button,{color:"#e74c3c"}]}
            
            onPress={ () => params.setFav(!params.isFav) }
            title="Save"
          />
          }
          <Icon
            style={[buttons_style.button,{marginRight:10}]}

            name="refresh"
            onPress={ () => params.deleteMovieCache() }
            title="reFresh"
          />
        </View>
      )
      },

  });

  getVid(dl_link, quality){
    is_dl   = (dl_link[0]=="/") ? true : false;
    dl_link = (dl_link[0]=="/") ? this.MAPI.API.domain + dl_link : dl_link ;
    if(this.state.movie instanceof Object){
      if(quality){
        this.props.navigation.navigate('WebViewer',{
          movie_link:dl_link, 
          movie_url:this.link,
          movie_img:this.state.movie.img,
          movie_title:this.getparam("title"),
          is_dl:is_dl,quality:quality,
          history:this.history
        });
      }else{
        this.props.navigation.navigate('Watch_WV',{
          movie_link:dl_link,
          movie_url:this.link, 
          movie_title:this.getparam("title"),
          history:this.history
        });
      }
    }
    
    /*
    this.MAPI.getDlLink(dl_link).then(link=> {
      console.log(link);
      this.props.navigation.navigate('WebViewer',{link:dl_link})
    });
*/
    
    
  }
  deleteMovieCache = async ()=>{
    let movies_local = await AsyncStorage.getItem("movies")
    movies_local = JSON.parse(movies_local);
    delete movies_local[this.link]
    await AsyncStorage.setItem("movies", JSON.stringify(movies_local) )
    this.setState({"movie":false});
    this.history.pop();
    this.getMovie(this.link);
    //AsyncStorage.setItem("last_history", JSON.stringify(this.history) )
  }
  setMovie = async (data , link, setlocal=true)=>{
    this.history.push(data);
    //AsyncStorage.setItem("last_history", JSON.stringify(this.history) )
    this.getFav();
    this.setState({"movie":data});
    this.props.navigation.setParams({movie_title: data.title, });
    // local storage
    if (setlocal){
      let movies_local = await AsyncStorage.getItem("movies")
      movies_local = JSON.parse(movies_local);
      movies_local[link] = data;
      await AsyncStorage.setItem("movies", JSON.stringify(movies_local) );
    }
  }
  getDl = async ()=>{
    downloaded  = await AsyncStorage.getItem("downloaded");
    if(downloaded){
      downloaded = JSON.parse(downloaded);
    }else{
      downloaded = [];
    }
    this.setState({downloaded:downloaded});
  };
  setFav = async (isFav)=>{
    let favorites  = await AsyncStorage.getItem("favorites");
    if(favorites){
      favorites = JSON.parse(favorites);
    }else{
      favorites = {};
    }
    if(isFav){
      favorites[this.link] = this.state.movie;
    }else{
      delete favorites[this.link];
    }

    await AsyncStorage.setItem("favorites",JSON.stringify(favorites));

    this.props.navigation.setParams({isFav:isFav});
    this.setState({isFav:isFav});
  };
  getFav = async ()=>{
    let favorites  = await AsyncStorage.getItem("favorites");
    if(favorites){
      favorites = JSON.parse(favorites);
      if(this.link in favorites){
        this.setState({isFav:true});
        this.props.navigation.setParams({isFav:true});
      }
    }else{
      await AsyncStorage.setItem("favorites","{}");
    }
  };
  getMovie = async (link)=>{
    this.link = link;
    this.getingMovie = true;
    let movies_local  = await AsyncStorage.getItem("movies");
    
    if(movies_local){
      movies_local = JSON.parse(movies_local);

      if (link in movies_local){
        this.setMovie(movies_local[link],link,false);
      }else{
        if(!link){return false;}
        this.MAPI.getMovie(link).then(
          data=>{
            this.setMovie(data,link);
          }
        );
      }
      
    }else{
      await AsyncStorage.setItem("movies","{}");
      this.MAPI.getMovie(link).then(
        data=>{
          this.setMovie(data,link);
        }
      );
    }
    this.getingMovie = false
  }

  getparam(param){
    return this.props["navigation"].getParam("movie")[param] ;
  }
  modal(){
    if(this.MAPI.API.isWeb){
      return null;
    }
    return(
      <Modal 
      animationType="slide"
      transparent={true}
      visible={this.state.modalVisible}
      onRequestClose={() => { this.setState({ modalVisible:false,}); } }
    >
      <View style={{flex:.1,backgroundColor:"black"}}></View>
      <View style={{flex:1,backgroundColor:"black"}}>
        <Image 
        source={{ uri: this.state.movie.img }} 
        style={{flex:1}}
        resizeMode={'contain'}
        />

          <Button
            style={{marginTop:50}}
            title="Close"
            color="#34495e"
            onPress={()=>{
              this.setState({modalVisible:false,});
            }}
          ></Button>
      </View>
      <View style={{flex:.1,backgroundColor:"black"}}></View>

    </Modal>
    );
  }
  render() {

    let link_last = "";
    let props = (!this.state.movie)? loader : Object.keys(this.state.movie).map( key =>{
      value = this.state.movie[key] ;
      if (key=="dl"){
        
          let dl = value.map( (dl_q_table,vv) =>{
            let dl_q = Object.keys(dl_q_table).map( (q_k,vvv) =>{
              if (q_k=="dl_link") return "";
              return dl_q_table[q_k]+"  ";

            });
            link_last = dl_q_table["dl_link"];
            return (
              <Button style={styles.btn_dl} 
              key={Math.random()} 
              title={dl_q.join(" | ")}
              color= {(dl_q[0].trim().toLowerCase()=="watch")?"#16a085":"#2980b9"}
              onPress={() => {
                if(dl_q.length>=3){
                  this.getVid(this.link,dl_q[1]);
                }else{
                  this.getVid(dl_q_table["dl_link"]);
                }
                
              }} 
               />
              );
          });
          return dl;

      }else if(key=="episode" || key=="season"){
        let dl = value.map( (ep_se,vv) =>{
          
          return (
            <Button style={styles.btn_dl} 
            key={Math.random()} 
            title={ep_se.title}
            color= { 
            this.state.downloaded && typeof this.state.downloaded == "object" && 
            ep_se.url && ep_se.url.split && 
            ep_se.url.match(/(https?:\/\/[^\/]+)?\/([^\?]+)/i) && 
            ep_se.url.match(/(https?:\/\/[^\/]+)?\/([^\?]+)/i).length>=3 &&
            this.state.downloaded.indexOf(ep_se.url.match(/(https?:\/\/[^\/]+)?\/([^\?]+)/i)[2] )==-1

            ? "#2980b9" :"#2e5671"  }
            onPress={() => {
                this.setState({"movie":false});
                this.getMovie(ep_se.url);
                //this.current_ind=this.current_ind+1
                //this.props.navigation.navigate('Movie',{movie_title:ep_se.title,link:ep_se.url});
                //this.props.navigation.navigate('NavigationDispatcher', { to: 'Movie', movie_title:ep_se.title,link:ep_se, goBack: 'Movie' })
            }} 
             />
            );
        });
        return (
          <View key={Math.random()} style={{margin:20,}} >
            <Text style={{color:"orange",backgroundColor:"#2c3e50",fontSize: 18}}> {key} </Text>
            {dl}
          </View>
        );
      }else if(key=="story"){
        return (    
          <View style={styles.story} key={Math.random()}>
            <Text style={styles.story_k}>  {key} </Text>
            <Text style={styles.story_v}> {value} </Text>
          </View>);
      }else if (key=="trailer"){
        return (   <Button style={styles.btn_dl} 
        key={Math.random()} 
        title="Watch Trailer"
        color="gray"
        onPress={() => {
          Linking.openURL(this.state.movie["trailer"]);
        }} 
         />);
      }
      if(key=="img") {
        return;
      }
      if(key=="title"){
        value=this.getparam("title");
      }
      if(key=="link"){
        return;
      }
      return (    
      <View style={styles.row} key={Math.random()}>
        <Text style={styles.text_v}> {value} </Text>
        <Text style={styles.text_k}>  {key} </Text>
      </View>);
    });
    let actual_page=(              
      <Button style={styles.btn_dl} 
        key={Math.random()} 
        title="Movie page"
        color= "#8e44ad"
        onPress={() => this.getVid( this.link,link_last )} 
         />);
    if(this.state.movie instanceof Object && "img" in this.state.movie){
      this.state.movie.img = (this.state.movie.img.slice(0,4)=="http") ?this.state.movie.img :"https:"+this.state.movie.img;
    }
    let img_tag = (this.state.movie instanceof Object && this.state.movie.img) ? (
      <TouchableHighlight onPress={() => this.setState({modalVisible:true})}>
        <Image 
        source={{ uri: this.state.movie.img }} 
        style={{height:400}}
        resizeMode={'contain'}
        />
     </TouchableHighlight>
    ) : (<Text></Text>); 
    return (

          <ScrollView style={styles.container}>
            <View style={{flex:1}}  >
              {img_tag}
            </View>
            {props}
            {actual_page}
            {this.modal()}
          </ScrollView>

    );
  }

}

export default MovieScreen;