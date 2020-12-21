import React from 'react';
import { StyleSheet, Text, View, Button,TextInput,ScrollView,Modal ,TouchableOpacity} from 'react-native';
import MoviesListview from "../Components/MoviesList"
import MenuDrawer from 'react-native-side-drawer'
import API from "../Libs/API"
import {header_style,buttons_style} from "../Styles/styles";
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';


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
      {'name':'Top Movies','uri':'movies/top',},
      {'name':'Top Series','uri':'tv/top',},
      {'name':'Popular','uri':'movies/popular',},
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
      {'name':'Spanish','uri':'movies/spanish',},
      ]
      this.q = "";

      this.clearCache();
      this.API = new API();
      this.API.getConfigs();
      this.clearCache().then(()=>{
        this.setState({cat:"movies"});
      });
      
  }
  
  async clearCache(){
    if(AsyncStorage==undefined){
      return true;
    }
    await AsyncStorage.setItem("movies", JSON.stringify({}) )
    return AsyncStorage.setItem("cat", JSON.stringify({}) );
    
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
  toggleOpen = () => {console.log(!this.state.openSidMenu);
    this.setState({ openSidMenu: !this.state.openSidMenu });
  };
  openModal = () => {
    this.setState({modalVisible:true});
  };
  openSettings = () => {
    this.props.navigation.navigate('Settings',{API:this.API});
  };
  componentDidMount(){
    this.props.navigation.setOptions(this.navigationOptions);
  }
  navigationOptions ={
    headerStyle: header_style.header, 
    headerTitle: a=>{
      return (
        <View style={{flex:1}}>
          <Text style={header_style.title_home}>{this.state.cat}</Text>
        </View>
      )
      },
    headerLeft: a=>{
      return (
        <View style={{flexDirection:"row"}}>
          <Icon 
          style={[buttons_style.button,{marginLeft:10}]}
          color="#3498db"
          name="reorder"
          onPress={ () => this.toggleOpen() }
          title="Menu"
        />
        <Icon
          style={[buttons_style.button,{color:"#3498db",marginLeft:10}]}
          name ="wrench"
          onPress={ () => this.openSettings() }
          title="Settings"
        />
      </View>
      );
    },
    headerRight: a=>{
      return (
          <Icon
            style={[buttons_style.button,{marginRight:10}]}

            name = "search"
            onPress={ () => this.openModal() }
            title="Search"
          />
      )
      },
  };
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
        <View style={{flex:1}}>
          {this.modal()}
          <MoviesListview API={this.API} cat={this.state.cat} style={{backgroundColor:"black"}} navigation={this.props.navigation}></MoviesListview>
          <MenuDrawer 
            open={this.state.openSidMenu} 
            drawerContent={this.drawerContent()}
            drawerPercentage={60}
            animationTime={250}
            overlay={true}
            opacity={0.4}
            >
          </MenuDrawer>

        </View>
      );
    }
  
}


const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#red",
    width:100,height:100
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