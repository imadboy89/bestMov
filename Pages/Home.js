import React from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage,TextInput,ScrollView,Modal } from 'react-native';
import MoviesListview from "../Components/MoviesList"
import MenuDrawer from 'react-native-side-drawer'
import API from "../Libs/API"
import {header_style,buttons_style} from "../Styles/styles";
import Icon from 'react-native-vector-icons/FontAwesome';


class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openSidMenu: false,
      cat:"movies",
      modalVisible:false,
    };
    this.cats = [
      {'name':'Home','uri':'movies',},
      {'name':'Favorites','uri':'Favorites',},
      {'name':'Top','uri':'movies/top',},
      {'name':'SCI-FI','uri':'movies/scifi',},
      {'name':'Comedy','uri':'movies/comedy',},
      {'name':'Series','uri':'tv',},
      {'name':'Trending','uri':'trending',},
      {'name':'Bluray','uri':'movies/bluray',},
      {'name':'2019','uri':'movies/2019',},
      {'name':'2018','uri':'movies/2018',},
      {'name':'Bluray-webdl','uri':'movies/bluray-webdl',},
      {'name':'subtitled','uri':'movies/subbed',},
      {'name':'US','uri':'movies/us',},
      {'name':'Arabe','uri':'movies/arab',},
      {'name':'Egypt','uri':'movies/eg',},
      {'name':'Hindi','uri':'movies/hindi',},
      {'name':'Korean','uri':'movies/korean',},
      {'name':'Japanese','uri':'movies/japanese',},
      {'name':'Asian','uri':'movies/japanese-korean-mandarin-chinese-cantonese-thai',},
      {'name':'Horror','uri':'movies/horror',},
      {'name':'Action','uri':'movies/action',},
      {'name':'Romance','uri':'movies/romance',},
      {'name':'Animation','uri':'movies/animation',},
      {'name':'Documentary','uri':'movies/documentary',},
      {'name':'War','uri':'movies/war',},
      ]
      this.q = "";

      this.clearCache();
      this.API = new API();
      this.API.getConfigs();
      this.clearCache().then(()=>{
        this.setState({cat:"movies"});
        this.props.navigation.setParams({
          cat: "Movies",});
      });
      
  }
  
  clearCache(){
    return AsyncStorage.setItem("movies", JSON.stringify({}) ).then(()=>{
      return AsyncStorage.setItem("cat", JSON.stringify({}) );
    })
    
}
  drawerContent = () => {
    let btns = this.cats.map( (category,v) => {
      return (
        <Button 
        style={{margin:5,padding:5}}
        color={(category["name"]=="Favorites")? "#2980b9": (this.state.cat.toLowerCase()==category["name"] ? "#a7cdd0" : "#7f8c8d" )}
        title={category["name"]}  
        key = {category["name"]}
        onPress={()=>{
          this.setState({cat:category["uri"],openSidMenu:false}); 
          this.props.navigation.setParams({cat:category["name"]});
          
          }} />
      );
    } );
    return (
      <View style={{flex:1,paddingBottom:10}}>
        <ScrollView style={{backgroundColor:"#34495e",color:"black",padding:10,flex:0.9}}>
          {btns}
          <Text style={{margin:5,padding:5,color:"white"}} >© 2019-11-28</Text>
          <Text style={{margin:5,padding:5,color:"white"}} >© By ImadBoss</Text>
          <Text style={{margin:5,padding:5}} >--</Text>
          <Text style={{margin:5,padding:5}} >--</Text>
        </ScrollView>
      </View>
    );
  };
  toggleOpen = () => {
    this.setState({ openSidMenu: !this.state.openSidMenu });
  };
  openModal = () => {
    this.setState({modalVisible:true});
  };
  openSettings = () => {
    this.props.navigation.navigate('Settings',{API:this.API});
  };
  componentDidMount(){
    this.props.navigation.setParams({
      cat: this.state.cat,
      toggleOpen  : this.toggleOpen,
      openModal   : this.openModal,
      openSettings: this.openSettings,
     })
  }
  static navigationOptions =  ({ navigation  }) => ({
    headerStyle: header_style.header,
    headerTitle: a=>{
      const {params = {}} = navigation.state;
      return (
        <View style={{flex:1,flexDirection:"row"}}>
          <Icon 
            style={[buttons_style.button,{marginLeft:10}]}
            color="#3498db"
            name="reorder"
            onPress={ () => params.toggleOpen() }
            title="Menu"
          />
          <Icon
            style={[buttons_style.button,{color:"#3498db",marginLeft:10}]}
            name ="wrench"
            onPress={ () => params.openSettings() }
            title="Settings"
          />
          <Text style={header_style.title_home}>{navigation.getParam("cat")}</Text>
        </View>
      )
      },
    headerRight: a=>{
      const {params = {}} = navigation.state;
      return (
          <Icon
            style={buttons_style.button}

            name = "search"
            onPress={ () => params.openModal() }
            title="Search"
          />
      )
      },
  });
  modal(){
    if(this.API.isWeb){
      return null;
    }
    return (
      <Modal 
      animationType="slide"
      transparent={true}
      visible={this.state.modalVisible}
      onRequestClose={() => { this.setState({ modalVisible:false,}); } }
    >
      <View style={{flex:.5,backgroundColor:"#2c3e5066"}}></View>
      <View style={{height:50,backgroundColor:"#7f8c8d",flexDirection:"row"}}>
      <TextInput
        style={{ width: "80%", borderColor: 'gray', borderWidth: 1 ,color:"white",fontSize:18,margin:10}}
        placeholder="Searching for .."
        placeholderTextColor="#ecf0f1"

        onChangeText ={a=>{
          this.q=a;
        }}
        
      />
      <Icon.Button
        
        title="Search"
        name="search"
        onPress={()=>{
          this.setState({cat:"/explore/?q="+this.q, modalVisible:false,});
          this.q = ""
          //this.visibleModal(false);
        }}
      />
      </View>
      <View style={{flex:1,backgroundColor:"#2c3e5066"}}></View>
    </Modal>
    );
  }
    render() {
      
      return (
        <View >
          {this.modal()}
          <MenuDrawer 
            open={this.state.openSidMenu} 
            drawerContent={this.drawerContent()}
            drawerPercentage={60}
            animationTime={250}
            overlay={true}
            opacity={0.4}
            >
          </MenuDrawer>
          
          <ScrollView >
            <MoviesListview API={this.API} cat={this.state.cat} style={{backgroundColor:"black"}} ></MoviesListview>
          </ScrollView>
        </View>
      );
    }
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    zIndex: 0
  },
  animatedBox: {
    flex: 1,
    backgroundColor: "#38C8EC",
    padding: 10
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F04812'
  }
})


export default HomeScreen;