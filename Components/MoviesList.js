import React from 'react';
import { Button,View, Text, StyleSheet, Image , FlatList, TouchableHighlight} from 'react-native';
import { withNavigation } from 'react-navigation';
import loader from "../Components/Loader"
import MoviesAPI from "../Libs/MoviesAPI"

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
                <Image source={{ uri: this.props.movie.img }} style={styles.image} />
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
            this.MAPI.API.getConfigs();
          }
        getMoviesList(cat){
            console.log("getMoviesList",cat,this.state.page);

            page = (cat[0]=="/")?-1:this.state.page;
            this.MAPI.getMovies(cat,page).then(
              data=>{
                this.setState({"mlist":data});
              }
            );
          }

        render() {
            if(this.cat != this.props.cat){
                this.state.mlist = [];
                this.state.page = 1;
                this.getMoviesList(this.props.cat);
                this.cat = this.props.cat;
            }
            
            let moviesList = (this.state.mlist.length==0) ? loader : (
                <FlatList
                        data={this.state.mlist}
                        renderItem={({ item }) => <MovieRow
                        movie={item}
                        />}
                    />
            );
            return (
                <View style={{backgroundColor:"black"}}>

                    {moviesList}
                    <Text>  </Text>

                <View>
                    <Button
                        style={{width:30,height:30}}
                        title="<"
                        disabled={this.state.page<=1 || this.state.mlist.length==0}
                        onPress={o => {
                        this.state.page -= 1;
                        this.setState({"mlist":[]});
                        this.getMoviesList(this.props.cat);
                        }}
                    />
                    <Button
                        title=">"
                        disabled={this.state.mlist.length==0}
                        onPress={o => {
                            this.state.page += 1;
                            this.setState({"mlist":[]});
                            this.getMoviesList(this.props.cat);
                        }}
                    /> 
                    </View>
                </View>
                    );
            }
        }
    

export default MoviesListview;