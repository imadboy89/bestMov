import React from 'react';
import { Button,View, Text, StyleSheet, ImageBackground , FlatList, TouchableHighlight,AsyncStorage} from 'react-native';
import { withNavigation } from 'react-navigation';
import loader from "../Components/Loader"
import MoviesAPI from "../Libs/MoviesAPI"
import Icon from 'react-native-vector-icons/FontAwesome';
const styles = StyleSheet.create({
    container: {
        marginTop:20,
        marginLeft:20,
        marginRight:20,
        height:300,
        
        //backgroundColor: '#a4ccf3',
        backgroundColor: "black"
    },
    title: {
        fontSize: 18,
        color : "white",
        
    },
    container_text: {
        backgroundColor:"#34495e",
        justifyContent: 'center',
    },
    description: {
        fontSize: 11,
        fontStyle: 'italic',
    },
    image: {
        flex:1,

    },
});
class MovieRow_ extends React.Component {
    render() {
        return (
            <TouchableHighlight 
            onPress={() => this.props.navigation.navigate('Movie',{movie:this.props.movie})} >
            <View  style={styles.container} >
                { this.props.movie.img!="" &&
                <View style={{flex:1,backgroundColor:"black",borderStyle:"solid",borderWidth:1,borderColor:"white"}}>
                    
                    <ImageBackground source={{ uri: this.props.movie.img }} style={styles.image} >
                        <View style={{justifyContent: 'center', alignItems: 'center',backgroundColor:"#2c3e5094",flexDirection:"row",color:"white"}}>
                            <Text style={{width:"49%",fontSize:18,color:"white"}}>Rating : {this.props.movie.rating ? this.props.movie.rating : "-"}</Text>
                            <Text style={{width:"49%",fontSize:18,color:"white"}}>Quality : {this.props.movie.quality ? this.props.movie.quality : "-"}</Text>
                        </View>
                    </ImageBackground>

                </View>
                }
                <View style={styles.container_text}>
                    <Text style={styles.title}>
                        {this.props.movie.title}
                    </Text>
                </View>
    
             </View>
             </TouchableHighlight>
        );
      }
    
    }
    export const MovieRow = withNavigation(MovieRow_);


    class MoviesListview extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
              output:"walo",
              mlist :[  ],
              page : 1,
            };
            this.cat = "";
            this.MAPI = new MoviesAPI();
            this.MAPI.API = this.props.API;
          }
          getMovies_favorites = async ()=>{
            let favorites  = await AsyncStorage.getItem("favorites");
            if(favorites){
              favorites = JSON.parse(favorites);
            }else{
              favorites = {};
            }
            console.log(Object.values(favorites))
            return Object.values(favorites);
        }
        getMoviesList(cat){
            if(cat==""){
                return
            }
            if(cat=="Favorites"){
                this.getMovies_favorites().then(favs=>{
                    this.setState({"mlist":favs});
                });
            }
            const page = (cat[0]=="/")?-1:this.state.page;
            const cat_page= cat+"_"+page;
            this.getMoviesList_local(cat_page).then(data => {
                if(data){
                    this.setState({"mlist":data});
                }else{
                    
                    this.MAPI.getMovies(cat,page).then(
                      data=>{
                        this.setMoviesList_local(cat_page,data);
                        this.setState({"mlist":data});
                      }
                    );

                }
            });

          }
        setMoviesList_local(cat,new_data){
            AsyncStorage.getItem("cat").then(data=>{
                if(data){
                    data = JSON.parse(data);
                    data[cat] = new_data;
                    AsyncStorage.setItem("cat",JSON.stringify(data) );
                }else{
                    data = {cat:new_data};
                    AsyncStorage.setItem("cat",JSON.stringify(data));
                }
                
            });
        }
        getMoviesList_local(cat){
            return AsyncStorage.getItem("cat").then(data=>{
                if(data){
                    data = JSON.parse(data);
                    if(cat in data){
                        return data[cat] ;
                    }else{
                        return false;
                    }
                }else{
                    AsyncStorage.setItem("cat","{}");
                    return false;
                }
            });
        }
        emptyMsg(){
            return (
                <Text style={{height:600,color:"white"}} >There is no Results for  [{this.q}] .</Text>
            );
        }
        render() {
            if(this.cat != this.props.cat){
                this.state.mlist = false;
                this.state.page = 1;
                this.getMoviesList(this.props.cat);
                this.cat = this.props.cat;
            }
            let moviesList=null;
            if (this.state.mlist===false){
                moviesList = loader;
            }else if(this.state.mlist.length==0){
                moviesList = this.emptyMsg(); 
            }else if(this.state.mlist.length>0){
                moviesList = (
                    <FlatList
                            data={this.state.mlist}
                            renderItem={({ item }) => <MovieRow
                            movie={item}
                            />}
                        />
                );
            }
            return (
                <View  style={{backgroundColor:"black"}}>

                    {moviesList}
                    <Text>  </Text>

                <View style={{flex: 1,flexDirection:"row",justifyContent: 'center',marginBottom: 36}}>
                {this.state.page>1 && this.state.mlist!=false  && this.state.mlist.length>0 &&
                    <Icon.Button name="backward"
                        title=">"
                        style={{backgroundColor:"green"}}
                        onPress={o => {
                            this.state.page = this.state.page>5 ? this.state.page-5 : 0;
                            this.setState({"mlist":false});
                            this.getMoviesList(this.props.cat);
                        }}
                    /> 
                }
                <View style={{width:7}}></View>
                {this.state.page>1 && this.state.mlist!=false  && this.state.mlist.length>0 &&
                    <Icon.Button name="chevron-left"
                        style={{backgroundColor:"green"}}
                        title="<"
                        disabled={this.state.page<=1 || this.state.mlist.length==0 || this.state.mlist==false}
                        onPress={o => {
                        this.state.page -= 1;
                        this.setState({"mlist":false});
                        this.getMoviesList(this.props.cat);
                        }}
                    />
                }
                    <Text style={{width:30,color:"yellow",textAlign:"center",fontSize:14}}>{this.state.page}</Text>

                    <Icon.Button name="chevron-right"
                        title=">"
                        style={{backgroundColor:"green"}}
                        disabled={this.state.mlist.length==0 || this.state.mlist==false}
                        onPress={o => {
                            this.state.page += 1;
                            this.setState({"mlist":false});
                            this.getMoviesList(this.props.cat);
                        }}
                    /> 
                    <View style={{width:7}}></View>
                    {this.state.mlist!=false && this.state.mlist.length>0 &&
                        <Icon.Button name="forward"
                            title=">"
                            style={{backgroundColor:"green"}}
                            onPress={o => {
                                this.state.page += 5;
                                this.setState({"mlist":false});
                                this.getMoviesList(this.props.cat);
                            }}
                        /> 
                    }

                    </View>
                </View>
                    );
            }
        }
    

export default MoviesListview;